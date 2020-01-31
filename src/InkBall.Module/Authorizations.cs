using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace InkBall.Module
{
	public static class Authentication
	{
		static async Task InkBallCreateUserPrincipalAsync(INamedAgedUser user,
			ClaimsPrincipal principal, GamesContext inkBallContext, CancellationToken token = default)
		{
			// use this.UserManager if needed
			var identity = (ClaimsIdentity)principal.Identity;
			var name_identifer = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!string.IsNullOrEmpty(name_identifer) && user.Age >= MinimumAgeRequirement.MinimumAge.Value)//conditions for InkBallUser to create
			{
				InkBallUser found_user = inkBallContext.InkBallUsers.FirstOrDefault(i => i.sExternalId == name_identifer);
				if (found_user != null)
				{
					//user already created and existing in InkBallUsers, awesome.
					//just update user name if differs
					if (found_user.UserName != user.Name)
					{
						found_user.UserName = user.Name;
						await inkBallContext.SaveChangesAsync(token);
					}
				}
				else
				{
					found_user = new InkBallUser
					{
						sExternalId = name_identifer,
						iPrivileges = 0,
						UserName = user.Name
					};
					await inkBallContext.InkBallUsers.AddAsync(found_user, token);
					await inkBallContext.SaveChangesAsync(token);
				}

				if (!identity.HasClaim(x => x.Type == nameof(InkBall.Module.Pages.HomeModel.InkBallUserId)))
				{
					identity.AddClaim(new Claim(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId), found_user.iId.ToString(),
						nameof(InkBall.Module.Model.InkBallUser)));
				}

				if (!identity.HasClaim(x => x.Type == ClaimTypes.DateOfBirth))
				{
					var date_of_birth = new Claim(ClaimTypes.DateOfBirth,
						DateTime.UtcNow.AddYears(-user.Age).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
					identity.AddClaim(date_of_birth);
				}

				if (!identity.HasClaim(x => x.Type == ClaimTypes.UserData))
				{
					var user_settings = new Claim(ClaimTypes.UserData,
						// JsonConvert.SerializeObject(user.UserSettingsJSON,
						// 	new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
						user.UserSettingsJSON ?? "",
						"UserSettings");
					identity.AddClaim(user_settings);
				}
			}
		}

		public static async Task InkBallCreateUserPrincipalAsync(HttpContext context, INamedAgedUser user, ClaimsPrincipal principal)
		{
			CancellationToken token = context.RequestAborted;

			using (IServiceScope scope = context.RequestServices.CreateScope())
			{
				GamesContext inkBallContext = scope.ServiceProvider.GetRequiredService<GamesContext>();

				if (inkBallContext != null && user != null)
					await InkBall.Module.Authentication.InkBallCreateUserPrincipalAsync(user, principal, inkBallContext, context.RequestAborted);
			}
		}

		static async Task InkBallSignOutActionAsync(string nameIdentifer, GamesContext inkBallContext,
			IHubContext<GameHub, IGameClient> inkballHubContext, ILogger logger, ISession sessionAccessor,
			CancellationToken token = default)
		{
			var games_to_surrender = await inkBallContext.InkBallGame
				.Include(gp1 => gp1.Player1).ThenInclude(p1 => p1.User)
				.Include(gp2 => gp2.Player2).ThenInclude(p2 => p2.User)
				.Where(w =>
				   (w.Player1.User.sExternalId == nameIdentifer || w.Player2.User.sExternalId == nameIdentifer)
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
								if (game.GetPlayer()?.User?.sExternalId == nameIdentifer)
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
								Tuple.Create(player_not_signed_off?.User?.sExternalId, player_signed_off?.iId, player_signed_off?.User?.UserName),
								token);
							}
						}

						trans.Commit();
					}
					catch (Exception ex)
					{
						trans.Rollback();
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

	public class MinimumAgeRequirement : AuthorizationHandler<MinimumAgeRequirement>, IAuthorizationRequirement
	{
		internal static readonly SynchronizedCache<int> MinimumAge = new SynchronizedCache<int>();

		public MinimumAgeRequirement(int minimumAge)
		{
			MinimumAge.AddOrUpdate(minimumAge);
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, MinimumAgeRequirement requirement)
		{
			var external_id = context.User.FindFirstValue(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId));
			if (string.IsNullOrEmpty(external_id))
				return Task.CompletedTask;

			var birth_str = context.User.FindFirstValue(ClaimTypes.DateOfBirth);
			if (string.IsNullOrEmpty(birth_str))
				return Task.CompletedTask;

			if (DateTime.TryParseExact(birth_str, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var birth))
			{
				if ((DateTime.UtcNow.Year - birth.Year) < MinimumAge.Value)
				{
					return Task.CompletedTask;
				}
				else
					context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}
