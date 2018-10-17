using System;
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
			if (!context.User.HasClaim(c => c.Type == ClaimTypes.Name))
				return Task.CompletedTask;

			var name = context.User.FindFirst(c => c.Type == ClaimTypes.Name).Value;

			if (!string.IsNullOrEmpty(name))
			{
				context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}
