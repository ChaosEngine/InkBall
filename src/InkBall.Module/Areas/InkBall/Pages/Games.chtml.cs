using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class GamesModel : HomeModel
	{
		public class InkBallGameWithUserName : InkBallGameViewModel
		{
			public string P1UserName, P2UserName;
			public string Player1ExternalId, Player2ExternalId;

			public InkBallGameWithUserName()
			{
			}

			public InkBallGameWithUserName(InkBallGame game,
				string p1UserName, string player1ExternalId,
				string p2UserName, string player2ExternalId) : base(game)
			{
				P1UserName = p1UserName;
				P2UserName = p2UserName;

				Player1ExternalId = player1ExternalId;
				Player2ExternalId = player2ExternalId;
			}

			public InkBallGameWithUserName(InkBallGameViewModel game,
				string p1UserName, string player1ExternalId,
				string p2UserName, string player2ExternalId) : base(game)
			{
				P1UserName = p1UserName;
				P2UserName = p2UserName;

				Player1ExternalId = player1ExternalId;
				Player2ExternalId = player2ExternalId;
			}
		}

		private readonly IOptions<InkBallOptions> _commonUIConfigureOptions;

		public IEnumerable<InkBallGameWithUserName> GamesList { get; private set; }

		public GamesModel(GamesContext dbContext, ILogger<RulesModel> logger,
			IOptions<InkBallOptions> commonUIConfigureOptions) : base(dbContext, logger)
		{
			_commonUIConfigureOptions = commonUIConfigureOptions;
		}

		public override async Task OnGet()
		{
			await base.LoadUserPlayerAndGame();

			var token = HttpContext.RequestAborted;

			IEnumerable<InkBallGame> games_from_db = await _dbContext.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);

			Type type = typeof(UserManager<>).MakeGenericType(_commonUIConfigureOptions.Value.ApplicationUserType);
			var userManagerTUser = Request.HttpContext.RequestServices.GetService(type) as dynamic;

			var games = new List<InkBallGameWithUserName>(games_from_db.Count());
			if (userManagerTUser != null)
			{
				foreach (var game in games_from_db)
				{
					var user = await userManagerTUser.FindByIdAsync(game.Player1.User.sExternalId) as IdentityUser;
					if (user == null) continue;

					string p1_user_name = user.UserName;
					string p2_user_name = null;
					if (game?.Player2?.User != null)
					{
						user = await userManagerTUser.FindByIdAsync(game.Player2.User.sExternalId) as IdentityUser;
						p2_user_name = user.UserName;
					}

					var decorated = new InkBallGameWithUserName(game,
						p1_user_name, game.Player1.User.sExternalId,
						p2_user_name, game?.Player2?.User?.sExternalId);
					games.Add(decorated);
				}
			}
			GamesList = games;
		}

		public async Task<IActionResult> OnPostAsync(string action)
		{
			await Task.Delay(100);

			switch (action)
			{
				default:
					break;
			}

			return base.Page();
		}
	}
}
