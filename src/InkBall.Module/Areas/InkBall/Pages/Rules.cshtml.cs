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
	public class RulesModel : HomeModel
	{
		public RulesModel(GamesContext dbContext, ILogger<RulesModel> logger) : base(dbContext, logger)
		{
		}

		public override Task OnGet()
		{
			return base.OnGet();
		}
	}
}
