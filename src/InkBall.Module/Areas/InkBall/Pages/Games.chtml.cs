using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class GamesModel : BasePageModel
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

		private async Task<IEnumerable<InkBallGameWithUserName>> GetGameList(CancellationToken token)
		{
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

			return games;
		}

		public async Task OnGet()
		{
			await base.LoadUserPlayerAndGameAsync();

			var games = GetGameList(HttpContext.RequestAborted);

			GamesList = await games;
		}

		public async Task<IActionResult> OnPostAsync(string action, int gameID, string gameType)
		{
			await base.LoadUserPlayerAndGameAsync();

			string sExternalUserID = GameUser.sExternalId;
			string msg = "";
			var token = HttpContext.RequestAborted;

			if (Game == null)
				InkBallGame.DeactivateDeadGamezFromExternalUserID(sExternalUserID);
			InkBallGame.WipeAllDeadGamez();


			try
			{
				IDbContextTransaction trans = null;
				switch (action)
				{
					case "join":
						if (Game != null)
						{
							msg = "You've got another game";
							break;
						}
						if (gameID < 0)
						{
							msg = "Bad game ID";
							break;
						}
						var new_game = await _dbContext.GetGameFromDatabaseAsync(gameID, false, token);
						if (new_game == null
							|| new_game?.Player1?.User?.sExternalId == sExternalUserID || new_game?.Player2?.User?.sExternalId == sExternalUserID)
						{
							msg = "This user cannot join to the game";
						}
						else
						{
							using (trans = await _dbContext.Database.BeginTransactionAsync(token))
							{
								try
								{
									await _dbContext.JoinGameFromExternalUserIdAsync(new_game, sExternalUserID, token);
									Game = new InkBallGameViewModel(new_game);
									HttpContext.Session.Set(nameof(InkBallGameViewModel), Game);

									trans.Commit();
									//TODO:	notify 1st player (or other player) with SignalrR hub (ChatHub) about new player joining in
									return Redirect("Index");
								}
								catch (Exception ex)
								{
									trans.Rollback();
									_logger.LogError(ex, msg);
									throw ex;
								}
							}
						}
						break;

					case "continue":
						if (Game != null)
						{
							return Redirect("Index");
						}
						else
						{
							msg = "You've got no game to continue";
						}
						break;

					case "create":
					case "New game":
						if (Game != null)
						{
							msg = "You've got another game";
							break;
						}

						if (!Enum.TryParse<InkBallGame.GameTypeEnum>(gameType, true, out var GameType))
							throw new NotSupportedException("Wrong game type");

						int width = 0, height = 0;
						//if ($g_bIsMobile)
						{
							width = 600 / 2; height = 800 / 2;
						}
						//else
						//{
						//	width = 600; height = 800;
						//}
						trans = await _dbContext.Database.BeginTransactionAsync(token);
						try
						{

							new_game = await _dbContext.CreateNewGameFromExternalUserIDAsync(sExternalUserID, InkBallGame.GameStateEnum.AWAITING,
								GameType, 15/*grid size*/, width, height, true, token);
							Game = new InkBallGameViewModel(new_game);
							HttpContext.Session.Set(nameof(InkBallGameViewModel), Game);

							trans.Commit();
							return Redirect("Index");
						}
						catch (Exception ex)
						{
							trans.Rollback();
							msg = "Could not create new game for this user";
							_logger.LogError(ex, msg);
						}
						break;

					case "pause":
						return Redirect("Games");

					case "surrender":
					case "cancel":
					case "win":
						if (Game == null)
						{
							msg = "You've got no game";
							break;
						}
						trans = await _dbContext.Database.BeginTransactionAsync(token);
						try
						{
							gameID = Game.iId;

							var db_game = (from ig in _dbContext.InkBallGame
											.Include(ip1 => ip1.Player1).Include(ip2 => ip2.Player2)
										   where ig.iId == gameID
										   select ig).FirstOrDefaultAsync(token);

							_dbContext.SurrenderGameFromPlayerAsync(await db_game, base.HttpContext.Session, false, token);

							trans.Commit();
						}
						catch (Exception ex)
						{
							trans.Rollback();
							_logger.LogError(ex, msg);
						}
						HttpContext.Session.Remove(nameof(InkBallGameViewModel));
						return Redirect("Games");

					case "Home":
						return Redirect("Home");

					default:
						break;
				}
			}
			catch (Exception ex)
			{
				msg += ($"Exception: {ex.Message}");
			}

			if (!string.IsNullOrEmpty(msg))
				Message = msg;

			var games = GetGameList(token);

			GamesList = await games;

			return base.Page();
		}
	}
}
