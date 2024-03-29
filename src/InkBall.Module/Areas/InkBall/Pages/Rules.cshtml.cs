using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using InkBall.Module.Model;

namespace InkBall.Module.Pages
{
	//[Authorize(Policy = Constants.InkBallPolicyName)]
	public class RulesModel : BasePageModel
	{
		public const string ASPX = "Rules";

		public RulesModel(GamesContext dbContext, ILogger<RulesModel> logger) : base(dbContext, logger)
		{
		}

		/*public Task OnGet()
		{
			return base.LoadUserPlayerAndGameAsync();
		}*/
	}
}
