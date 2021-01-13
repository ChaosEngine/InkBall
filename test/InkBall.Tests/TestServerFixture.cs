using InkBall.Module;
using InkBall.Module.Model;
using MessagePack;
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
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace IntegrationTests
{
	public class TestingApplicationUser : IdentityUser, INamedAgedUser
	{
		[ProtectedPersonalData]
		public string Name { get; set; }

		//[PersonalData]
		//public int Age { get; set; }

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

	public partial class ApplicationDbContext : IdentityDbContext<TestingApplicationUser>
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
		}
	}

	public class TestingSignInManager : SignInManager<TestingApplicationUser>
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
	}

	/// <summary>
	/// Test fixture startup
	/// </summary>
	public class TestingStartup
	{
		public IConfiguration Configuration { get; }

		internal static SqliteConnection Connection { get; set; }

		public TestingStartup(IConfiguration configuration)
		{
			Configuration = configuration;

			Connection = GetSqliteInMemoryBuildOptions();
		}

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
			services.AddDbContextPool<ApplicationDbContext>(options => options.UseSqlite(Connection));
			services.AddDbContextPool<GamesContext>(options => options.UseSqlite(Connection));

			services.AddDefaultIdentity<TestingApplicationUser>()
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddDefaultTokenProviders().AddSignInManager<TestingSignInManager>();
			;
			services
				.AddAuthentication();

			services
				.AddAuthorization()
				.AddInkBallCommonUI<GamesContext, TestingApplicationUser>(options =>
				{
					options.AppRootPath = "/";
					options.UseMessagePackBinaryTransport = false;
					//options.CustomMainAuthorizationPolicyBuilder = (policy) =>
					//{
					//	policy//.AddAuthenticationSchemes("Test")
					//		.RequireAuthenticatedUser();
					//};
					//options.CustomViewOtherGamesAuthorizationPolicyBuilder = (policy) =>
					//{
					//	policy.RequireAuthenticatedUser()
					//		.RequireClaim("role", "InkBallViewOtherPlayerGames");
					//};
					options.LoginPath = "/Identity/Account/Login";
					options.LogoutPath = "/Identity/Account/Logout";
					options.RegisterPath = "/Identity/Account/Register";
				});



			// Add framework services.
			services.AddSession();
			services.AddRazorPages()
				.AddSessionStateTempDataProvider();

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
				//options.SerializerOptions.WithResolver(MessagePack.Resolvers.StandardResolver.Instance);
				options.SerializerOptions = MessagePackSerializerOptions
					.Standard
					.WithResolver(MessagePack.Resolvers.StandardResolver.Instance)
					.WithSecurity(MessagePackSecurity.UntrustedData);
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
					await context.Response.WriteAsync($"Hello World: User {context.User?.Identity?.Name}");
				});

				endpoints.PrepareSignalRForInkBall("/");
				//endpoints.MapDefaultControllerRoute();
				endpoints.MapRazorPages();
			});
		}
	}

	/// <summary>
	/// A test fixture which hosts the target project (project we wish to test) in an in-memory server.
	/// </summary>
	/// <typeparam name="TStartup"/>Target project's startup type</typeparam>
	public class TestServerFixture<TStartup> : WebApplicationFactory<TStartup>
		where TStartup : class
	{
		private HttpClient _client;

		internal string AppRootPath { get; private set; }

		internal bool DOTNET_RUNNING_IN_CONTAINER { get; private set; }

		protected override IHostBuilder CreateHostBuilder() =>
			Host.CreateDefaultBuilder().ConfigureWebHostDefaults(webBuilder =>
			{
				webBuilder
					.UseEnvironment("Test")
					.UseStartup<TestingStartup>();
			});

		public HttpClient AnonymousClient
		{
			get
			{
				if (_client == null)
				{
					var client = this.CreateClient(new WebApplicationFactoryClientOptions
					{
						AllowAutoRedirect = false
					});
					_client = client;
				}

				return _client;
			}
		}

		public async Task<HttpClient> CreateAuthenticatedClientAsync(string userName = "alice.testing@example.org",
			string password = "#SecurePassword123")
		{
			var client = this.CreateClient();

			using var get_response = await client.GetAsync($"{client.BaseAddress}Identity/Account/Login");
			var antiforgery_token = await PostRequestHelper.ExtractAntiForgeryToken(get_response);
			var form_data = new Dictionary<string, string> {
				{ "Input.Email", userName },
				{ "Input.Password", password },
				{ "Input.RememberMe", "false" },
				{ "__RequestVerificationToken", antiforgery_token }
			};

			using var postRequest = new HttpRequestMessage(HttpMethod.Post, $"{client.BaseAddress}Identity/Account/Login");

			using var formPostBodyData = new FormUrlEncodedContent(form_data);
			postRequest.Content = formPostBodyData;

			using var response = await client.SendAsync(postRequest);
			response.EnsureSuccessStatusCode();

			return client;
		}

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

		private async Task InitializeuserDbsForTests(ApplicationDbContext usersDb, GamesContext gameDb)
		{
			usersDb.Users.AddRange(new TestingApplicationUser
			{
				Id = "1",
				//Age = 18,
				Email = "test.user1@gmail.com",
				NormalizedEmail = "TEST.USER1@GMAIL.COM",
				NormalizedUserName = "TEST.USER1@GMAIL.COM",
				EmailConfirmed = false,
				PasswordHash = "AAAAAAAAAAAAAAAAAAAAAAABBSDSADFAFSDFSDFET",
				SecurityStamp = "GDFGDFGDFSGFDGFDGERTRETRETERTERTETRERTD",
				ConcurrencyStamp = "12324346457455435345",
				Name = "Test user1",
				UserName = "test.user1@gmail.com",
				UserSettingsJSON = "{}",
				PhoneNumber = "1234435345345",
			},
			new TestingApplicationUser
			{
				Id = "2",
				//Age = 20,
				Email = "test.user2@gmail.com",
				NormalizedEmail = "TEST.USER2@GMAIL.COM",
				NormalizedUserName = "TEST.USER2@GMAIL.COM",
				EmailConfirmed = false,
				PasswordHash = "AAAAAAAAAAAAAAAAAAAAAAABBSDSADFAFSDFSDFET",
				SecurityStamp = "GDFGDFGDFSGFDGFDGERTRETRETERTERTETRERTD",
				ConcurrencyStamp = "12324346457455435345",
				Name = "Test user2",
				UserName = "test.user2@gmail.com",
				UserSettingsJSON = "{}",
				PhoneNumber = "1234435345345",
			});
			await usersDb.SaveChangesAsync();

			gameDb.InkBallUsers.AddRange(new InkBallUser
			{
				iId = 1,
				iPrivileges = 0,
				sExternalId = "1",
				UserName = "Test user1",
				InkBallPlayer = new[] {
					new InkBallPlayer
					{
						iId = 1,
						iUserId = 1,
					}
				}
			},
			new InkBallUser
			{
				iId = 2,
				iPrivileges = 0,
				sExternalId = "2",
				UserName = "Test user2",
				InkBallPlayer = new[] {
					new InkBallPlayer
					{
						iId = 2,
						iUserId = 2,
					}
				}
			});
			await gameDb.SaveChangesAsync();
		}

		private async Task SeedUsers(IServiceProvider scopedServices)
		{
			try
			{
				var userManager = scopedServices.GetRequiredService<UserManager<TestingApplicationUser>>();

				// Seed the database with test data.
				var user_pass_pairs = new (TestingApplicationUser user, string pass)[]
				{
					(   new TestingApplicationUser
						{
							UserName = "alice.testing@example.org",
							Email = "alice.testing@example.org",
							//Age = 20,
							UserSettingsJSON = "{}",
							Name = "Alice Testing"
						},
						"#SecurePassword123"
					),
					(   new TestingApplicationUser
						{
							UserName = "bob.testing@example.org",
							Email = "bob.testing@example.org",
							//Age = 18,
							UserSettingsJSON = "{}",
							Name = "Bob Testing"
						},
						"P@ssw0rd123!"
					)
				};

				foreach (var pair in user_pass_pairs)
				{
					var result = await userManager.CreateAsync(pair.user, pair.pass);
					if (!result.Succeeded)
						throw new Exception($"Unable to create {pair.user.Name}:\r\n" + string.Join("\r\n", result.Errors.Select(error => $"{error.Code}: {error.Description}")));

					//var emailConfirmationToken = userManager.GenerateEmailConfirmationTokenAsync(alice).Result;
					//result = userManager.ConfirmEmailAsync("alice", emailConfirmationToken).Result;
					//if (!result.Succeeded)
					//	throw new Exception("Unable to verify alices email address:\r\n" + string.Join("\r\n", result.Errors.Select(error => $"{error.Code}: {error.Description}")));
				}

			}
			catch (Exception)
			{
				throw;
			}
		}

		protected override void ConfigureWebHost(IWebHostBuilder builder)
		{
			builder.UseContentRoot(Directory.GetCurrentDirectory());

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

					var auth_user_db = scopedServices.GetRequiredService<ApplicationDbContext>();
					var inkball_db = scopedServices.GetRequiredService<GamesContext>();

					await auth_user_db.Database.EnsureCreatedAsync();
					await inkball_db.Database.MigrateAsync();

					//await InitializeuserDbsForTests(auth_user_db, inkball_db);

					await SeedUsers(scopedServices);
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
						TestingStartup.Connection = null;
					}
					if (_client != null)
						_client.Dispose();
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
