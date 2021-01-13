using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace InkBall.Tests
{
	public abstract class DbContextSetup : IDisposable
	{
		CancellationTokenSource _cancellationSource = new CancellationTokenSource();

		public (SqliteConnection Conn, DbContextOptions<GamesContext> DbOpts,
				IConfiguration Conf, IMemoryCache Cache, ILogger<GameHub> Logger)
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
							IConfiguration, IMemoryCache, ILogger<GameHub>)>
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
				.CreateLogger<GameHub>();

			return (connection, options, config, cache, logger);
		}

		public DbContextSetup()
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

	public abstract class BaseDbContextTests : DbContextSetup
	{
		protected async Task CreateComplexGameHierarchy(CancellationToken token = default,
			InkBallGame.GameTypeEnum gameType2Create = InkBallGame.GameTypeEnum.FIRST_CAPTURE)
		{
			//Arrange
			var game0 = new InkBallGame
			{
				iId = 1,
				CreateTime = DateTime.Now,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				GameType = gameType2Create,
				Player1 = new InkBallPlayer
				{
					iId = 1,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 1,
						UserName = "test_p1",
						iPrivileges = 0,
						sExternalId = "xxxxx",
					}
				},
				iPlayer1Id = 1,
				Player2 = new InkBallPlayer
				{
					iId = 2,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 2,
						UserName = "test_p2",
						iPrivileges = 0,
						sExternalId = "yyyyy",
					}
				},
				iPlayer2Id = 2
			};
			var points0 = new List<InkBallPoint>(100);
			var paths0 = new List<InkBallPath>(5);
			bool is_player_turn = true;
			foreach (var source in UnitTest1.CorrectPathAndOwnedPointsData)
			{
				((int x, int y)[] coords, string expectedCoords, (int x, int y)[] ownedPoints) parameters =
					(ValueTuple<(int, int)[], string, (int, int)[]>)source[0];

				foreach ((int x, int y) pt in parameters.coords.Union(parameters.ownedPoints))
				{
					points0.Add(new InkBallPoint
					{
						//iId = 1,
						iX = pt.x,
						iY = pt.y,
						Game = game0,
						iGameId = game0.iId,
						Status = InkBallPoint.StatusEnum.POINT_IN_PATH,
						iEnclosingPathId = null,
						Player = game0.Player1
					});
				}

				var db_path = new InkBallPath
				{
					Game = game0,
					iGameId = game0.iId,
					Player = is_player_turn ? game0.Player1 : game0.Player2,
					iPlayerId = is_player_turn ? game0.iPlayer1Id : game0.iPlayer2Id.GetValueOrDefault(0)

				};
				// int order = 1;
				var path_vm = new InkBallPathViewModel
				{
					iGameId = game0.iId,
					PointsAsString = parameters.expectedCoords,
					iPlayerId = is_player_turn ? game0.iPlayer1Id : game0.iPlayer2Id.GetValueOrDefault(0)
				};

				paths0.Add(db_path);
				foreach (var owned in parameters.ownedPoints)
				{
					points0.Where(p => p.iX == owned.x && p.iY == owned.y).ToList().ForEach((pt) =>
					{
						pt.EnclosingPath = db_path;
						pt.Status = db_path.Game.Player1 == db_path.Player ?
							InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE : InkBallPoint.StatusEnum.POINT_OWNED_BY_RED;
					});
				}
				path_vm.OwnedPointsAsString = parameters.ownedPoints.Select(o => $"{o.x},{o.y}").Aggregate((me, me1) => me + " " + me1);
				db_path.PointsAsString = JsonSerializer.Serialize(path_vm, new JsonSerializerOptions { IgnoreNullValues = true });

				is_player_turn = !is_player_turn;
			}

			//Act
			using (var context = new GamesContext(Setup.DbOpts))
			{
				await context.AddAsync(game0, token);

				foreach (var pt in points0)
					await context.AddAsync(pt, token);

				foreach (var pa in paths0)
					await context.AddAsync(pa, token);

				await context.SaveChangesAsync(token);
			}
		}

		protected async Task CreateInitialUsers(string[] userIDs, int[] playerIDs, CancellationToken token = default)
		{
			if (playerIDs != null && userIDs?.Length != playerIDs?.Length)
				throw new ArgumentException("userIDs?.Length != playerIDs?.Length");

			using (var context = new GamesContext(Setup.DbOpts))
			{
				int i = 1;
				foreach (var uid in userIDs)
				{
					var user = new InkBallUser
					{
						//iId = 1,
						UserName = $"test_p{i}",
						iPrivileges = 0,
						sExternalId = uid,
					};
					await context.AddAsync(user, token);

					if (playerIDs != null)
					{
						var player = new InkBallPlayer
						{
							User = user,
							iUserId = user.iId,
							iId = playerIDs[i - 1],
						};
						await context.AddAsync(player, token);
					}
					i++;
				}

				await context.SaveChangesAsync(token);
			}
		}

		public BaseDbContextTests() : base()
		{
		}
	}
}
