using System;
using System.Linq;
using System.Threading.Tasks;
using InkBall.Module.Model;
using Xunit;

namespace InkBall.Tests
{
	public class DbContextTests : BaseDbContextTests, IDisposable
	{
		public DbContextTests() : base()
		{
		}

		[Fact]
		public async Task BasicHierarchyCreation()
		{
			//Arrange
			var game0 = new InkBallGame
			{
				//iId = 1,
				CreateTime = DateTime.UtcNow,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				Player1 = new InkBallPlayer
				{
					//iId = 1,
					sLastMoveCode = "{}",
					//User = new InkBallUser
					//{
					UserName = "test",
					iPrivileges = 0,
					sExternalId = "xxxxx",
					//}
				}
			};
			var points0 = new[] {
					new InkBallPoint
					{
						//iId = 1,
						iX = 1,
						iY = 1,
						Game = game0,
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
						iEnclosingPathId = null,
						Player = game0.Player1
					}
				};
			var token = CancellationToken;

			//Act
			using (var context = new GamesContext(Setup.DbOpts))
			{
				await context.AddAsync(game0, token);

				foreach (var pt in points0)
					await context.AddAsync(pt, token);

				await context.SaveChangesAsync(token);
			}

			//Assert
			using (var context = new GamesContext(Setup.DbOpts))
			{
				var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(/*null, null, null, true, */token);
				Assert.NotEmpty(games);

				var points_n_paths = await context.LoadPointsAndPathsAsync(games.First().iId, token);
				Assert.NotNull(points_n_paths.Points);
				Assert.NotNull(points_n_paths.Paths);

				var points1 = points_n_paths.Points;
				Assert.NotEmpty(points1);
			}
		}

		[Fact]
		public async Task FullHierarchyCreation()
		{
			//Arrange
			var token = CancellationToken;

			await CreateComplexGameHierarchy(token);

			//Act
			using (var context = new GamesContext(Setup.DbOpts))
			{
				var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(/*null, null, null, true, */token);

				//Assert
				Assert.NotEmpty(games);

				var points_n_paths = await context.LoadPointsAndPathsAsync(games.First().iId, token);

				Assert.NotNull(points_n_paths.Points);
				Assert.NotNull(points_n_paths.Paths);

				var points1 = points_n_paths.Points;
				Assert.NotEmpty(points1);
			}
		}

		[Fact]
		public async Task Benchmark_GetPathAndPoints()
		{
			//Arrange
			var token = CancellationToken;

			await CreateComplexGameHierarchy(token);

			//Act
			int count = 10;
			while (count-- > 0)
			{
				using (var context = new GamesContext(Setup.DbOpts))
				{
					var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(/*null, null, null, true, */token);

					//Assert
					Assert.NotEmpty(games);

					var points_n_paths = await context.LoadPointsAndPathsAsync(games.First().iId, token);

					Assert.NotNull(points_n_paths.Points);
					Assert.NotNull(points_n_paths.Paths);

					var points1 = points_n_paths.Points;
					Assert.NotEmpty(points1);
				}
			}
		}


		[Fact]
		public async Task NoDummyEmptyOrNullFieldsSerializedToString()
		{
			//Arrange
			var token = CancellationToken;

			await CreateComplexGameHierarchy(token);

			//Act
			using (var context = new GamesContext(Setup.DbOpts))
			{
				var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(/*null, null, null, true, */token);

				//Assert
				Assert.NotEmpty(games);

				var points_n_paths = await context.LoadPointsAndPathsAsync(games.First().iId, token);

				//Assert
				Assert.Empty(points_n_paths.Paths.Where(pa =>
					pa.PointsAsString.Contains(nameof(InkBallPathViewModel.TimeStamp)) ||
					pa.PointsAsString.Contains(nameof(InkBallPath.InkBallPoint)) ||
					pa.PointsAsString.Contains(nameof(InkBallPath.BelongsToCPU))
					));

				//Assert
				Assert.Empty(context.InkBallPlayer.Where(pl =>
					pl.sLastMoveCode.Contains(nameof(InkBallPathViewModel.TimeStamp)) ||
					pl.sLastMoveCode.Contains(nameof(InkBallPath.InkBallPoint)) ||
					pl.sLastMoveCode.Contains(nameof(InkBallPath.BelongsToCPU))
					));
			}
		}
	}
}
