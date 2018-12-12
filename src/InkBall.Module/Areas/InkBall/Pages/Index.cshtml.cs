using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class IndexModel : BasePageModel
	{
		public IndexModel(GamesContext dbContext, ILogger<BasePageModel> logger) : base(dbContext, logger)
		{
		}

		public async Task<IActionResult> OnGet()
		{
			if (!ChatHub.WebSocketAllowedOrigins.Any())
				ChatHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				ChatHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			InkBallUserViewModel user = await GetUserAsync();
			GameUser = user;

			InkBallPlayerViewModel player = await GetPlayerAsync(user, HttpContext.RequestAborted);
			Player = player;

			InkBallGameViewModel game = await GetGameAsync(player, HttpContext.RequestAborted);
			Game = game;

			if (game == null)
				return Redirect("Home");

			return Page();
		}
	}
}
