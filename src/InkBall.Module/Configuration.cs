using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;

[assembly: InternalsVisibleTo("InkBall.Tests")]

namespace InkBall.Module
{
	public static class Constants
	{
		public const string InkBallPolicyName = "InkBallPlayerPolicy";
		public const string InkBallViewOtherGamesPolicyName = "InkBallViewOtherGamesPolicy";
		public const string ServiceModePolicyName = "ServiceModeGamesPolicy";

		/// <summary>
		// When point is put, and user pushed StopAndraw button - one is allowed to close a path withing this much number of seconds
		// which should be accepted
		/// </summary>
		public const int PathAfterPointDrawAllowanceSecAmount = 120;

		static readonly string _versionHashQueryParam;

		/// <summary>
		/// Implemented after https://stackoverflow.com/questions/3625658/how-do-you-create-the-hash-of-a-folder-in-c
		/// </summary>
		/// <param name="webContentPath"></param>
		/// <param name="moduleGuidBytes"></param>
		/// <param name="searchPattern"></param>
		/// <returns></returns>
		static string CalculateGlobalHashFromModuleAndWebContent(string webContentPath, byte[] moduleGuidBytes,
#if DEBUG
			string searchPattern = "*"
#else
			string searchPattern = "*min*"
#endif
			)
		{
			try
			{
				// assuming you want to include nested folders
				var files = Directory.EnumerateFiles(webContentPath, searchPattern, SearchOption.AllDirectories)
													.OrderBy(p => p)
													.ToList();

				using var hasher = MD5.Create();

				foreach (var file in files)
				{
					// hash path
					string relativePath = file.Substring(webContentPath.Length + 1);
					byte[] pathBytes = Encoding.UTF8.GetBytes(relativePath.ToLower());
					hasher.TransformBlock(pathBytes, 0, pathBytes.Length, pathBytes, 0);

					// hash contents
					byte[] contentBytes = File.ReadAllBytes(file);
					hasher.TransformBlock(contentBytes, 0, contentBytes.Length, contentBytes, 0);
				}
				hasher.TransformFinalBlock(moduleGuidBytes, 0, moduleGuidBytes.Length);

				return BitConverter.ToString(hasher.Hash).Replace("-", "").ToLower();
			}
			catch (Exception)
			{
				return "baaadhashbaaadhashbaaadhashbaaadhash";
			}
		}

		static Constants()
		{
			var assembly = typeof(Constants).GetTypeInfo().Assembly;
			var module_hashId = assembly.ManifestModule.ModuleVersionId;

			string assembly_location = new Uri(assembly.Location).AbsolutePath;
			var location_dir = Path.GetDirectoryName(assembly_location);
			string inkBall_Module_wwwroot_full_path = Path.Combine(location_dir, "IBwwwroot");

			var uber_hash = CalculateGlobalHashFromModuleAndWebContent(inkBall_Module_wwwroot_full_path, module_hashId.ToByteArray());

			_versionHashQueryParam = $"?v={uber_hash}";
		}

		#region JS/CSS variables

#if DEBUG
		public static string WwwIncludeInkballJS => "~/js/inkball.js" + _versionHashQueryParam;
		public static string WwwIncludeSharedJS => "~/js/shared.js" + _versionHashQueryParam;
		public static string WwwIncludeCSS => "~/css/inkball.css" + _versionHashQueryParam;
#else
		public static string WwwIncludeInkballJS => "~/js/inkball.min.js" + _versionHashQueryParam;
		public static string WwwIncludeSharedJS => "~/js/shared.min.js" + _versionHashQueryParam;
		public static string WwwIncludeCSS => "~/css/inkball.min.css" + _versionHashQueryParam;
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

		public Action<AuthorizationPolicyBuilder> CustomServiceModeAuthorizationPolicyBuilder { get; set; }

		public Action<StaticFileResponseContext> OnStaticFilePrepareResponse { get; set; }

		public Type ApplicationUserType { get; set; }

		public bool UseMessagePackBinaryTransport { get; set; } = false;

		// public bool EnablePolyfill { get; set; } = true;

		public string LoginPath { get; set; }

		public string LogoutPath { get; set; }

		public string RegisterPath { get; set; }

