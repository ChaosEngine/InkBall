using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = Constants.InkBallPolicyName)]
	public class GamesListModel : BasePageModel
	{
		private readonly IOptions<InkBallOptions> _commonUIConfigureOptions;
		private readonly IHubContext<GameHub, IGameClient> _inkballHubContext;


		public IEnumerable<InkBallGame> GamesList { get; private set; }


		public GamesListModel(GamesContext dbContext, ILogger<RulesModel> logger, IOptions<InkBallOptions> commonUIConfigureOptions,
			IHubContext<Hubs.GameHub, Hubs.IGameClient> inkballHubContext) : base(dbContext, logger)
		{
			_commonUIConfigureOptions = commonUIConfigureOptions;
			_inkballHubContext = inkballHubContext;
		}

		private async Task<IEnumerable<InkBallGame>> GetGameList(CancellationToken token)
		{
			IEnumerable<InkBallGame> games_from_db = await _dbContext.GetGamesForRegistrationAsSelectTableRowsAsync(token);
			return games_from_db;
		}

		public async Task OnGet()
		{
			await base.LoadUserPlayerAndGameAsync();

			GamesList = await GetGameList(HttpContext.RequestAborted);

			//Message = $"ExternalId = [{GameUser.sExternalId}] PlayerID = [{GameUser.InkBallPlayer.FirstOrDefault()?.iId}]";
		}

		public async Task<IActionResult> OnPostAsync(string action, int gameID, string gameType, InkBallGame.BoardSizeEnum boardSize,
			string cpuOponent)
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
				switch (action)
				{
					case "join":
					case "Join":
						if (Game != null)
						{
							msg = "You have another game";
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
							using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
							{
								try
								{
									await _dbContext.JoinGameFromExternalUserIdAsync(new_game, sExternalUserID, token);

									if (_inkballHubContext != null && new_game.GetOtherPlayer() != null)
									{
										var tsk = Task.Factory.StartNew(async (payload) =>
										{
											try
											{
												var recipient_id_joiner = payload as Tuple<string, int?, string>;
												if (!string.IsNullOrEmpty(recipient_id_joiner.Item1))
												{
													//delay for some signalr connection to be established. Is it really needed?
													await Task.Delay(1_000);

													await _inkballHubContext.Clients.User(recipient_id_joiner.Item1).ServerToClientPlayerJoin(
														new PlayerJoiningCommand(recipient_id_joiner.Item2.GetValueOrDefault(0),
														recipient_id_joiner.Item3,
														$"Player {recipient_id_joiner.Item3 ?? ""} joining"));
												}
											}
											catch (Exception ex)
											{
												_logger.LogError(ex.Message);
											}
										},
										Tuple.Create(new_game.GetOtherPlayer()?.User?.sExternalId, new_game.GetPlayer()?.iId, this.GameUser.UserName),
										token);
									}

									trans.Commit();
									return RedirectToPage("Game");
								}
								catch (Exception ex)
								{
									trans.Rollback();
									_logger.LogError(ex, ex.Message);
									throw;
								}
							}
						}
						break;

					case "continue":
					case "Continue":
						if (Game != null)
						{
							return RedirectToPage("Game");
						}
						else
						{
							msg = "You have no game to continue";
						}
						break;

					case "create":
					case "Create":
					case "New game":
						if (Game != null)
						{
							msg = "You have another game";
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
							default:
								break;
						}
						if (width <= -1)
						{
							msg = "Wrong board size";
							break;
						}
						bool bCpuOponent;
						switch (cpuOponent)
						{
							case "on":
							case "1":
							case "checked":
								bCpuOponent = true;
								break;
							case "off":
							case "0":
							case "":
							default:
								bCpuOponent = false;
								break;
						}

						using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
						{
							try
							{
								new_game = await _dbContext.CreateNewGameFromExternalUserIDAsync(sExternalUserID,
									selectedGameType, grid_size, width, height, bCpuOponent, token);

								trans.Commit();
								return RedirectToPage("Game");
							}
							catch (Exception ex)
							{
								trans.Rollback();
								msg = "Could not create new game for this user";
								_logger.LogError(ex, msg);
							}
						}
						break;

					case "pause":
					case "Pause":
						return RedirectToPage("GamesList");

					case "surrender":
					case "cancel":
					case "Cancel":
					case "win":
						if (Game == null)
						{
							msg = "You have no game";
							break;
						}
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
													new PlayerSurrenderingCommand(recipient_id_looser.Item2.GetValueOrDefault(0),
													true, $"Player {recipient_id_looser.Item3 ?? ""} surrenders"));
											}
										}
										catch (Exception ex)
										{
											_logger.LogError(ex, ex.Message);
										}
									},
									Tuple.Create(Game.GetOtherPlayer()?.User?.sExternalId, Game.GetOtherPlayer()?.iId, this.GameUser.UserName),
									token);
								}

								trans.Commit();
								return RedirectToPage("GamesList");
							}
							catch (Exception ex)
							{
								trans.Rollback();
								_logger.LogError(ex, ex.Message);
							}
						}
						break;

					case "Home":
						return RedirectToPage("Home");

					default:
						break;
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "GamesList error");
				msg += $"Exception: {ex.Message}";
			}

			if (!string.IsNullOrEmpty(msg))
				Message = msg;

			GamesList = await GetGameList(token);

			return base.Page();
		}
	}
}
