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

		Task ServerToClientPlayerJoin(PlayerJoiningCommand join);

		Task ServerToClientPlayerSurrender(PlayerSurrenderingCommand surrender);

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

		public InkBallPlayer ThisPlayer { get; private set; }

		public InkBallPlayer OtherPlayer { get; private set; }

		public int? ThisGameID
		{
			get
			{
				if (base.Context.Items.TryGetValue(nameof(ThisGameID), out object oObj) && oObj is int iVal)
					return iVal;
				return null;
			}
			private set
			{
				base.Context.Items[nameof(ThisGameID)] = value.GetValueOrDefault(0);
			}
		}

		public int? ThisPlayerID
		{
			get
			{
				if (base.Context.Items.TryGetValue(nameof(ThisPlayerID), out object oObj) && oObj is int iVal)
					return iVal;
				return null;
			}
			private set
			{
				base.Context.Items[nameof(ThisPlayerID)] = value.GetValueOrDefault(0);
			}
		}

		public InkBallGame ThisGame { get; private set; }

		internal string ThisUserIdentifier => base.Context.UserIdentifier;

		public string OtherUserIdentifier { get; private set; }

		public string ThisUserName { get; private set; }

		#endregion Properties

		#region Private methods

		private void ValidateOriginHeaderAndAccessToken(HttpContext ctx)
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
		}

		private (int gameID, int playerID) GetGameIdAndPlayerIDFromContext(HttpContext ctx)
		{
			//Authorization: Bearer iGameID=123 or Query: iGameID=123&iPlayerID=456
			if (!(ctx.Request.Headers.TryGetValue(HeaderNames.Authorization, out var access_token)
				|| ctx.Request.Query.TryGetValue("access_token", out access_token))
				|| string.IsNullOrEmpty(access_token))
			{
				throw new UnauthorizedAccessException($"{nameof(access_token)} not passed!");
			}

			var token_vars = GetGameIDFromAccessToken();
			return token_vars;

			//
			// private internal function
			//
			(int gameID, int playerID) GetGameIDFromAccessToken()
			{
				string value = access_token.FirstOrDefault();
				if (value.StartsWith("bearer ", StringComparison.InvariantCultureIgnoreCase))
					value = value.Substring("bearer ".Length);

				var queryDictionary = QueryHelpers.ParseQuery(value);

				if (!queryDictionary.TryGetValue("iGameID", out StringValues str) || !int.TryParse(str, out int game_id))
					game_id = 0;

				if (!queryDictionary.TryGetValue("iPlayerID", out str) || !int.TryParse(str, out int player_id))
					player_id = 0;

				return (game_id, player_id);
			}
		}

		private async Task LoadGameAndPlayerStructures(CancellationToken token)
		{
			var claimsPrincipal = this.Context.User;
			var this_UserIdentifier = ThisUserIdentifier;

			//IPlayer<InkBallPoint, InkBallPath> this_Player = await GetPlayer(claimsPrincipal, this_UserIdentifier, token);
			//ThisPlayer = this_Player;

			(InkBallGame game, InkBallPlayer this_Player) = await GetGameAndThisPlayer(claimsPrincipal, this_UserIdentifier,
				ThisGameID.Value, ThisPlayerID.Value, token);
			ThisGame = game;
			ThisPlayer = this_Player;

			ThisUserName = ThisPlayer.User.UserName;

			(InkBallPlayer other_Player, string other_UserIdentifier) = GetOtherPlayer(ThisGame, this_UserIdentifier, this_Player);
			OtherPlayer = other_Player;
			OtherUserIdentifier = other_UserIdentifier;
		}

		private (InkBallPlayer other_Player, string other_UserIdentifier) GetOtherPlayer(InkBallGame game,
			string this_UserIdentifier, IPlayer<InkBallPoint, InkBallPath> this_Player)
		{
			InkBallPlayer other_Player;
			string other_UserIdentifier;
			//if (
			//	!(this.Context.Items.TryGetValue(nameof(OtherPlayer), out var opObj) && opObj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> other_Player)
			//	|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out var ouidenObj) && ouidenObj is string other_UserIdentifier)
			//	)
			{
				//obtain another player; co-player
				InkBallPlayer otherDbPlayer = game.Player1.User.sExternalId == this_UserIdentifier ? game.Player2 : game.Player1;
				if (otherDbPlayer != null)
				{
					if (otherDbPlayer.iId == this_Player.iId || OtherUserIdentifier == this_UserIdentifier)
						throw new ArgumentException("both game players ar the same");
					other_Player = otherDbPlayer;
					other_UserIdentifier = otherDbPlayer.User.sExternalId;
				}
				else
				{
					other_Player = null;
					other_UserIdentifier = null;
				}
				//this.Context.Items[nameof(OtherPlayer)] = other_Player;
				//this.Context.Items[nameof(OtherUserIdentifier)] = other_UserIdentifier;
			}

			return (other_Player, other_UserIdentifier);
		}

		private async Task<(InkBallGame, InkBallPlayer)> GetGameAndThisPlayer(ClaimsPrincipal claimsPrincipal, string this_UserIdentifier,
			int gameID, int playerID, CancellationToken token)
		{
			InkBallGame game;
			InkBallPlayer this_Player;
			//if (!(this.Context.Items.TryGetValue(nameof(ThisGame), out object gObj) && gObj is InkBallGameViewModel game))
			{
				//get game from db
				InkBallGame dbGame = await _dbContext.InkBallGame
				.Include(gp1 => gp1.Player1)
					.ThenInclude(p1 => p1.User)
				.Include(gp2 => gp2.Player2)
					.ThenInclude(p2 => p2.User)
				.FirstOrDefaultAsync(
					w => w.iId == gameID
					&& (w.iPlayer1Id == playerID || w.iPlayer2Id == playerID)
					&& (w.Player1.User.sExternalId == this_UserIdentifier || w.Player2.User.sExternalId == this_UserIdentifier)
					&& (w.GameState == InkBallGame.GameStateEnum.ACTIVE || w.GameState == InkBallGame.GameStateEnum.AWAITING)
				, token);
				if (dbGame == null)
					throw new NullReferenceException("game == null");
				if (!(dbGame.iPlayer1Id == ThisPlayerID || (dbGame.iPlayer2Id.HasValue && dbGame.iPlayer2Id.Value == ThisPlayerID)))
					throw new ArgumentException("no player exist in that game");

				bool bIsPlayer1;
				if (this_UserIdentifier == dbGame.Player1.User.sExternalId)
				{
					this_Player = dbGame.Player1;
					bIsPlayer1 = true;
				}
				else if (this_UserIdentifier == dbGame.Player2.User.sExternalId)
				{
					this_Player = dbGame.Player2;
					bIsPlayer1 = false;
				}
				else
					throw new NotSupportedException("player not found");
				dbGame.bIsPlayer1 = bIsPlayer1;

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != this_Player.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId");

				game = dbGame;
				//this.Context.Items[nameof(ThisGame)] = game;
				//this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			return (game, this_Player);
		}

		private async Task<IPlayer<InkBallPoint, InkBallPath>> GetPlayer(ClaimsPrincipal claimsPrincipal, string this_UserIdentifier,
			CancellationToken token)
		{
			IPlayer<InkBallPoint, InkBallPath> this_Player;
			//if (!(this.Context.Items.TryGetValue(nameof(ThisPlayer), out object pobj) && pobj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> this_Player))
			{
				//get player from db
				InkBallPlayer dbPlayer = await _dbContext.InkBallPlayer.Include(u => u.User).FirstOrDefaultAsync(p => p.User.sExternalId == this_UserIdentifier, token);
				if (dbPlayer == null)
					throw new NullReferenceException("no player");

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != dbPlayer.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId");

				this_Player = dbPlayer;
				this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			return this_Player;
		}

		#endregion Private methods

		public ChatHub(GamesContext dbContext, ILogger<ChatHub> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		public override async Task OnConnectedAsync()
		{
			var ctx = this.Context.GetHttpContext();

			ValidateOriginHeaderAndAccessToken(ctx);

			(int gameID, int playerID) = GetGameIdAndPlayerIDFromContext(ctx);
			ThisGameID = gameID;
			ThisPlayerID = playerID;

			await base.OnConnectedAsync();
		}

		#region IChatServer implementation

		public async Task ClientToServerPoint(InkBallPointViewModel point)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);

			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
			{
				_logger.LogWarning("something bad ThisGame == null || ThisPlayer == null || OtherPlayer == null || " +
					"string.IsNullOrEmpty(OtherUserIdentifier) || string.IsNullOrEmpty(ThisUserName)");
				return;
			}

			try
			{
				var current_player_color = ThisGame.IsThisPlayerPlayingWithRed() ? InkBallPoint.StatusEnum.POINT_FREE_RED : InkBallPoint.StatusEnum.POINT_FREE_BLUE;

				if (point == null || point.iGameId != ThisGame.iId || point.Status != current_player_color)
					throw new ArgumentException("bad point");
				if (point.iPlayerId != ThisPlayer.iId && point.iPlayerId != OtherPlayer.iId)
					throw new ArgumentException("bad Player ID");

				var already_placed = await _dbContext.InkBallPoint.AnyAsync(pts =>
									pts.iGameId == ThisGame.iId && pts.iPlayerId == point.iPlayerId
									&& pts.iX == point.iX && pts.iY == point.iY
									, token);
				var db_point_player = ThisPlayer.iId == point.iPlayerId ? ThisPlayer : OtherPlayer;
				if (already_placed)
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
						ThisGame.bIsPlayer1Active = !ThisGame.bIsPlayer1Active;

						new_point = new InkBallPointViewModel(db_point);
						db_point_player.sLastMoveCode = JsonConvert.SerializeObject(new_point);
						await _dbContext.SaveChangesAsync(token);

						trans.Commit();
					}
					catch (Exception ex)
					{
						trans.Rollback();
						_logger.LogError(ex, nameof(_dbContext.SurrenderGameFromPlayerAsync));
						throw;
					}
				}

				// await Clients.User(OtherUserIdentifier).ServerToClientPoint(new_point, ThisUserName);
				await base.Clients.Users(ThisUserIdentifier, OtherUserIdentifier).ServerToClientPoint(new_point, ThisUserName);
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

			await LoadGameAndPlayerStructures(token);

			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
			{
				_logger.LogWarning("something bad ThisGame == null || ThisPlayer == null || OtherPlayer == null || " +
					"string.IsNullOrEmpty(OtherUserIdentifier) || string.IsNullOrEmpty(ThisUserName)");
				return;
			}

			try
			{
				var current_player_color = ThisGame.IsThisPlayerPlayingWithRed() ? InkBallPoint.StatusEnum.POINT_FREE_RED : InkBallPoint.StatusEnum.POINT_FREE_BLUE;

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

			await LoadGameAndPlayerStructures(token);



			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;

			var claimsPrincipal = this.Context.User;
			string userId = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
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
