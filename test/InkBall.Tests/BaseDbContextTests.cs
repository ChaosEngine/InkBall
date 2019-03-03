using System;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace InkBall.Tests
{
	public abstract class BaseDbContextTests : IDisposable
	{
		CancellationTokenSource _cancellationSource = new CancellationTokenSource();

		public (SqliteConnection Conn, DbContextOptions<GamesContext> DbOpts,
				IConfiguration Conf, IMemoryCache Cache, ILogger<BaseDbContextTests> Logger)
				Setup
		{
			get; set;
		}

		protected CancellationToken CancellationToken
		{
			get
			{
				CancellationToken token = _cancellationSource.Token;
				return token;
			}
		}

		protected async Task<(SqliteConnection, DbContextOptions<GamesContext>,
							IConfiguration, IMemoryCache, ILogger<BaseDbContextTests>)>
							SetupInMemoryDB()
		{
			var builder = new ConfigurationBuilder()
				// .AddJsonFile("config.json", optional: false, reloadOnChange: true)
				;
			var config = builder.Build();

			var connection = new SqliteConnection("DataSource=:memory:");

			// In-memory database only exists while the connection is open
			await connection.OpenAsync(CancellationToken);

			var options = new DbContextOptionsBuilder<GamesContext>()
				.UseSqlite(connection)
				.Options;

			// Create the schema in the database
			using (var context = new GamesContext(options))
			{
				await context.Database.EnsureCreatedAsync(CancellationToken);
			}

			var serviceCollection = new ServiceCollection()
				.AddMemoryCache()
				.AddLogging();
			serviceCollection.AddDataProtection();
			var serviceProvider = serviceCollection.BuildServiceProvider();

			IMemoryCache cache = serviceProvider.GetService<IMemoryCache>();

			var logger = serviceProvider.GetService<ILoggerFactory>()
				.CreateLogger<BaseDbContextTests>();

			return (connection, options, config, cache, logger);
		}

		public BaseDbContextTests()
		{
			var db = SetupInMemoryDB();
			db.Wait();
			Setup = db.Result;
		}

		#region IDisposable Support
		private bool disposedValue = false; // To detect redundant calls

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					// TODO: dispose managed state (managed objects).
					Setup.Conn.Close();
					Setup.Conn.Dispose();
					_cancellationSource?.Dispose();
				}

				// TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
				// TODO: set large fields to null.

				disposedValue = true;
			}
		}

		// TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
		// ~BloggingContextDBFixture() {
		//   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
		//   Dispose(false);
		// }

		// This code added to correctly implement the disposable pattern.
		public void Dispose()
		{
			// Do not change this code. Put cleanup code in Dispose(bool disposing) above.
			Dispose(true);
			// TODO: uncomment the following line if the finalizer is overridden above.
			// GC.SuppressFinalize(this);
		}
		#endregion
	}
}
