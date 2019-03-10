using System.Threading.Tasks;
using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class ViewModel : IndexModel
	{
		public ViewModel(GamesContext dbContext, ILogger<ViewModel> logger, IOptions<HubOptions> signalRHubOptions)
			: base(dbContext, logger, signalRHubOptions)
		{
		}

		public override async Task<IActionResult> OnGetAsync(GameIdModel model)
		{
			if (!ModelState.IsValid /*gameId <= 0*/)
				return Redirect("Home");

			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			Game = await _dbContext.GetGameFromDatabaseAsync(model.GameID /*gameId*/, true);

			if (Game == null)
				return Redirect("Home");

			var token = HttpContext.RequestAborted;

			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token);

			return Page();
		}
	}
}