		public void PostConfigure(string name, StaticFileOptions options)
		{
			#region Old code

			//name = name ?? throw new ArgumentNullException(nameof(name));
			//options = options ?? throw new ArgumentNullException(nameof(options));

			// Basic initialization in case the options weren't initialized by any other component
			// options.ContentTypeProvider = options.ContentTypeProvider ?? new FileExtensionContentTypeProvider();
			// if (options.FileProvider == null && WebRootFileProvider == null)
			// {
			// 	throw new InvalidOperationException("Missing FileProvider.");
			// }

			// options.FileProvider = options.FileProvider ?? WebRootFileProvider;

			// if (OnStaticFilePrepareResponse != null)
			// 	options.OnPrepareResponse = OnStaticFilePrepareResponse;
			// else
			// {
			// 	options.OnPrepareResponse = (ctx) =>
			// 	{
			// 		var path = ctx.Context.Request.Path.Value;
			// 		if (path.StartsWith("/IB/js/AIWorker"))
			// 		{
			// 			//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
			// 			//https://web.dev/coop-coep/
			// 			ctx.Context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");
			// 			ctx.Context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
			// 		}
			// 	};
			// }

			// Add our provider
			// var filesProvider = new ManifestEmbeddedFileProvider(GetType().Assembly, WwwRoot);
			// var filesProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(

			#endregion Old code
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
				throw new InvalidOperationException($"Missing env: {nameof(IWebHostEnvironment)}");

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

				if (options.CustomServiceModeAuthorizationPolicyBuilder != null)
				{
					auth_options.AddPolicy(Constants.ServiceModePolicyName, options.CustomServiceModeAuthorizationPolicyBuilder);
				}
				else
				{
					auth_options.AddPolicy(Constants.ServiceModePolicyName, policy =>
					{
						policy.RequireAuthenticatedUser()
							.RequireClaim("role", "InkBallServiceMode")
							.AddRequirements(new ServiceMenuForGameRequirement());
					});
				}
			});

			services.ConfigureOptions(options);
			services.AddSingleton<IOptions<InkBallOptions>>(Options.Create(options));
			services.AddSingleton<IAuthorizationHandler, ServiceMenuForGameAuthorizationHandler>();

			HtmlHelpers.SetupHelpers(options);

			return services;
		}

		public static void PrepareSignalRForInkBall(this IEndpointRouteBuilder endpoints, string path = "")
		{
			endpoints.MapHub<Hubs.GameHub>(path + Hubs.GameHub.HubName);
		}


		public static IApplicationBuilder UseStaticFilesForInkBall(this IApplicationBuilder builder, string contentRootPath)
		{
			if (!Directory.Exists(contentRootPath))
				throw new ArgumentException($"Bad '{nameof(contentRootPath)}' argument");

			builder.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new PhysicalFileProvider(contentRootPath),
				// RequestPath = "/IB",
				OnPrepareResponse = (ctx) =>
				{
					var path = ctx.Context.Request.Path.Value;
					if (path.StartsWith("/js/AIWorker"))
					{
						//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
						//https://web.dev/coop-coep/
						ctx.Context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");
						ctx.Context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
					}
				}
			});

			return builder;
		}

		public static IApplicationBuilder UseStaticFilesForInkBall(this IApplicationBuilder builder)
		{
#if DEBUG
			var env = builder.ApplicationServices.GetService<IWebHostEnvironment>();
			if (env == null)
				throw new ArgumentException($"Missing env: {nameof(IWebHostEnvironment)}");

			string inkBall_Module_wwwroot_full_path = Path.Combine(env.ContentRootPath, "../InkBall/src/InkBall.Module/IBwwwroot");
			if (!Directory.Exists(inkBall_Module_wwwroot_full_path))
			{
				var assm = typeof(InkBallOptions).GetTypeInfo().Assembly;
				string assembly_location = new Uri(assm.Location).AbsolutePath;

				var location_dir = Path.GetDirectoryName(assembly_location);
				inkBall_Module_wwwroot_full_path = Path.Combine(location_dir, "IBwwwroot");
			}
#else
			var ass = typeof(InkBallOptions).GetTypeInfo().Assembly;
			string assembly_location = new Uri(ass.Location).AbsolutePath;

			var location_dir = Path.GetDirectoryName(assembly_location);

			string inkBall_Module_wwwroot_full_path = Path.Combine(location_dir, "IBwwwroot");
#endif

			return builder.UseStaticFilesForInkBall(inkBall_Module_wwwroot_full_path);
		}
	}
}
