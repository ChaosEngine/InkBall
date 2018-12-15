using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module.Hubs
{
	public interface IChatClient
	{
		Task ReceiveMessage(IPoint point, string user);
	}

	public interface IChatServer
	{
		Task SendMessage(JObject jPoint);
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

		#endregion Fields

		#region Properties

		public IPlayer ThisPlayer { get; private set; }

		public IPlayer OtherPlayer { get; private set; }

		public int? ThisGameID { get; private set; }

		public InkBallGameViewModel ThisGame { get; private set; }

		public string OtherUserIdentifier { get; private set; }

		public string ThisUserName { get; private set; }
		
		#endregion Properties

		private int? GetGameIDFromAccessToken(StringValues access_token)
		{
			string value = access_token.FirstOrDefault();
			if (value.StartsWith("bearer ", StringComparison.InvariantCultureIgnoreCase))
				value = value.Substring("bearer ".Length);
			var tab = value.Split(new char[] { '=' }, 2, StringSplitOptions.RemoveEmptyEntries);
			if (tab.Length > 1)
			{
				string sGameID = tab[0];
				int game_id = -1;
				if (int.TryParse(tab[1], out game_id))
					return game_id;
			}
			return null;
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

				int? game_id = GetGameIDFromAccessToken(access_token);
				ThisGameID = game_id;
			}
		}

		private async Task LoadUserAndPLayerStructures(CancellationToken token)
		{
			var claimsPrincipal = this.Context.User;
			var this_UserIdentifier = this.Context.UserIdentifier;
			ThisUserName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

			if (!(this.Context.Items.TryGetValue(nameof(ThisPlayer), out object pobj) && pobj is IPlayer this_Player))
			{
				//get player from db
				InkBallPlayer db_player = await _dbContext.InkBallPlayer.Include(u => u.User).FirstOrDefaultAsync(p => p.User.sExternalId == this_UserIdentifier, token);
				if (db_player == null)
					throw new NullReferenceException("no player");

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != db_player.iUserId)
					throw new ApplicationException("this_UserId != this_Player.iUserId");

				this_Player = new InkBallPlayerViewModel(db_player);
				this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			ThisPlayer = this_Player;


			if (
				!(this.Context.Items.TryGetValue(nameof(ThisGame), out object gObj) && gObj is InkBallGameViewModel game)
				|| !(this.Context.Items.TryGetValue(nameof(OtherPlayer), out object opObj) && opObj is IPlayer other_Player_cached)
				|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out var ouidenObj) && ouidenObj is string other_UserIdentifier_cached)
				)
			{
				//get game from db
				InkBallGame db_game = await _dbContext.InkBallGame
					.Include(gp1 => gp1.Player1)
						.ThenInclude(p1 => p1.User)
					.Include(gp2 => gp2.Player2)
						.ThenInclude(p2 => p2.User)
					.FirstOrDefaultAsync(
						w => (!ThisGameID.HasValue || w.iId == ThisGameID.Value) && (w.iPlayer1Id == this_Player.iId || w.iPlayer2Id == this_Player.iId)
						&& (w.Player1.User.sExternalId == this_UserIdentifier || w.Player2.User.sExternalId == this_UserIdentifier)
					, token);
				if (db_game == null)
					throw new NullReferenceException("game == null");
				if (!(db_game.iPlayer1Id == this_Player.iId || (db_game.iPlayer2Id.HasValue && db_game.iPlayer2Id.Value == this_Player.iId)))
					throw new ApplicationException("no player exist in that game");
				game = new InkBallGameViewModel(db_game);
				this.Context.Items[nameof(ThisGame)] = game;



				other_Player_cached = null;
				other_UserIdentifier_cached = null;
				if (
					!(this.Context.Items.TryGetValue(nameof(OtherPlayer), out opObj) && opObj is IPlayer other_Player)
					|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out ouidenObj) && ouidenObj is string other_UserIdentifier)
					)
				{
					//obtain another player; co-player
					InkBallPlayer other_Player_db = db_game.Player1.User.sExternalId == this_UserIdentifier ? db_game.Player2 : db_game.Player1;
					if (other_Player_db != null)
					{
						if (other_Player_db.iId == this_Player.iId || OtherUserIdentifier == this_UserIdentifier)
							throw new ApplicationException("other_Player_db.iId == this_Player.iId || other_UserIdentifier == this_UserIdentifier");
						other_Player = other_Player_cached = new InkBallPlayerViewModel(other_Player_db);
						other_UserIdentifier = other_UserIdentifier_cached = other_Player_db.User.sExternalId;
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

		public ChatHub(GamesContext dbContext)
		{
			_dbContext = dbContext;
		}

		public override async Task OnConnectedAsync()
		{
			ValidateOriginHeaderAndAccessToken(this.Context.GetHttpContext());

			await LoadUserAndPLayerStructures(this.Context.ConnectionAborted);

			await base.OnConnectedAsync();
		}

		public async Task SendMessage(JObject jPoint)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadUserAndPLayerStructures(this.Context.ConnectionAborted);



			InkBallPointViewModel point = jPoint.ToObject<InkBallPointViewModel>();
			if (point.iPlayerId <= 0 || point.iGameId <= 0)
				throw new NullReferenceException("point.iPlayerId <= 0 || point.iGameId <= 0");

			#region Old code

			/*var claimsPrincipal = this.Context.User;
			var this_UserIdentifier = this.Context.UserIdentifier;
			var this_UserName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

			//get player from db
			InkBallPlayer this_Player = await _dbContext.InkBallPlayer
				//.Include(u => u.User)
				.FirstOrDefaultAsync(p => p.iId == point.iPlayerId, token);
			if (this_Player == null)
				throw new NullReferenceException("no player");

			//additional validation
			string value = claimsPrincipal.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
			int.TryParse(value, out int this_UserId);
			if (this_UserId != this_Player.iUserId)
				throw new ApplicationException("this_UserId != this_Player.iUserId");

			//get game from db
			InkBallGame game = await _dbContext.InkBallGame
				.Include(gp1 => gp1.Player1)
					.ThenInclude(p1 => p1.User)
				.Include(gp2 => gp2.Player2)
					.ThenInclude(p2 => p2.User)
				.FirstOrDefaultAsync(
					w => w.iId == point.iGameId && (w.iPlayer1Id == this_Player.iId || w.iPlayer2Id == this_Player.iId)
					&& (w.Player1.User.sExternalId == this_UserIdentifier || w.Player2.User.sExternalId == this_UserIdentifier)
				, token);
			if (game == null)
				throw new NullReferenceException("game == null");
			if (!(game.iPlayer1Id == point.iPlayerId || (game.iPlayer2Id.HasValue && game.iPlayer2Id.Value == point.iPlayerId)))
				throw new ApplicationException("no player exist in that game");

			//obtain another player; co-player
			InkBallPlayer other_Player = game.Player1.User.sExternalId == this_UserIdentifier ? game.Player2 : game.Player1;
			if (other_Player == null)
				return;
			string other_UserIdentifier = other_Player.User.sExternalId;*/

			#endregion Old code

			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;



			var claimsPrincipal = this.Context.User;
			string value = claimsPrincipal.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
			if (this.Context.Items.Count > 1)
			{
				System.Type t = typeof(System.Net.WebSockets.WebSocketProtocol);
				value = "more than 1 " + t.ToString();
			}

			var new_point = new InkBallPointViewModel
			{
				iId = 0,
				iGameId = ThisGame.iId,
				iPlayerId = ThisPlayer.iId,
				iX = _randomizer.Next(100),
				iY = _randomizer.Next(100),
				Status = InkBallPoint.StatusEnum.POINT_FREE,
				iEnclosingPathId = 0,
				Message = point.Message
			};

			await Clients.User(OtherUserIdentifier).ReceiveMessage(new_point, ThisUserName);
		}
	}
}
