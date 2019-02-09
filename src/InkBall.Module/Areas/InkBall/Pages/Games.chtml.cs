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
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class GamesModel : BasePageModel
	{
		private readonly IOptions<InkBallOptions> _commonUIConfigureOptions;
		private readonly IHubContext<GameHub, IGameClient> _inkballHubContext;

		// public IEnumerable<IGame<IPlayer<IPoint, IPath<IPoint>>, IPoint, IPath<IPoint>>> GamesList { get; private set; }
		public IEnumerable<InkBallGame> GamesList { get; private set; }

		public GamesModel(GamesContext dbContext, ILogger<RulesModel> logger, IOptions<InkBallOptions> commonUIConfigureOptions,
			IHubContext<Hubs.GameHub, Hubs.IGameClient> inkballHubContext) : base(dbContext, logger)
		{
			_commonUIConfigureOptions = commonUIConfigureOptions;
			_inkballHubContext = inkballHubContext;
		}

		private async Task<IEnumerable<InkBallGame>> GetGameList(CancellationToken token)
		{
			IEnumerable<InkBallGame> games_from_db = await _dbContext.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);

			return games_from_db;
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
													//delay for some signalr connction to be established. Is it really needed?
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
										Tuple.Create(new_game.GetOtherPlayer()?.User?.sExternalId, new_game.GetOtherPlayer()?.iId, this.GameUser.UserName),
										token);
									}

									trans.Commit();
									return Redirect("Index");
								}
								catch (Exception ex)
								{
									trans.Rollback();
									_logger.LogError(ex, ex.Message);
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

						int width, height, grid_size;
						//if ($g_bIsMobile)
						{
							width = 300; height = 390;
							grid_size = 15;
						}
						//else
						//{
						//	width = 300 * 2; height = 390 * 2;
						//	grid_size = 15;
						//}
						using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
						{
							try
							{
								new_game = await _dbContext.CreateNewGameFromExternalUserIDAsync(sExternalUserID, InkBallGame.GameStateEnum.AWAITING,
									GameType, grid_size, width, height, true, token);

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
								return Redirect("Games");
							}
							catch (Exception ex)
							{
								trans.Rollback();
								_logger.LogError(ex, ex.Message);
							}
						}
						break;

					case "Home":
						return Redirect("Home");

					default:
						break;
				}
			}
			catch (Exception ex)
			{
				msg += $"Exception: {ex.Message}";
			}

			if (!string.IsNullOrEmpty(msg))
				Message = msg;

			var games = GetGameList(token);

			GamesList = await games;

			return base.Page();
		}
	}
}
