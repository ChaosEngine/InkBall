using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class HighscoresModel : BasePageModel
	{
		public HighscoresModel(GamesContext dbContext, ILogger<RulesModel> logger) : base(dbContext, logger)
		{
		}

		public Task OnGet()
		{
			return base.LoadUserPlayerAndGameAsync();
		}
	}
}
