using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

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
            InkBallUserViewModel user = GetUser();
			GameUser = user;

			InkBallPlayerViewModel player = await GetPlayer(user, HttpContext.RequestAborted);
			Player = player;

			InkBallGameViewModel game = await GetGame(player, HttpContext.RequestAborted);
			Game = game;

			if(game == null)
				return Redirect("Home");

			return Page();
		}
	}
}
