#define LOAD_POINTS_AND_PATHS_FROM_SIGNALR

using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = Constants.InkBallPolicyName)]
	public class GameModel : BasePageModel
	{
		public const string ASPX = "Game";

		private readonly IOptions<HubOptions> _signalRHubOptions;

		public (IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points) PlayerPointsAndPaths { get; protected set; }

		public HtmlString PointsAsJavaScriptArray
		{
			get { return new HtmlString(CommonPoint.GetPointsAsJavaScriptArrayForPage(PlayerPointsAndPaths.Points)); }
		}

		public HtmlString PathsAsJavaScriptArray
		{
			get { return new HtmlString(InkBallPath.GetPathsAsJavaScriptArrayForPage(PlayerPointsAndPaths.Paths)); }
		}

		public bool IsReadonly { get; private set; }

		public TimeSpan ClientTimeoutInterval
		{
			get
			{
				return _signalRHubOptions.Value.ClientTimeoutInterval.GetValueOrDefault(TimeSpan.FromSeconds(30));
			}
		}

		public GameModel(GamesContext dbContext, ILogger<BasePageModel> logger, IOptions<HubOptions> signalRHubOptions)
			: base(dbContext, logger)
		{
			_signalRHubOptions = signalRHubOptions;
		}

		public async Task<IActionResult> OnGetAsync()
		{
			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add(Request.Host.Host);
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate(Request.Host.Host);

			//https://developer.chrome.com/blog/enabling-shared-array-buffer/
			Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");
			Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");

			var token = HttpContext.RequestAborted;

			await base.LoadUserPlayerAndGameAsync(token);

			if (ActiveGame == null)
			{
				Message = "No active game for you;noActiveGame";

				return RedirectToPage(HomeModel.ASPX);
			}

			this.IsReadonly = false;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token, true);
#endif
			return Page();
		}

		public async Task<IActionResult> OnGetViewAsync([FromServices] IAuthorizationService authorization, GameIdModel model)
		{
			if (!(await authorization.AuthorizeAsync(base.User, Constants.InkBallViewOtherGamesPolicyName)).Succeeded)
				// if (!base.User.HasClaim("role", "InkBallViewOtherPlayerGames"))
				return await Task.FromResult<IActionResult>(base.Forbid());


			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add(Request.Host.Host);
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate(Request.Host.Host);

			//https://developer.chrome.com/blog/enabling-shared-array-buffer/
			Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");
			Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");


			if (!ModelState.IsValid)//model.GameID <= 0
			{
				Message = "View only: Bad GameID;viewOnlyBadGameID";

				return RedirectToPage(HomeModel.ASPX);
			}

			var token = HttpContext.RequestAborted;

			ActiveGame = await _dbContext.GetGameFromDatabaseAsync(model.GameID, true, token);

			if (ActiveGame == null ||
				!int.TryParse(User.FindFirstValue(nameof(InkBalPlayerId)), out var inkBallPlayerId) || inkBallPlayerId <= 0 ||
				ActiveGame?.iPlayer1Id == inkBallPlayerId || ActiveGame?.iPlayer2Id == inkBallPlayerId)
			{
				Message = "View only: It is your game, or bad GameID;viewOnlyYourGame";

				return RedirectToPage(HomeModel.ASPX);
			}
			if (Player == null)
				Player = ActiveGame.Player1;

			this.IsReadonly = true;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token, true);
#endif
			return Page();
		}
	}
}
