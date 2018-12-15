using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System;
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

			await base.LoadUserPlayerAndGameAsync();

			if (Game == null)
				return Redirect("Home");

			return Page();
		}
	}
}
