using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InkBall.Module.Hubs
{
	public interface IChatClient
	{
		Task ReceiveMessage(object objPoint, string user, string message);
	}

	public interface IChatServer
	{
		Task SendMessage(object objPoint, string user, string message);
	}

	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class ChatHub : Hub<IChatClient>, IChatServer
	{
		public const string HubName = "chatHub";

		//Allowed origins here
		internal static readonly SynchronizedCache<string> WebSocketAllowedOrigins = new SynchronizedCache<string>();

		private static readonly Random _randomizer = new Random(Environment.TickCount);

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

		public override Task OnConnectedAsync()
		{
			EnsureOriginHeaderIsValid(this.Context.GetHttpContext());

			return base.OnConnectedAsync();
		}

		public async Task SendMessage(object objPoint, string user, string message)
		{
			//CancellationToken token = this.Context.ConnectionAborted;

			// string ident = this.Context.UserIdentifier;
			var claimsPrincipal = this.Context.User;

			var items_dict = this.Context.Items;
			string value = "";
			int player_id = 0;
			if (items_dict.Count <= 0)
			{
				value = claimsPrincipal.FindFirstValue("InkBallUserId");

				int.TryParse(value, out player_id);

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
				iGameId = 0,
				iPlayerId = player_id,
				iX = _randomizer.Next(100),
				iY = _randomizer.Next(100),
				Status = InkBallPoint.StatusEnum.POINT_FREE,
				iEnclosingPathId = 0,
				Message = message
			};

			// await Clients.All.SendAsync("ReceiveMessage", user, $"{message} {value}", token);
			await Clients.All.ReceiveMessage(new_point, user, $"{message} {value}");
		}
	}
}
