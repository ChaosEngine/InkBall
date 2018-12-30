using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module.Hubs
{
	public interface IChatClient
	{
		Task ServerToClientPoint(InkBallPointViewModel point, string user);

		Task ServerToClientPath(InkBallPathViewModel path, string user);

		Task ServerToClientPing(PingCommand ping, string user);
	}

	public interface IChatServer
	{
		Task ClientToServerPoint(InkBallPointViewModel point);

		Task ClientToServerPath(InkBallPathViewModel path);

		Task ClientToServerPing(PingCommand ping);

	}

	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class ChatHub : Hub<IChatClient>, IChatServer
	{
		#region Fields

		public const string HubName = "chatHub";

		//Allowed origins here
		internal static readonly SynchronizedCache<string> WebSocketAllowedOrigins = new SynchronizedCache<string>();

		//temporary randomizer object
		private static readonly Random _randomizer = new Random(Environment.TickCount);

		private readonly GamesContext _dbContext;
		private readonly ILogger<ChatHub> _logger;

		#endregion Fields

		#region Properties

		public IPlayer<InkBallPointViewModel, InkBallPathViewModel> ThisPlayer { get; private set; }

		public IPlayer<InkBallPointViewModel, InkBallPathViewModel> OtherPlayer { get; private set; }

		public int? ThisGameID { get; private set; }

		public InkBallGameViewModel ThisGame { get; private set; }

		public string OtherUserIdentifier { get; private set; }

		public string ThisUserName { get; private set; }

		#endregion Properties

		#region Private methods

		private (int gameID, int playerID) GetGameIDFromAccessToken(StringValues access_token)
		{
			string value = access_token.FirstOrDefault();
			if (value.StartsWith("bearer ", StringComparison.InvariantCultureIgnoreCase))
				value = value.Substring("bearer ".Length);

			var queryDictionary = QueryHelpers.ParseQuery(value);

			if (!queryDictionary.TryGetValue("iGameID", out StringValues str) || !int.TryParse(str, out int game_id))
			{
				game_id = 0;
			}
			if (!queryDictionary.TryGetValue("iPlayerID", out str) || !int.TryParse(str, out int player_id))
			{
				player_id = 0;
			}

			return (game_id, player_id);
		}

		private void ValidateOriginHeaderAndAccessToken(HttpContext ctx)
		{
			if (ctx?.Request != null)
			{
				//Index page populates WebSocketAllowedOrigins
				if (WebSocketAllowedOrigins.Any() && ctx.Request.Headers.TryGetValue(HeaderNames.Origin, out var origin)
					&& ctx.Request.Headers.TryGetValue(HeaderNames.Upgrade, out var upgrade))
				{
					if (string.Equals(upgrade, "websocket", StringComparison.InvariantCultureIgnoreCase))
					{
						if (!string.IsNullOrEmpty(origin) && !WebSocketAllowedOrigins.ContainsValue(origin))
						{
							throw new UnauthorizedAccessException("Origin not allowed!");
						}
					}
				}

				//Authorization: Bearer iGameID=123
				//or Query: iGameID=123
				if (!(ctx.Request.Headers.TryGetValue(HeaderNames.Authorization, out var access_token)
					|| ctx.Request.Query.TryGetValue("access_token", out access_token))
					|| string.IsNullOrEmpty(access_token))
				{
					throw new UnauthorizedAccessException($"{nameof(access_token)} not passed!");
				}

				var token_vars = GetGameIDFromAccessToken(access_token);
				ThisGameID = token_vars.gameID;
			}
		}

		private async Task LoadUserAndPLayerStructures(CancellationToken token)
		{
			var claimsPrincipal = this.Context.User;
			var this_UserIdentifier = this.Context.UserIdentifier;
			ThisUserName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

			if (!(this.Context.Items.TryGetValue(nameof(ThisPlayer), out object pobj) && pobj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> this_Player))
			{
				//get player from db
				InkBallPlayer dbPlayer = await _dbContext.InkBallPlayer.Include(u => u.User).FirstOrDefaultAsync(p => p.User.sExternalId == this_UserIdentifier, token);
				if (dbPlayer == null)
					throw new NullReferenceException("no player");

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != dbPlayer.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId");

				this_Player = new InkBallPlayerViewModel(dbPlayer);
				this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			ThisPlayer = this_Player;


			if (
				!(this.Context.Items.TryGetValue(nameof(ThisGame), out object gObj) && gObj is InkBallGameViewModel game)
				|| !(this.Context.Items.TryGetValue(nameof(OtherPlayer), out object opObj) && opObj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> other_Player_cached)
				|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out var ouidenObj) && ouidenObj is string other_UserIdentifier_cached)
				)
			{
				//get game from db
				InkBallGame dbGame = await _dbContext.InkBallGame
					.Include(gp1 => gp1.Player1)
						.ThenInclude(p1 => p1.User)
					.Include(gp2 => gp2.Player2)
						.ThenInclude(p2 => p2.User)
					.FirstOrDefaultAsync(
						w => (!ThisGameID.HasValue || w.iId == ThisGameID.Value)
						&& (w.iPlayer1Id == this_Player.iId || w.iPlayer2Id == this_Player.iId)
						&& (w.Player1.User.sExternalId == this_UserIdentifier || w.Player2.User.sExternalId == this_UserIdentifier)
						&& (w.GameState == InkBallGame.GameStateEnum.ACTIVE || w.GameState == InkBallGame.GameStateEnum.AWAITING)
					, token);
				if (dbGame == null)
					throw new NullReferenceException("game == null");
				if (!(dbGame.iPlayer1Id == this_Player.iId || (dbGame.iPlayer2Id.HasValue && dbGame.iPlayer2Id.Value == this_Player.iId)))
					throw new ArgumentException("no player exist in that game");

				bool bIsPlayer1;
				if (this_Player.iId == dbGame.iPlayer1Id)
					bIsPlayer1 = true;
				else if (this_Player.iId == dbGame.iPlayer2Id)
					bIsPlayer1 = false;
				else
					throw new NotSupportedException("player not found");
				dbGame.bIsPlayer1 = bIsPlayer1;

				game = new InkBallGameViewModel(dbGame);
				this.Context.Items[nameof(ThisGame)] = game;



				other_Player_cached = null;
				other_UserIdentifier_cached = null;
				if (
					!(this.Context.Items.TryGetValue(nameof(OtherPlayer), out opObj) && opObj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> other_Player)
					|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out ouidenObj) && ouidenObj is string other_UserIdentifier)
					)
				{
					//obtain another player; co-player
					InkBallPlayer otherDbPlayer = dbGame.Player1.User.sExternalId == this_UserIdentifier ? dbGame.Player2 : dbGame.Player1;
					if (otherDbPlayer != null)
					{
						if (otherDbPlayer.iId == this_Player.iId || OtherUserIdentifier == this_UserIdentifier)
							throw new ArgumentException("other_Player_db.iId == this_Player.iId || other_UserIdentifier == this_UserIdentifier");
						other_Player = other_Player_cached = new InkBallPlayerViewModel(otherDbPlayer);
						other_UserIdentifier = other_UserIdentifier_cached = otherDbPlayer.User.sExternalId;
					}
					else
					{
						other_Player = other_Player_cached = null;
						other_UserIdentifier = other_UserIdentifier_cached = null;
					}
					this.Context.Items[nameof(OtherPlayer)] = other_Player;
					this.Context.Items[nameof(OtherUserIdentifier)] = other_UserIdentifier;
				}
				OtherPlayer = other_Player;
				OtherUserIdentifier = other_UserIdentifier;


			}
			ThisGame = game;
			OtherPlayer = other_Player_cached;
			OtherUserIdentifier = other_UserIdentifier_cached;

		}

		#endregion Private methods

		public ChatHub(GamesContext dbContext, ILogger<ChatHub> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		public override async Task OnConnectedAsync()
		{
			ValidateOriginHeaderAndAccessToken(this.Context.GetHttpContext());

			await LoadUserAndPLayerStructures(this.Context.ConnectionAborted);

			await base.OnConnectedAsync();
		}

		#region IChatServer implementation

		public async Task ClientToServerPoint(InkBallPointViewModel point)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadUserAndPLayerStructures(token);

			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;

			try
			{
				if (point == null || point.iPlayerId <= 0 || point.iGameId <= 0 || point.iGameId != ThisGame.iId)
					throw new ArgumentException("bad point");
				if (point.iPlayerId != ThisPlayer.iId && point.iPlayerId != OtherPlayer.iId)
					throw new ArgumentException("bad Player ID");

				var query = await (from pl in _dbContext.InkBallPlayer
								   let gm = (_dbContext.InkBallGame.FirstOrDefault(
									   w => w.iId == point.iGameId
									   && (w.GameState == InkBallGame.GameStateEnum.ACTIVE || w.GameState == InkBallGame.GameStateEnum.AWAITING)
									   && (w.iPlayer1Id == point.iPlayerId || w.iPlayer2Id == point.iPlayerId)
								   ))
								   let point_exist = (_dbContext.InkBallPoint.Any(pts =>
									   pts.iGameId == ThisGame.iId && pts.iPlayerId == point.iPlayerId
									   && pts.iX == point.iX && pts.iY == point.iY
								   ))
								   where pl.iId == point.iPlayerId
								   select new
								   {
									   Game = gm,
									   Exist = point_exist,
									   Player = pl
								   }
							).FirstOrDefaultAsync(token);

				var point_already_placed = query.Exist;
				var db_point_game = query.Game;
				var db_point_player = query.Player;
				if (point_already_placed || db_point_game == null)
					return;

				var db_point = new InkBallPoint
				{
					//iId = point.iId,
					iGameId = ThisGame.iId,
					iPlayerId = point.iPlayerId,
					iX = point.iX,
					iY = point.iY,
					Status = point.Status,
					iEnclosingPathId = point.iEnclosingPathId <= 0 ? null : point.iEnclosingPathId
				};
				InkBallPointViewModel new_point;

				using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
				{
					try
					{
						await _dbContext.InkBallPoint.AddAsync(db_point, token);
						db_point_game.bIsPlayer1Active = !db_point_game.bIsPlayer1Active;

						new_point = new InkBallPointViewModel(db_point);
						db_point_player.sLastMoveCode = JsonConvert.SerializeObject(new_point);
						await _dbContext.SaveChangesAsync(token);

						trans.Commit();

						ThisGame.bIsPlayer1Active = db_point_game.bIsPlayer1Active;
						if (ThisPlayer.iId == db_point_player.iId)
						{
							ThisPlayer.sLastMoveCode = db_point_player.sLastMoveCode;
							this.Context.Items[nameof(ThisPlayer)] = ThisPlayer;
						}
						else
						{
							OtherPlayer.sLastMoveCode = db_point_player.sLastMoveCode;
							this.Context.Items[nameof(OtherPlayer)] = OtherPlayer;
						}
						this.Context.Items[nameof(ThisGame)] = ThisGame;
					}
					catch (Exception ex)
					{
						trans.Rollback();
						_logger.LogError(ex, nameof(_dbContext.SurrenderGameFromPlayerAsync));
						throw;
					}
				}

				var this_UserIdentifier = this.Context.UserIdentifier;

				// await Clients.User(OtherUserIdentifier).ServerToClientPoint(new_point, ThisUserName);
				await base.Clients.Users(this_UserIdentifier, OtherUserIdentifier).ServerToClientPoint(new_point, ThisUserName);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task ClientToServerPath(InkBallPathViewModel path)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadUserAndPLayerStructures(token);



			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;

			try
			{
				if (path == null || path.iPlayerId <= 0 || path.iGameId <= 0 || path.iGameId != ThisGame.iId)
					throw new ArgumentException("bad path");
				if (path.iPlayerId != ThisPlayer.iId && path.iPlayerId != OtherPlayer.iId)
					throw new ArgumentException("bad Player ID");


				var new_path = new InkBallPathViewModel(path);

				await Clients.User(OtherUserIdentifier).ServerToClientPath(new_path, ThisUserName);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task ClientToServerPing(PingCommand ping)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadUserAndPLayerStructures(token);



			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;

			var claimsPrincipal = this.Context.User;
			string userId = claimsPrincipal.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
			if (this.Context.Items.Count > 1)
			{
				System.Type t = typeof(System.Net.WebSockets.WebSocketProtocol);
				userId = "more than 1 " + t.ToString();
			}


			try
			{
				if (ping == null)
					throw new NullReferenceException("ping == null");

				var new_ping = new PingCommand(ping);

				await Clients.User(OtherUserIdentifier).ServerToClientPing(new_ping, ThisUserName);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		#endregion IChatServer implementation
	}
}
