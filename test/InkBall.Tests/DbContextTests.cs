using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace InkBall.Tests
{
	public class DbContextTests : BaseDbContextTests, IDisposable
	{
		async Task CreateComplexGameHierarchy(CancellationToken token = default)
		{
			//Arrange
			var game0 = new InkBallGame
			{
				//iId = 1,
				CreateTime = DateTime.Now,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				Player1 = new InkBallPlayer
				{
					//iId = 1,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 1,
						UserName = "test_p1",
						iPrivileges = 0,
						sExternalId = "xxxxx",
					}
				},
				Player2 = new InkBallPlayer
				{
					//iId = 2,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 2,
						UserName = "test_p2",
						iPrivileges = 0,
						sExternalId = "yyyyy",
					}
				}
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
						Status = InkBallPoint.StatusEnum.POINT_IN_PATH,
						iEnclosingPathId = null,
						Player = game0.Player1
					});
				}

				var db_path = new InkBallPath
				{
					Game = game0,
					Player = is_player_turn ? game0.Player1 : game0.Player2
				};
				int order = 1;
				var path_vm = new InkBallPathViewModel
				{
					PointsAsString = parameters.expectedCoords
				};
				path_vm.InkBallPoint.ToList().ForEach((p) =>
				{
					var pip = new InkBallPointsInPath
					{
						Path = db_path,
						Point = new InkBallPoint
						{
							iX = p.iX,
							iY = p.iY,
							Player = db_path.Player,
							Game = db_path.Game
						},
						Order = order++
					};
					db_path.InkBallPointsInPath.Add(pip);
				});
				db_path.PointsAsString = JsonConvert.SerializeObject(path_vm);

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
				CreateTime = DateTime.Now,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				Player1 = new InkBallPlayer
				{
					//iId = 1,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 1,
						UserName = "test",
						iPrivileges = 0,
						sExternalId = "xxxxx",
					}
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
				var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);
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
				var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);

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
					var games = await context.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);

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

		#region SignalR tests

		Mock<HubCallerContext> GetMockHubCallerContext(int gameID, int playerID, int userID, string externalUserIdentifier)
		{
			var httpContextMock = new Moq.Mock<HttpContext>();
			var moqRequest = new Mock<HttpRequest>();

			var headers = new HeaderDictionary();
			headers.Add(HeaderNames.Authorization, $"Bearer iGameID={gameID}&iPlayerID={playerID}");
			moqRequest.SetupGet(r => r.Headers).Returns(headers);
			httpContextMock.SetupGet(x => x.Request).Returns(moqRequest.Object);

			CancellationToken token = default;
			httpContextMock.SetupProperty(r => r.RequestAborted, token).SetReturnsDefault(token);

			var items = new Dictionary<object, object>();
			var features = new FeatureCollection();
			var mockIHttpContextFeature = new Mock<IHttpContextFeature>();
			mockIHttpContextFeature.SetupGet(i => i.HttpContext).Returns(httpContextMock.Object);
			features.Set(mockIHttpContextFeature.Object);

			var mockHubCallerContext = new Mock<HubCallerContext>();
			mockHubCallerContext.SetupGet(foo => foo.ConnectionAborted).Returns(default(CancellationToken));
			mockHubCallerContext.SetupGet(foo => foo.UserIdentifier).Returns(externalUserIdentifier);
			mockHubCallerContext.SetupGet(foo => foo.Items).Returns(items);
			mockHubCallerContext.SetupGet(foo => foo.User).Returns(
				new ClaimsPrincipal(new[] { new ClaimsIdentity(new [] {
						new Claim(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId), userID.ToString(), nameof(InkBall.Module.Model.InkBallUser)) }) }));
			mockHubCallerContext.Setup(foo => foo.Features).Returns(features);

			return mockHubCallerContext;
		}

		[Fact]
		public async Task SignalR_ClientToServer_SimpleTests()
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerContext = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);


				var hub = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext.Object
				};

				//Act
				await hub.OnConnectedAsync();

				await hub.ClientToServerPing(new PingCommand("I like motorcycles"));

				await hub.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 7,
					iY = 7,
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					iGameId = 1,
					iPlayerId = 1
				});


				//Assert
				mockHubCallerContext.Verify(clients => clients.Features, Times.Once);

				mockHubCallerClients.Verify(
					client => client.User(It.IsAny<string>()),
					Times.AtLeastOnce);

				mockGameClient.Verify(
					client => client.ServerToClientPing(It.Is<PingCommand>(pc => pc.Message == "I like motorcycles")),
					Times.Once);

				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 7 && p.iY == 7)),
					Times.Once);

				var points_and_paths = await db.LoadPointsAndPathsAsync(1, token);
				Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 7 && p.iY == 7));
			}
		}


		[Fact]
		public async Task SignalR_ClientToServer_ComplexTests()
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerContext = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);


				var hub = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext.Object
				};

				//Act
				await hub.OnConnectedAsync();

				var exception = await Assert.ThrowsAsync<ArgumentException>(async () => {
					await hub.ClientToServerPoint(new InkBallPointViewModel
					{
						iX = 8,
						iY = 8,
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
						iGameId = 1,
						iPlayerId = 2
					});
				});

				//Assert
				Assert.Equal("not your turn", exception.Message);				
				mockHubCallerContext.Verify(clients => clients.Features, Times.AtLeastOnce);

				// mockHubCallerClients.Verify(
				// 	client => client.User(It.IsAny<string>()),
				// 	Times.AtLeastOnce);

				// mockGameClient.Verify(
				// 	client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 8 && p.iY == 8)),
				// 	Times.Once);

				// var points_and_paths = await db.LoadPointsAndPathsAsync(1, token);
				// Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 8 && p.iY == 8));
			}
		}

		#endregion SignalR tests
	}
}
