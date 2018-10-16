using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace InkBall.Module
{
	public class CommonUIConfigureOptions : IPostConfigureOptions<StaticFileOptions>
	{
		public static string WwwRoot { get; internal set; }

		public IHostingEnvironment Environment { get; }

		public static string HeadElementsSectionName { get; internal set; }

		public static string ScriptsSectionName { get; internal set; }

		public CommonUIConfigureOptions(IHostingEnvironment environment)
		{
			Environment = environment;
		}

		public void PostConfigure(string name, StaticFileOptions options)
		{
			name = name ?? throw new ArgumentNullException(nameof(name));
			options = options ?? throw new ArgumentNullException(nameof(options));

			// Basic initialization in case the options weren't initialized by any other component
			options.ContentTypeProvider = options.ContentTypeProvider ?? new FileExtensionContentTypeProvider();
			if (options.FileProvider == null && Environment.WebRootFileProvider == null)
			{
				throw new InvalidOperationException("Missing FileProvider.");
			}

			options.FileProvider = options.FileProvider ?? Environment.WebRootFileProvider;

			// Add our provider
			var filesProvider = new ManifestEmbeddedFileProvider(GetType().Assembly, WwwRoot);
			options.FileProvider = new CompositeFileProvider(options.FileProvider, filesProvider);
		}
	}

	public static class CommonUIServiceCollectionExtensions
	{
		public static void AddCommonUI(this IServiceCollection services,
			string headElementsSectionName = "badbad", string scriptsSectionName = "ecmascript_bad", string wwwRoot = "wrongwrongwrong")
		{
			CommonUIConfigureOptions.HeadElementsSectionName = headElementsSectionName;
			CommonUIConfigureOptions.ScriptsSectionName = scriptsSectionName;
			CommonUIConfigureOptions.WwwRoot = wwwRoot;

			services.ConfigureOptions<CommonUIConfigureOptions>();
		}
	}
}
