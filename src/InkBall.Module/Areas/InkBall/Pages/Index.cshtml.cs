//#define LOAD_POINTS_AND_PATHS_FROM_SIGNALR

using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Html;
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
	public class IndexModel : BasePageModel
	{
		private readonly IOptions<HubOptions> _signalRHubOptions;

		public (IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points) PlayerPointsAndPaths { get; protected set; }

		public HtmlString PointsAsJavaScriptArray
		{
			get { return new HtmlString(CommonPoint.GetPointsAsJavaScriptArrayForPage(PlayerPointsAndPaths.Points)); }
		}

		public HtmlString PathsAsJavaScriptArray
		{
			get { return new HtmlString(InkBallPath.GetPathsAsJavaScriptArrayForPage2(PlayerPointsAndPaths.Paths)); }
		}

		public bool IsReadonly { get; private set; }

		public TimeSpan ClientTimeoutInterval
		{
			get
			{
				return _signalRHubOptions.Value.ClientTimeoutInterval.GetValueOrDefault(TimeSpan.FromSeconds(30));
			}
		}

		public IndexModel(GamesContext dbContext, ILogger<BasePageModel> logger, IOptions<HubOptions> signalRHubOptions)
			: base(dbContext, logger)
		{
			_signalRHubOptions = signalRHubOptions;
		}

		public async Task<IActionResult> OnGetAsync()
		{
			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			var token = HttpContext.RequestAborted;

			await base.LoadUserPlayerAndGameAsync();

			if (Game == null)
			{
				Message = "No active game for you";

				return Redirect("Home");
			}

			this.IsReadonly = false;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token, false);
#endif
			return Page();
		}

		public async Task<IActionResult> OnGetViewAsync([FromServices]IAuthorizationService authorization, GameIdModel model)
		{
			if (!(await authorization.AuthorizeAsync(base.User, Constants.InkBallViewOtherGamesPolicyName)).Succeeded)
				// if (!base.User.HasClaim("role", "InkBallViewOtherPlayerGames"))
				return await Task.FromResult<IActionResult>(base.Forbid());


			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			if (!ModelState.IsValid)//model.GameID <= 0
			{
				Message = "View only: Bad GameID";

				return Redirect("Home");
			}

			var token = HttpContext.RequestAborted;

			Game = await _dbContext.GetGameFromDatabaseAsync(model.GameID, true, token);

			if (Game == null ||
				!int.TryParse(User.FindFirstValue(nameof(InkBallUserId)), out var inkBallUserId) || inkBallUserId <= 0 ||
				Game?.Player1?.iUserId == inkBallUserId || Game?.Player2?.iUserId == inkBallUserId)
			{
				Message = "View only: It is your game, or bad GameID";

				return Redirect("Home");
			}
			if (Player == null)
				Player = Game.Player1;

			this.IsReadonly = true;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token, false);
#endif
			return Page();
		}
	}
}
