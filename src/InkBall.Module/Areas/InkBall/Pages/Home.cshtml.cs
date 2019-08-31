using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using InkBall.Module.Model;
using Microsoft.AspNetCore.SignalR;
using InkBall.Module.Hubs;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;

namespace InkBall.Module.Pages
{
	[AllowAnonymous]
	public class HomeModel : BasePageModel
	{
		private readonly IHubContext<GameHub, IGameClient> _inkballHubContext;
		private readonly IOptions<InkBallOptions> _commonUIConfigureOptions;


		public HomeModel(GamesContext dbContext, ILogger<HomeModel> logger,
			IHubContext<Hubs.GameHub, Hubs.IGameClient> inkballHubContext,
			IOptions<InkBallOptions> commonUIConfigureOptions) : base(dbContext, logger)
		{
			_inkballHubContext = inkballHubContext;
			_commonUIConfigureOptions = commonUIConfigureOptions;
		}

		public async Task OnGet()
		{
			await LoadUserPlayerAndGameAsync();
		}

		public async Task<IActionResult> OnPostAsync(string action, string gameType, InkBallGame.BoardSizeEnum boardSize)
		{
			await LoadUserPlayerAndGameAsync();

			var bIsLoggedIn = (Player != null && !string.IsNullOrEmpty(GameUser.sExternalId)) ? true : false;
			string msg = string.Empty;
			var token = HttpContext.RequestAborted;
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
						if (!(Enum.TryParse<InkBallGame.GameTypeEnum>(gameType, true, out var selectedGameType) &&
							(Enum.IsDefined(typeof(InkBallGame.GameTypeEnum), selectedGameType) | selectedGameType.ToString().Contains(","))))
						{
							msg = "Wrong game type";
							break;
						}

						int width = -1, height = -1, grid_size = 16;
						switch (boardSize)
						{
							case InkBallGame.BoardSizeEnum.SIZE_20x26:
								width = 20; height = 26;
								break;
							case InkBallGame.BoardSizeEnum.SIZE_40x52:
								width = 40; height = 52;
								break;
							case InkBallGame.BoardSizeEnum.SIZE_64x64:
								width = 64; height = 64;
								break;
							case InkBallGame.BoardSizeEnum.SIZE_80x80:
								width = 80; height = 80;
								break;
							default:
								break;
						}
						if (width <= -1)
						{
							msg = "Wrong board size";
							break;
						}

						using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
						{
							try
							{
								var dbGame = await _dbContext.CreateNewGameFromExternalUserIDAsync(GameUser.sExternalId, InkBallGame.GameStateEnum.AWAITING,
									selectedGameType, grid_size, width, height, true, token);

								trans.Commit();
								return Redirect("Index");
							}
							catch (Exception ex)
							{
								trans.Rollback();
								msg = "Could not create new game for this user";
								_logger.LogError(ex, msg);
							}
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
							using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
							{
								try
								{
									await _dbContext.SurrenderGameFromPlayerAsync(Game, base.HttpContext.Session, false, token);

									if (_inkballHubContext != null && Game.GetOtherPlayer() != null)
									{
										var tsk = Task.Factory.StartNew(async (payload) =>
										{
											try
											{
												var recipient_id_looser = payload as Tuple<string, int?, string>;
												if (!string.IsNullOrEmpty(recipient_id_looser.Item1))
												{
													await _inkballHubContext.Clients.User(recipient_id_looser.Item1).ServerToClientPlayerSurrender(
														new PlayerSurrenderingCommand(recipient_id_looser.Item2.GetValueOrDefault(0), true,
														$"Player {recipient_id_looser.Item3 ?? ""} logged out"));
												}
											}
											catch (Exception ex)
											{
												_logger.LogError(ex.Message);
											}
										},
										Tuple.Create(Game.GetOtherPlayer()?.User?.sExternalId, Game.GetOtherPlayer()?.iId, this.GameUser.UserName),
										token);
									}

									trans.Commit();
								}
								catch (Exception ex)
								{
									trans.Rollback();
									_logger.LogError(ex, nameof(_dbContext.SurrenderGameFromPlayerAsync));
									throw;
								}
							}
						}

						if (typeof(SignInManager<>).MakeGenericType(_commonUIConfigureOptions.Value.ApplicationUserType) is Type type
							&& type != null)
						{
							var signInManagerTUser = Request.HttpContext.RequestServices.GetService(type) as dynamic;

							if (signInManagerTUser != null)
								await signInManagerTUser.SignOutAsync();
						}
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
