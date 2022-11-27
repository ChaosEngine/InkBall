using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module
{
	public static class Authentication
	{
		static async Task InkBallCreateUserPrincipalAsync(INamedAgedUser user,
			ClaimsPrincipal principal, GamesContext inkBallContext, CancellationToken token = default)
		{
			var name_identifer = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			//conditions for InkBallPlayer to create
			if (string.IsNullOrEmpty(name_identifer)) return;

			var identity = (ClaimsIdentity)principal.Identity;

			//checking if player already created in DB
			InkBallPlayer found_player = await inkBallContext.InkBallPlayer
				.FirstOrDefaultAsync(p => p.sExternalId == name_identifer, token);
			if (found_player != null)
			{
				//InkBallPlayer already created, awesome.
				//just update user name if differs
				if (found_player.UserName != user.Name)
					found_player.UserName = user.Name;
			}
			else
			{
				//no player exists - create one
				found_player = new InkBallPlayer
				{
					iDrawCount = 0,
					iWinCount = 0,
					iLossCount = 0,
					sExternalId = name_identifer,
					iPrivileges = 0,
					UserName = user.Name
				};

				await inkBallContext.InkBallPlayer.AddAsync(found_player, token);
			}
			await inkBallContext.SaveChangesAsync(token);


			if (!identity.HasClaim(x => x.Type == nameof(Pages.HomeModel.InkBalPlayerId)))
			{
				identity.AddClaim(new Claim(nameof(Pages.HomeModel.InkBalPlayerId), found_player.iId.ToString(),
					nameof(InkBallPlayer)));
			}

			if (!identity.HasClaim(x => x.Type == ClaimTypes.UserData))
			{
				var user_settings = new Claim(ClaimTypes.UserData, user.UserSettingsJSON ?? "", nameof(user.UserSettings));
				identity.AddClaim(user_settings);
			}
		}

		public static async Task InkBallCreateUserPrincipalAsync(HttpContext context, INamedAgedUser user, ClaimsPrincipal principal)
		{
			using (IServiceScope scope = context.RequestServices.CreateScope())
			{
				GamesContext inkBallContext = scope.ServiceProvider.GetRequiredService<GamesContext>();

				if (inkBallContext != null && user != null)
					await InkBallCreateUserPrincipalAsync(user, principal, inkBallContext, context.RequestAborted);
			}
		}

		static async Task InkBallSignOutActionAsync(string nameIdentifer, GamesContext inkBallContext,
			IHubContext<GameHub, IGameClient> inkballHubContext, ILogger logger, ISession sessionAccessor,
			CancellationToken token = default)
		{
			var games_to_surrender = await inkBallContext.InkBallGame
				.Include(gp1 => gp1.Player1)
				.Include(gp2 => gp2.Player2)
				.Where(w =>
				   (w.Player1.sExternalId == nameIdentifer || w.Player2.sExternalId == nameIdentifer)
				   && (GamesContext.ActiveVisibleGameStates.Contains(w.GameState))
				).ToArrayAsync(token);

			if (games_to_surrender.Any())
			{
				using (var trans = await inkBallContext.Database.BeginTransactionAsync(token))
				{
					try
					{
						foreach (InkBallGame game in games_to_surrender)
						{
							await inkBallContext.SurrenderGameFromPlayerAsync(game, sessionAccessor, false, token);

							if (inkballHubContext != null)
							{
								InkBallPlayer player_not_signed_off, player_signed_off;
								if (game.GetPlayer()?.sExternalId == nameIdentifer)
								{
									player_signed_off = game.GetPlayer();
									player_not_signed_off = game.GetOtherPlayer();
								}
								else
								{
									player_signed_off = game.GetOtherPlayer();
									player_not_signed_off = game.GetPlayer();
								}

								var tsk = Task.Factory.StartNew(async (payload) =>
								{
									try
									{
										var signedOff_id_online = payload as Tuple<string, int?, string>;

										if (!string.IsNullOrEmpty(signedOff_id_online.Item1))
										{
											await inkballHubContext.Clients.User(signedOff_id_online.Item1).ServerToClientPlayerSurrender(
												new PlayerSurrenderingCommand(signedOff_id_online.Item2.GetValueOrDefault(0), true,
												$"Player {signedOff_id_online.Item3 ?? ""} logged out"));
										}
									}
									catch (Exception ex)
									{
										logger.LogError(ex.Message);
									}
								},
								Tuple.Create(player_not_signed_off?.sExternalId, player_signed_off?.iId, player_signed_off?.UserName),
								token);
							}
						}

						await trans.CommitAsync(token);
					}
					catch (Exception ex)
					{
						await trans.RollbackAsync(token);
						logger.LogError(ex, ex.Message);
					}
				}
			}
		}

		public static async Task InkBallSignOutActionAsync(HttpContext context, ILogger logger, string nameIdentifer)
		{
			using (IServiceScope scope = context.RequestServices.CreateScope())
			{
				GamesContext inkBallContext = scope.ServiceProvider.GetRequiredService<GamesContext>();
				IHubContext<GameHub, IGameClient> inkballHubContext = scope.ServiceProvider.GetRequiredService<IHubContext<GameHub, IGameClient>>();

				if (inkBallContext != null && inkballHubContext != null)
				{
					await InkBallSignOutActionAsync(
						context.User.FindFirstValue(ClaimTypes.NameIdentifier),
						inkBallContext, inkballHubContext, logger, context.Session, context.RequestAborted);
				}
			}
		}
	}
}
