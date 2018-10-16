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
	public sealed class InkBallOptions : IConfigureOptions<InkBallOptions>
	{
		public string AuthorizationPolicyName { get; set; }

		public void Configure(InkBallOptions options)
		{
		}

		//public GamesContext DB { get; set; }
	}

	public static class SetupExtensions
	{
		public static IServiceCollection SetupInkBall<GContextType>(this IServiceCollection services, Action<InkBallOptions> configureAction = null)
			where GContextType : DbContext
		{
			InkBallOptions options = new InkBallOptions();

			if (configureAction != null)
				configureAction?.Invoke(options);

			services.ConfigureOptions(options);

			return services;
		}
	}

	public class MinimumAgeRequirement : AuthorizationHandler<MinimumAgeRequirement>, IAuthorizationRequirement
	{
		public MinimumAgeRequirement(int minimumAge)
		{
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
