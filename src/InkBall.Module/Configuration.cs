using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using System;
using System.Linq;

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
		public const string WwwIncludeInkballJSBundle = "~/js/inkball.Bundle.js";
		public const string WwwIncludeSharedJS = "~/js/shared.js";
		public const string WwwIncludeCSS = "~/css/inkball.css";
#else
		public const string WwwIncludeInkballJS = "~/js/inkball.min.js";
		public const string WwwIncludeInkballJSBundle = "~/js/inkball.Bundle.min.js";
		public const string WwwIncludeSharedJS = "~/js/shared.min.js";
		public const string WwwIncludeCSS = "~/css/inkball.min.css";
#endif

		#endregion JS/CSS variables
	}

	public class InkBallOptions : IPostConfigureOptions<StaticFileOptions>
	{
		internal IFileProvider WebRootFileProvider { get; set; }

		public string WwwRoot { get; set; } = "wwwroot";

		public string HeadElementsSectionName { get; set; } = "headElements";

		public string ScriptsSectionName { get; set; } = "Scripts";

		public string AppRootPath { get; set; } = "/";

		public Action<AuthorizationPolicyBuilder> CustomMainAuthorizationPolicyBuilder { get; set; }

		public Action<AuthorizationPolicyBuilder> CustomViewOtherGamesAuthorizationPolicyBuilder { get; set; }

		public Action<StaticFileResponseContext> OnStaticFilePrepareResponse { get; set; }

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

			if (OnStaticFilePrepareResponse != null)
				options.OnPrepareResponse = OnStaticFilePrepareResponse;
			else
			{
				options.OnPrepareResponse = (ctx) =>
				{
					var path = ctx.Context.Request.Path.Value;
					if (path.StartsWith("/js/AIWorker"))
					{
						//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
						//https://web.dev/coop-coep/
						ctx.Context.Response.Headers.Add("Cross-Origin-Embedder-Policy", "require-corp");
						ctx.Context.Response.Headers.Add("Cross-Origin-Opener-Policy", "same-origin");
					}
				};
			}

			// Add our provider
			var filesProvider = new ManifestEmbeddedFileProvider(GetType().Assembly, WwwRoot);
			options.FileProvider = new CompositeFileProvider(options.FileProvider, filesProvider);
		}
	}

	public static class CommonUIServiceCollectionExtensions
	{
		public static IServiceCollection AddInkBallCommonUI<TGamesDBContext, TIdentUser>(this IServiceCollection services, Action<InkBallOptions> configureOptions)
			where TGamesDBContext : IGamesContext
			where TIdentUser : IdentityUser, INamedAgedUser
		{
			var env = services.FirstOrDefault(x => x.ServiceType == typeof(IWebHostEnvironment)).ImplementationInstance as IWebHostEnvironment;
			if (env == null)
				throw new InvalidOperationException("Missing FileProvider.");

			return services.AddInkBallCommonUI<TGamesDBContext, TIdentUser>(env.WebRootFileProvider, configureOptions);
		}

		public static IServiceCollection AddInkBallCommonUI<TGamesDBContext, TIdentUser>(this IServiceCollection services, IFileProvider webRootFileProvider,
			Action<InkBallOptions> configureOptions)
			where TGamesDBContext : IGamesContext
			where TIdentUser : IdentityUser, INamedAgedUser
		{
			InkBallOptions options = new InkBallOptions();
			options.WebRootFileProvider = webRootFileProvider;
			options.ApplicationUserType = typeof(TIdentUser);

			configureOptions?.Invoke(options);

			services.AddAuthorizationCore(auth_options =>
			{
				if (options.CustomMainAuthorizationPolicyBuilder != null)
				{
					auth_options.AddPolicy(Constants.InkBallPolicyName, options.CustomMainAuthorizationPolicyBuilder);
				}
				else
				{
					auth_options.AddPolicy(Constants.InkBallPolicyName, policy =>
					{
						policy.RequireAuthenticatedUser()
							//.AddRequirements(new MinimumAgeRequirement(18))
							;
					});
				}
				if (options.CustomViewOtherGamesAuthorizationPolicyBuilder != null)
				{
					auth_options.AddPolicy(Constants.InkBallViewOtherGamesPolicyName, options.CustomViewOtherGamesAuthorizationPolicyBuilder);
				}
				else
				{
					auth_options.AddPolicy(Constants.InkBallViewOtherGamesPolicyName, policy =>
					{
						policy.RequireAuthenticatedUser()
							.RequireClaim("role", "InkBallViewOtherPlayerGames");
					});
				}
			});

			services.ConfigureOptions(options);
			services.AddSingleton<IOptions<InkBallOptions>>(Options.Create(options));

			HtmlHelpers.SetupHelpers(options);

			return services;
		}

		public static void PrepareSignalRForInkBall(this IEndpointRouteBuilder endpoints, string path = "")
		{
			endpoints.MapHub<Hubs.GameHub>(path + Hubs.GameHub.HubName);
		}
	}
}
