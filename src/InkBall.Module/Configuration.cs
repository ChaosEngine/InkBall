﻿using System;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace InkBall.Module
{
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
		public static IServiceCollection AddInkBallCommonUI<TGamesDBContext, TIdentUser>(this IServiceCollection services, IHostingEnvironment environment,
			Action<InkBallOptions> configureOptions)
			where TGamesDBContext : IGamesContext
			where TIdentUser : IdentityUser, INamedAgedUser
		{
			InkBallOptions options = new InkBallOptions();
			options.WebRootFileProvider = environment.WebRootFileProvider;
			options.ApplicationUserType = typeof(TIdentUser);

			configureOptions?.Invoke(options);

			if (options.CustomAuthorizationPolicyBuilder != null)
			{
				services.AddAuthorization(auth_options =>
				{
					auth_options.AddPolicy("InkBallPlayerPolicy", options.CustomAuthorizationPolicyBuilder);
				});
			}
			else
			{
				services.AddAuthorization(auth_options =>
				{
					auth_options.AddPolicy("InkBallPlayerPolicy", policy =>
					{
						policy.RequireAuthenticatedUser()
							.AddRequirements(new InkBall.Module.MinimumAgeRequirement(18));
					});
				});
			}

			services.ConfigureOptions(options);
			services.AddSingleton<IOptions<InkBallOptions>>(Options.Create(options));

			return services;
		}

		public static void PrepareSignalRForInkBall(this HubRouteBuilder routes, string path = "")
		{
			routes.MapHub<InkBall.Module.Hubs.GameHub>(path + InkBall.Module.Hubs.GameHub.HubName);
		}
	}
}
