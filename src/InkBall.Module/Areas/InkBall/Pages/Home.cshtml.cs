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

namespace InkBall.Module.Pages
{
	[AllowAnonymous]
	public class HomeModel : PageModel
	{
		private readonly GamesContext _dbContext;
		private readonly ILogger<HomeModel> _logger;

		public int InkBallUserId { get; private set; }

		public InkBallUserViewModel GameUser { get; private set; }

		public InkBallPlayerViewModel Player { get; private set; }

		public string UserName => base.User.FindFirstValue(ClaimTypes.NameIdentifier);

		public InkBallGameViewModel Game { get; private set; }

		[TempData]
		public string Message { get; set; }



		private InkBallUserViewModel GetUser()
		{
			InkBallUserViewModel user = null;
			if (int.TryParse(User.FindFirstValue(nameof(InkBallUserId)), out var ink_user_id) && ink_user_id > 0)
			{
				InkBallUserId = ink_user_id;
				user = HttpContext.Session.Get<InkBallUserViewModel>(nameof(InkBallUserViewModel));
				if (user == null)
				{
					InkBallUser dbuser = _dbContext.InkBallUsers.Include(x => x.InkBallPlayer).FirstOrDefault(f => f.iId == InkBallUserId);
					user = new InkBallUserViewModel(dbuser);
					HttpContext.Session.Set<InkBallUserViewModel>(nameof(InkBallUserViewModel), user);
				}
			}
			return user;
		}

		private InkBallGameViewModel GetGame()
		{
			InkBallGameViewModel game = null;
			if (base.HttpContext.Session.IsAvailable && (game = base.HttpContext.Session.Get<InkBallGameViewModel>(nameof(InkBallGame))) != null)
			{
				return game;
			}
			return null;
		}

		private async Task<InkBallPlayerViewModel> GetPlayer(InkBallUserViewModel user, CancellationToken cancellationToken)
		{
			InkBallPlayer player;

			if (user.InkBallPlayer != null)
			{
				return user.InkBallPlayer.FirstOrDefault();
			}

			var query = from p in _dbContext.InkBallPlayer.Include(x => x.User)
						where p.iUserId == user.iId
						select p;
			player = await query.FirstOrDefaultAsync();

			if (player == null)
			{
				player = new InkBallPlayer
				{
					// User = user,
					iUserId = user.iId,
					iDrawCount = 0,
					iWinCount = 0,
					iLossCount = 0,
					TimeStamp = new DateTime(),
				};

				await _dbContext.InkBallPlayer.AddAsync(player, cancellationToken);
				await _dbContext.SaveChangesAsync(cancellationToken);
			}

			return new InkBallPlayerViewModel(player);
		}

		public HomeModel(GamesContext dbContext, ILogger<HomeModel> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		public virtual void OnGet()
		{
			InkBallUserViewModel user = GetUser();
			GameUser = user;

			InkBallGameViewModel game = GetGame();
			Game = game;
		}

		public async Task<IActionResult> OnPostAsync(string action, string gameType)
		{
			InkBallUserViewModel user = GetUser();
			GameUser = user;

			InkBallGameViewModel game = GetGame();
			Game = game;

			InkBallPlayerViewModel player = await GetPlayer(GameUser, HttpContext.RequestAborted);

			var bIsLoggedIn = (player != null && !string.IsNullOrEmpty(user.sExternalId)) ? true : false;
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
						try
						{
							var new_game = InkBallGame.CreateNewGameFromExternalUserID(user.sExternalId, "AWAITING", GameType, 15/*grid size*/, width, height);
							Game = new InkBallGameViewModel(new_game);

							HttpContext.Session.Set("InkBall", Game);

							return Redirect("Index");
						}
						catch (Exception)
						{
							msg = "Could not create new game for this user";
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
						return Redirect("~/Identity/Pages/Account/Login");

					case "Logout":
						if (Game != null)
						{
							try
							{
								Game.SurrenderGameFromPlayer();
							}
							catch (Exception)
							{
								throw;
							}
							HttpContext.Session.Set<InkBallGame>("InkBall", null);
						}
						//delete cookies
						//SetCookie("id_cookie", '');
						//SetCookie("email_cookie", '');
						//SetCookie("haslo_cookie", '');
						return Redirect("Home");

					case "Register":
						return Redirect("~/Identity/Pages/Account/Register");

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
