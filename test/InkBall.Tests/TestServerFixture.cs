﻿using InkBall.Module;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace InkBall.Tests
{
	public class TestingApplicationUser : IdentityUser, INamedAgedUser
	{
		[ProtectedPersonalData]
		public string Name { get; set; }

		[PersonalData]
		public int Age { get; set; }

		[PersonalData]
		[NotMapped]
		public IApplicationUserSettings UserSettings
		{
			get
			{
				return JsonSerializer.Deserialize<ApplicationUserSettings>(UserSettingsJSON ?? "{}",
					new JsonSerializerOptions { IgnoreNullValues = true });
			}
			set
			{
				UserSettingsJSON = JsonSerializer.Serialize(value, new JsonSerializerOptions { IgnoreNullValues = true });
			}
		}

		public string UserSettingsJSON { get; set; }
	}

	public partial class TestingContext : IdentityDbContext<TestingApplicationUser>
	{
		public TestingContext(DbContextOptions<TestingContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
		}
	}

	/*public class TestingSignInManager : SignInManager<TestingApplicationUser>
	{
		public TestingSignInManager(
			UserManager<TestingApplicationUser> userManager,
			IHttpContextAccessor contextAccessor,
			IUserClaimsPrincipalFactory<TestingApplicationUser> claimsFactory,
			IOptions<IdentityOptions> optionsAccessor,
			ILogger<SignInManager<TestingApplicationUser>> logger,
			IAuthenticationSchemeProvider schemes,
			IUserConfirmation<TestingApplicationUser> confirmation
			) : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
		{
		}

		public override async Task<ClaimsPrincipal> CreateUserPrincipalAsync(TestingApplicationUser user)
		{
			var principal = await base.CreateUserPrincipalAsync(user);

			await Authentication.InkBallCreateUserPrincipalAsync(Context, user, principal);

			return principal;
		}

		public override async Task SignOutAsync()
		{
			//TODO: it is questionable whether to execute player-loosing when intentionally signing out
			//await Authentication.InkBallSignOutActionAsync(Context, Logger, Context.User.FindFirstValue(ClaimTypes.NameIdentifier));

			await base.SignOutAsync();
		}
	}*/

	public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
	{
		public TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
			ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
			: base(options, logger, encoder, clock)
		{
		}

		protected override Task<AuthenticateResult> HandleAuthenticateAsync()
		{
			if (Request.Headers.TryGetValue("Authorization", out StringValues auth) && auth == "Test")
			{
				var claims = new[] {
					new Claim(ClaimTypes.Name, "Test user") ,
					new Claim(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId), 1.ToString()),
					new Claim(ClaimTypes.DateOfBirth, DateTime.Now.Date.AddYears(-18).ToString("O"))
				};
				var identity = new ClaimsIdentity(claims, "Test");
				var principal = new ClaimsPrincipal(identity);
				var ticket = new AuthenticationTicket(principal, "Test");

				var result = AuthenticateResult.Success(ticket);

				return Task.FromResult(result);
			}
			else
			{
				var result = AuthenticateResult.NoResult();

				return Task.FromResult(result);
			}
		}
	}

	/// <summary>
	/// Test fixture startup
	/// </summary>
	public class TestingStartup : IDisposable
	{
		public IConfiguration Configuration { get; }
		internal static SqliteConnection Connection { get; set; }

		public TestingStartup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		/// <summary>
		/// TODO: dispose properly this connection when not needed anymore
		/// </summary>
		/// <returns></returns>
		SqliteConnection GetSqliteInMemoryBuildOptions()
		{
			var connection = new SqliteConnection("DataSource=:memory:");

			// In-memory database only exists while the connection is open
			connection.Open();

			//DbContextOptions<T> options = new DbContextOptionsBuilder<T>()
			//	.UseSqlite(connection)
			//	.Options;

			//return options;
			return connection;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services)
		{
			var env = services.FirstOrDefault(x => x.ServiceType == typeof(IWebHostEnvironment)).ImplementationInstance as IWebHostEnvironment;

			Connection = GetSqliteInMemoryBuildOptions();
			services.AddDbContextPool<TestingContext>(options =>
			{
				options.UseSqlite(Connection);
			});
			services.AddDbContextPool<GamesContext>(options =>
			{
				options.UseSqlite(Connection);
			});

			services.AddIdentity<TestingApplicationUser, IdentityRole>()
				.AddEntityFrameworkStores<TestingContext>()
				.AddDefaultTokenProviders()
				//.AddSignInManager<TestingSignInManager>()*/
				;
			services
				//.AddAuthentication();
				.AddAuthentication("Test")
				.AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", options => { });
			services
				//.AddAuthorization()
				.AddInkBallCommonUI<GamesContext, TestingApplicationUser>(env.WebRootFileProvider, options =>
				{
					// options.WwwRoot = "wrongwrongwrong";
					// options.ScriptsSectionName = "Script";
					options.AppRootPath = "/";
					options.UseMessagePackBinaryTransport = false;
					options.CustomMainAuthorizationPolicyBuilder = (policy) =>
					{
						policy.AddAuthenticationSchemes("Test")
							.RequireAuthenticatedUser();
					};
					options.CustomViewOtherGamesAuthorizationPolicyBuilder = (policy) =>
					{
						policy.RequireAuthenticatedUser()
							.RequireClaim("role", "InkBallViewOtherPlayerGames");
					};
					options.LoginPath = "/Identity/Account/Login";
					options.LogoutPath = "/Identity/Account/Logout";
					options.RegisterPath = "/Identity/Account/Register";
				});



			// Add framework services.
			services.AddSession();
			services.AddRazorPages();


			services.AddSignalR(options =>
			{
				options.EnableDetailedErrors = true;
				//options.SupportedProtocols = new System.Collections.Generic.List<string>(new[] { "websocket" });
#if DEBUG
				options.KeepAliveInterval = TimeSpan.FromSeconds(30);
				options.ClientTimeoutInterval = options.KeepAliveInterval * 2;
#endif
			})
			.AddJsonProtocol()
			.AddMessagePackProtocol(options =>
			{
				options.FormatterResolvers = new List<MessagePack.IFormatterResolver>()
				{
					MessagePack.Resolvers.StandardResolver.Instance
				};
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
			}

			//app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseRouting();
			app.UseSession();
			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapGet("/", async context =>
				{
					await context.Response.WriteAsync("Hello world");
				});

				endpoints.PrepareSignalRForInkBall("/");
				//endpoints.MapDefaultControllerRoute();
				endpoints.MapRazorPages();
			});
		}

		#region IDisposable

		private bool disposedValue;

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects)
					if(Connection != null && Connection.State == System.Data.ConnectionState.Open)
					{
						Connection.Close();
						Connection.Dispose();
					}
				}

				// TODO: free unmanaged resources (unmanaged objects) and override finalizer
				// TODO: set large fields to null
				disposedValue = true;
			}
		}

		// // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
		// ~TestingStartup()
		// {
		//     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
		//     Dispose(disposing: false);
		// }

		public void Dispose()
		{
			// Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
			Dispose(disposing: true);
			GC.SuppressFinalize(this);
		}

		#endregion IDisposable
	}

	/// <summary>
	/// A test fixture which hosts the target project (project we wish to test) in an in-memory server.
	/// </summary>
	/// <typeparam name="TStartup"/>Target project's startup type</typeparam>
	public class TestServerFixture<TStartup> : WebApplicationFactory<TStartup>
		where TStartup : class
	{
		public HttpClient Client
		{
			get
			{
				var client = this.CreateClient(new WebApplicationFactoryClientOptions
				{
					AllowAutoRedirect = false
				});
				//cl.BaseAddress = new Uri("http://localhost");
				return client;
			}
		}

		internal string AppRootPath { get; private set; }

		internal bool DOTNET_RUNNING_IN_CONTAINER { get; private set; }

		protected override IHostBuilder CreateHostBuilder() =>
			Host.CreateDefaultBuilder().ConfigureWebHostDefaults(webBuilder =>
			{
				webBuilder
					.UseKestrel()
					.UseSockets()
					.UseContentRoot(Directory.GetCurrentDirectory())
					.UseStartup<TestingStartup>();
			});

		/// <summary>
		/// Gets the full path to the target project that we wish to test
		/// </summary>
		/// <param name="projectRelativePath">
		/// The parent directory of the target project.
		/// e.g. src, samples, test, or test/Websites
		/// </param>
		/// <param name="startupAssembly">The target project's assembly.</param>
		/// <returns>The full path to the target project.</returns>
		private static string GetProjectPath(string projectRelativePath, Assembly startupAssembly)
		{
			// Get name of the target project which we want to test
			var projectName = startupAssembly.GetName().Name;

			projectRelativePath = projectRelativePath ?? projectName;

			// Get currently executing test project path
			var applicationBasePath = AppContext.BaseDirectory;

			// Find the path to the target project
			var directoryInfo = new DirectoryInfo(applicationBasePath);
			do
			{
				directoryInfo = directoryInfo.Parent;

				var projectDirectoryInfo = directoryInfo.EnumerateDirectories().FirstOrDefault(d => d.Name == projectRelativePath);
				if (projectDirectoryInfo != null)
				{
					var projectFileInfo = new FileInfo(Path.Combine(projectDirectoryInfo.FullName, $"{projectName}.csproj"));
					if (projectFileInfo.Exists)
					{
						return projectDirectoryInfo.FullName;
					}
				}
			}
			while (directoryInfo.Parent != null);

			throw new Exception($"Project root could not be located using the application root {applicationBasePath}.");
		}

		private async Task InitializeuserDbsForTests(TestingContext usersDb, GamesContext gameDb)
		{
			usersDb.Users.Add(new TestingApplicationUser
			{
				Id = "43608c81-6e36-4fe3-9d6b-951f359ac959",
				Age = 18,
				Email = "andrzej.pauli@gmail.com",
				NormalizedEmail = "ANDRZEJ.PAULI@GMAIL.COM",
				NormalizedUserName = "ANDRZEJ.PAULI@GMAIL.COM",
				EmailConfirmed = false,
				PasswordHash = "AQAAAAEAACcQAAAAEKhW+0fZSBDqBjyGRUAwYl7jwdMmeUg9QoXJJIFPrVNOuZtzX7j6M7Yf6g+1Gq6BHA==",
				SecurityStamp = "CI7TLP3QEA35SG2URXODD7WOUSWFFJEY",
				ConcurrencyStamp = "49ccc5ac-639d-4445-a0a0-70e50eef353d",
				Name = "Andrzej Pauli",
				UserName = "andrzej.pauli@gmail.com",
				UserSettingsJSON = "{}",
				PhoneNumber = "1234435345345",
			});
			await usersDb.SaveChangesAsync();

			gameDb.InkBallUsers.Add(new InkBallUser
			{
				iId = 1,
				iPrivileges = 0,
				sExternalId = "43608c81-6e36-4fe3-9d6b-951f359ac959",
				UserName = "Andrzej Pauli",
				InkBallPlayer = new[] {
					new InkBallPlayer
					{
						iId = 1,
						iUserId = 1,
					}
				}
			});
			await gameDb.SaveChangesAsync();
		}

		protected override void ConfigureWebHost(IWebHostBuilder builder)
		{
			var startupAssembly = typeof(TStartup).GetTypeInfo().Assembly;
			var contentRoot = Directory.GetCurrentDirectory();//GetProjectPath(null, startupAssembly);

			//Directory.SetCurrentDirectory(contentRoot);

			builder.UseContentRoot(contentRoot)
				.UseEnvironment("Development");

			builder.ConfigureServices(async services =>
			{
				// Build the service provider.
				var sp = services.BuildServiceProvider();

				// Create a scope to obtain a reference to the database context (ApplicationDbContext).
				using (var scope = sp.CreateScope())
				{
					var scopedServices = scope.ServiceProvider;

					//var configuration = scopedServices.GetService(typeof(IConfiguration)) as IConfiguration;
					AppRootPath = "/";

					string temp = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER");
					DOTNET_RUNNING_IN_CONTAINER = !string.IsNullOrEmpty(temp) && temp.Equals(true.ToString(), StringComparison.InvariantCultureIgnoreCase);

					var auth_user_db = scopedServices.GetRequiredService<TestingContext>();
					var inkball_db = scopedServices.GetRequiredService<GamesContext>();

					await auth_user_db.Database.EnsureCreatedAsync();
					await inkball_db.Database.MigrateAsync();

					await InitializeuserDbsForTests(auth_user_db, inkball_db);
				}
			});
		}

		#region IDisposable

		private bool disposedValue;

		protected override void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects)
					if (TestingStartup.Connection != null && TestingStartup.Connection.State == System.Data.ConnectionState.Open)
					{
						TestingStartup.Connection.Close();
						TestingStartup.Connection.Dispose();
					}
				}

				// TODO: free unmanaged resources (unmanaged objects) and override finalizer
				// TODO: set large fields to null
				disposedValue = true;
			}
		}

		#endregion IDisposable
	}

	[CollectionDefinition(nameof(TestingServerCollection))]
	public class TestingServerCollection : ICollectionFixture<TestServerFixture<TestingStartup>>
	{
		// This class has no code, and is never created. Its purpose is simply
		// to be the place to apply [CollectionDefinition] and all the
		// ICollectionFixture<> interfaces.
	}
}
