using System.Threading;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace InkBall.Module.Hubs
{
	public class ChatHub : Hub
	{
		public async Task SendMessage(string user, string message)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			string ident = this.Context.UserIdentifier;
			var claimsPrincipal = this.Context.User;

			var items_dict = this.Context.Items;
			string value = "";
			if (items_dict.Count <= 0)
			{
				value = claimsPrincipal.FindFirstValue("InkBallUserId");
				value = $"{ident ?? ""}_{value ?? ""}";
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
				value = "more than 1";
			}

			await Clients.Others.SendAsync("ReceiveMessage", user, $"{message} {value}", token);
		}
	}
}
