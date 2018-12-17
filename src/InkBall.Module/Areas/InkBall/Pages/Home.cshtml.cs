using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading;
using InkBall.Module.Model;

namespace InkBall.Module.Pages
{
	[AllowAnonymous]
	public class HomeModel : BasePageModel
	{
		public HomeModel(GamesContext dbContext, ILogger<HomeModel> logger) : base(dbContext, logger)
		{
		}

		public async Task OnGet()
		{
			await LoadUserPlayerAndGameAsync();
		}

		public async Task<IActionResult> OnPostAsync(string action, string gameType)
		{
			await LoadUserPlayerAndGameAsync();

			var bIsLoggedIn = (Player != null && !string.IsNullOrEmpty(GameUser.sExternalId)) ? true : false;
			string msg = string.Empty;
			action = !string.IsNullOrEmpty(action) ? action : string.Empty;

			try
			{
				switch (action)
				{
					case "Continue":
						if (Game != null)
						{
							return Redirect("Index");
						}
						else
						{
							msg = "You have no game to continue";
						}
						break;

					case "New game":
						if (Game != null)
						{
							msg = "You have another game";
							break;
						}
						if (!bIsLoggedIn)
						{
							msg = "You are not logged in";
							break;
						}
						if (!Enum.TryParse<InkBallGame.GameTypeEnum>(gameType, true, out var GameType))
							throw new NotSupportedException("Wrong game type");

						int width = 0, height = 0;
						//if (g_bIsMobile)
						{
							width = 600 / 2; height = 800 / 2;
						}
						//else
						//{
						//	width = 600;	height = 800;
						//}
						var trans = await _dbContext.Database.BeginTransactionAsync(HttpContext.RequestAborted);
						try
						{
							var dbGame = await _dbContext.CreateNewGameFromExternalUserIDAsync(GameUser.sExternalId, InkBallGame.GameStateEnum.AWAITING,
								GameType, 15/*grid size*/, width, height);
							Game = new InkBallGameViewModel(dbGame);

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

					case "Game list":
						if (bIsLoggedIn)
						{
							return Redirect("Games");
						}
						else
							msg = "You have to be logged in";
						break;

					case "Best":
						if (bIsLoggedIn)
						{
							return Redirect("Highscores");
						}
						else
							msg = "You have to be logged in";
						break;

					case "Game rules":
						return Redirect("Rules");

					case "Login":
						return Redirect("~/Identity/Account/Login");

					case "Logout":
						if (Game != null)
						{
							trans = await _dbContext.Database.BeginTransactionAsync(HttpContext.RequestAborted);
							try
							{
								var gameID = Game.iId;

								var db_game = (from ig in _dbContext.InkBallGame
												.Include(ip1 => ip1.Player1).Include(ip2 => ip2.Player2)
											   where ig.iId == gameID
											   select ig).FirstOrDefaultAsync(HttpContext.RequestAborted);

								_dbContext.SurrenderGameFromPlayerAsync(await db_game, base.HttpContext.Session, false, HttpContext.RequestAborted);

								trans.Commit();
							}
							catch (Exception ex)
							{
								trans.Rollback();
								_logger.LogError(ex, nameof(_dbContext.SurrenderGameFromPlayerAsync));
								throw;
							}
							HttpContext.Session.Set<InkBallGameViewModel>(nameof(InkBallGameViewModel), null);
						}
						//delete cookies
						HttpContext.Session.Remove(nameof(InkBallUserViewModel));
						HttpContext.Session.Remove(nameof(InkBallGameViewModel));
						HttpContext.Session.Remove(nameof(InkBallUserViewModel));
						return Redirect("~/Identity/Account/Logout");

					case "Register":
						return Redirect("~/Identity/Account/Register");

					default:
						break;
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Home error");
				return BadRequest();
			}

			Message = msg;

			return Page();
		}
	}
}
