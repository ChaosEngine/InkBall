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
	public class Highscores : HomeModel
	{
		public Highscores(GamesContext dbContext, ILogger<RulesModel> logger) : base(dbContext, logger)
		{
		}

		public override void OnGet()
		{
			base.OnGet();
		}
	}
}
