using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
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
		Task ReceiveMessage(IPoint point, string user/*, string message*/);
	}

	public interface IChatServer
	{
		Task SendMessage(JObject jPoint/*, string user, string message*/);
	}

	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class ChatHub : Hub<IChatClient>, IChatServer
	{
		public const string HubName = "chatHub";

		//Allowed origins here
		internal static readonly SynchronizedCache<string> WebSocketAllowedOrigins = new SynchronizedCache<string>();
		//temporary randomizer object
		private static readonly Random _randomizer = new Random(Environment.TickCount);

		private readonly GamesContext _dbContext;

		private void EnsureOriginHeaderIsValid(HttpContext ctx)
		{
			if (WebSocketAllowedOrigins.Any() && ctx?.Request != null)
			{
				if (string.Equals(ctx.Request.Headers["Upgrade"], "websocket", StringComparison.InvariantCultureIgnoreCase))
				{
					var origin = ctx.Request.Headers["Origin"];

					if (!string.IsNullOrEmpty(origin) && !WebSocketAllowedOrigins.ContainsValue(origin))
					{
						//ctx.Abort();
						throw new UnauthorizedAccessException("Origin not allowed!");
					}
				}
			}
		}

		public ChatHub(GamesContext dbContext)
		{
			_dbContext = dbContext;
		}

		public override Task OnConnectedAsync()
		{
			EnsureOriginHeaderIsValid(this.Context.GetHttpContext());

			return base.OnConnectedAsync();
		}

		public async Task SendMessage(JObject jPoint/*, string user, string message*/)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			InkBallPointViewModel point = jPoint.ToObject<InkBallPointViewModel>();
			string message = point.Message;
			if (point.iPlayerId <= 0 || point.iGameId <= 0)
				throw new NullReferenceException("point.iPlayerId <= 0 || point.iGameId <= 0");


			var claimsPrincipal = this.Context.User;
			var this_UserIdentifier = this.Context.UserIdentifier;
			var this_UserName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

			//get player from db
			InkBallPlayer this_Player = await _dbContext.InkBallPlayer/*.Include(u => u.User)*/.FirstOrDefaultAsync(p => p.iId == point.iPlayerId, token);
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
				.FirstOrDefaultAsync(w => w.iId == point.iGameId && (w.iPlayer1Id == this_Player.iId || w.iPlayer2Id == this_Player.iId)
				, token);
			if (game == null)
				throw new NullReferenceException("game == null");
			if (!(game.iPlayer1Id == point.iPlayerId || (game.iPlayer2Id.HasValue && game.iPlayer2Id.Value == point.iPlayerId)))
				throw new ApplicationException("no player exist in that game");

			//obtain another player; co-player
			InkBallPlayer other_Player = game.Player1.User.sExternalId == this_UserIdentifier ? game.Player2 : game.Player1;
			if (other_Player == null)
				return;
			string other_UserIdentifier = other_Player.User.sExternalId;



			var items_dict = this.Context.Items;
			if (items_dict.Count <= 0)
			{
				value = $"{claimsPrincipal.Identity.Name}_{value ?? ""}";
				items_dict.Add("user_data", value);
			}
			if (items_dict.Count == 1)
			{
				var elem = items_dict.FirstOrDefault();
				if (elem.Value != null)
					value = elem.Value.ToString();
			}
			else
			{
				System.Type t = typeof(System.Net.WebSockets.WebSocketProtocol);
				value = "more than 1 " + t.ToString();
			}

			var new_point = new InkBallPointViewModel
			{
				iId = 0,
				iGameId = game.iId,
				iPlayerId = this_Player.iId,
				iX = _randomizer.Next(100),
				iY = _randomizer.Next(100),
				Status = InkBallPoint.StatusEnum.POINT_FREE,
				iEnclosingPathId = 0,
				Message = message
			};

			// await Clients.All.SendAsync("ReceiveMessage", user, $"{message} {value}", token);
			await Clients.User(other_UserIdentifier).ReceiveMessage(new_point, this_UserName/*, $"{message} {value}"*/);
		}
	}
}
