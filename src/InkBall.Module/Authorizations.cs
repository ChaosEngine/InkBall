using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace InkBall.Module
{
	public class MinimumAgeRequirement : AuthorizationHandler<MinimumAgeRequirement>, IAuthorizationRequirement
	{
		private readonly int _minimumAge;

		public MinimumAgeRequirement(int minimumAge)
		{
			_minimumAge = minimumAge;
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, MinimumAgeRequirement requirement)
		{
			var external_id = context.User.FindFirstValue("InkBallClaimType");
			if (string.IsNullOrEmpty(external_id))
				return Task.CompletedTask;

			var birth_str = context.User.FindFirstValue(ClaimTypes.DateOfBirth);
			if (string.IsNullOrEmpty(birth_str))
				return Task.CompletedTask;

			if (DateTime.TryParseExact(birth_str, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var birth))
			{
				if ((DateTime.UtcNow.Year - birth.Year) < 18)
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
