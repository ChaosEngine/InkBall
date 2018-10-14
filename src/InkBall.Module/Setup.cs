using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace InkBall.Module
{
	public static class SetupExtensions
	{
		public static IServiceCollection SetupInkBall(this IServiceCollection services, string authorizationPolicyName, GamesContext dB)
		{
			return services;
		}
	}

	public class MinimumAgeRequirement : AuthorizationHandler<MinimumAgeRequirement>, IAuthorizationRequirement
	{
		int _minimumAge;

		public MinimumAgeRequirement(int minimumAge)
		{
			_minimumAge = minimumAge;
		}

		protected override Task HandleRequirementAsync(
			AuthorizationHandlerContext context,
			MinimumAgeRequirement requirement)
		{
			if (!context.User.HasClaim(c => c.Type == ClaimTypes.DateOfBirth))
			{
				return Task.CompletedTask;
			}

			var dateOfBirth = Convert.ToDateTime(
				context.User.FindFirst(c => c.Type == ClaimTypes.DateOfBirth).Value);

			int calculatedAge = DateTime.Today.Year - dateOfBirth.Year;
			if (dateOfBirth > DateTime.Today.AddYears(-calculatedAge))
			{
				calculatedAge--;
			}

			if (calculatedAge >= _minimumAge)
			{
				context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}
