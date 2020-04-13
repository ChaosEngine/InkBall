using System;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace InkBall.Module
{
	public static class Constants
	{
		public const string InkBallPolicyName = "InkBallPlayerPolicy";
		public const string InkBallViewOtherGamesPolicyName = "InkBallViewOtherGamesPolicy";
		/// <summary>
		// When point is put, and user pushed StopAndraw button - one is allowed to close a path withing this much number of seconds
		// which should be accepted
		/// </summary>
		public const int PathAfterPointDrawAllowanceSecAmount = 120;
		

		#region JS/CSS variables

#if DEBUG
		public const string WwwIncludeInkballJS = "~/js/inkball.js";
		public const string WwwIncludeInkballJSBabel = "~/js/inkball.babelify.js";
		public const string WwwIncludeSvgVmlJS = "~/js/svgvml.js";
		public const string WwwIncludeSvgVmlJSBabel = "~/js/svgvml.babelify.js";
		public const string WwwIncludeCSS = "~/css/inkball.css";
#else
		public const string WwwIncludeInkballJS = "~/js/inkball.min.js";
		public const string WwwIncludeInkballJSBabel = "~/js/inkball.babelify.min.js";
		public const string WwwIncludeSvgVmlJS = "~/js/svgvml.min.js";
		public const string WwwIncludeSvgVmlJSBabel = "~/js/svgvml.babelify.min.js";
		public const string WwwIncludeCSS = "~/css/inkball.min.css";
#endif
		public const string WwwConcavemanBundle = "~/js/concavemanBundle.js";

		#endregion JS/CSS variables
	}

	public class InkBallOptions : IPostConfigureOptions<StaticFileOptions>
	{
		internal IFileProvider WebRootFileProvider { get; set; }

		public string WwwRoot { get; set; } = "wwwroot";

		public string HeadElementsSectionName { get; set; } = "headElements";

		public string ScriptsSectionName { get; set; } = "Scripts";

		public string AppRootPath { get; set; } = "/";

		public Action<AuthorizationPolicyBuilder> CustomAuthorizationPolicyBuilder { get; set; }

		public Type ApplicationUserType { get; set; }

		public bool UseMessagePackBinaryTransport { get; set; } = false;

		public bool EnablePolyfill { get; set; } = true;
		
		public string LoginPath { get; set; }
		
		public string LogoutPath { get; set; }
		
		public string RegisterPath { get; set; }

		public void PostConfigure(string name, StaticFileOptions options)
		{
			name = name ?? throw new ArgumentNullException(nameof(name));
			options = options ?? throw new ArgumentNullException(nameof(options));

			// Basic initialization in case the options weren't initialized by any other component
			options.ContentTypeProvider = options.ContentTypeProvider ?? new FileExtensionContentTypeProvider();
			if (options.FileProvider == null && WebRootFileProvider == null)
			{
				throw new InvalidOperationException("Missing FileProvider.");
			}

			options.FileProvider = options.FileProvider ?? WebRootFileProvider;

			// Add our provider
			var filesProvider = new ManifestEmbeddedFileProvider(GetType().Assembly, WwwRoot);
			options.FileProvider = new CompositeFileProvider(options.FileProvider, filesProvider);
		}
	}

	public static class CommonUIServiceCollectionExtensions
	{
		public static IServiceCollection AddInkBallCommonUI<TGamesDBContext, TIdentUser>(this IServiceCollection services, IFileProvider webRootFileProvider,
			Action<InkBallOptions> configureOptions)
			where TGamesDBContext : IGamesContext
			where TIdentUser : IdentityUser, INamedAgedUser
		{
			InkBallOptions options = new InkBallOptions();
			options.WebRootFileProvider = webRootFileProvider;
			options.ApplicationUserType = typeof(TIdentUser);

			configureOptions?.Invoke(options);

			if (options.CustomAuthorizationPolicyBuilder != null)
			{
				services.AddAuthorizationCore(auth_options =>
				{
					auth_options.AddPolicy(Constants.InkBallPolicyName, options.CustomAuthorizationPolicyBuilder);
				});
			}
			else
			{
				services.AddAuthorizationCore(auth_options =>
				{
					auth_options.AddPolicy(Constants.InkBallPolicyName, policy =>
					{
						policy.RequireAuthenticatedUser()
							.AddRequirements(new InkBall.Module.MinimumAgeRequirement(18));
					});
					auth_options.AddPolicy(Constants.InkBallViewOtherGamesPolicyName, policy =>
					{
						policy.RequireAuthenticatedUser()
							.RequireClaim("role", "InkBallViewOtherPlayerGames");
					});
				});
			}

			services.ConfigureOptions(options);
			services.AddSingleton<IOptions<InkBallOptions>>(Options.Create(options));

			return services;
		}

		/*public static void PrepareSignalRForInkBall(this HubRouteBuilder routes, string path = "")
		{
			routes.MapHub<InkBall.Module.Hubs.GameHub>(path + InkBall.Module.Hubs.GameHub.HubName);
		}*/

		public static void PrepareSignalRForInkBall(this IEndpointRouteBuilder endpoints, string path = "")
		{
			endpoints.MapHub<InkBall.Module.Hubs.GameHub>(path + InkBall.Module.Hubs.GameHub.HubName);
		}
	}
}
