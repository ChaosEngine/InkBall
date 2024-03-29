using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = Constants.InkBallPolicyName)]
	public class HighscoresModel : BasePageModel
	{
		public const string ASPX = "Highscores";

		public IEnumerable<(int PlayerId, string UserName, int WinCount, int LossCount, int DrawCount, int GameCount)> Stats { get; set; }

		public HighscoresModel(GamesContext dbContext, ILogger<RulesModel> logger) : base(dbContext, logger)
		{
		}

		public async Task OnGet()
		{
			//await base.LoadUserPlayerAndGameAsync();

			Stats = await _dbContext.GetPlayerStatisticTableAsync();
		}
	}
}
