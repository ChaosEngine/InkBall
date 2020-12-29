using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace InkBall.Tests
{
	public class SignalRTests : DbContextTests
	{
		#region Helpers

		private sealed class TempPoint : List<int>
		{
			[JsonIgnore]
			public int iX => base[0];

			[JsonIgnore]
			public int iY => base[1];

			[JsonIgnore]
			public int Status => base[2];

			[JsonIgnore]
			public int iPlayerId => base[3];

			public TempPoint() : base() { }

			public TempPoint(int x, int y) : base()
			{
				base.Add(x); base.Add(y);
			}

			public override bool Equals(object obj)
			{
				var other = (TempPoint)obj;
				return iX == other.iX && iY == other.iY;
			}

			public override int GetHashCode()
			{
				return (iY << 9) ^ iX;
			}
		}

		#endregion Helpers

		public SignalRTests() : base()
		{
		}

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
						new Claim(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId), userID.ToString(), nameof(InkBall.Module.Model.InkBallUser)),
						new Claim("role", "InkBallViewOtherPlayerGames")
				}) }));
			mockHubCallerContext.Setup(foo => foo.Features).Returns(features);

			return mockHubCallerContext;
		}

		async Task SetAllPoints(GameHub p1, GameHub p2, IEnumerable<int[]> points)
		{
			foreach (int[] arr in points)
			{
				int x = arr[0], y = arr[1], int_status = arr[2], playerId = arr[3];
				var status = (InkBallPoint.StatusEnum)int_status;

				var point = new InkBallPointViewModel
				{
					//Game = game,
					iGameId = p1.ThisGame.iId,
					iPlayerId = playerId,
					iX = x,
					iY = y,
					Status = status,
				};

				if (p1.ThisPlayerID == playerId)
				{
					point.Status = InkBallPoint.StatusEnum.POINT_FREE_RED;
					await p1.ClientToServerPoint(point);
				}
				else
				{
					point.Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE;
					await p2.ClientToServerPoint(point);
				}
			}
		}

		async Task SetAllPaths2(GameHub p1, GameHub p2, IEnumerable<InkBallPathViewModel> allPaths)
		{
			var allowed_time_limit_datetime = DateTime.Now.Subtract(TimeSpan.FromSeconds(0.5));
			foreach (InkBallPathViewModel path in allPaths)
			{
				if (p1.ThisPlayerID == path.iPlayerId)
				{
					p1.ThisPlayer.TimeStamp = allowed_time_limit_datetime;
					await p1.ClientToServerPath(path);
				}
				else
				{
					p2.ThisPlayer.TimeStamp = allowed_time_limit_datetime;
					await p2.ClientToServerPath(path);
				}
			}
		}

		[Fact]
		public async Task SignalR_ClientToServer_ValidBehavior()
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token, InkBallGame.GameTypeEnum.FIRST_5_PATHS);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				await hub_P1.ClientToServerPing(new PingCommand("I like motorcycles"));
				await hub_P1.ClientToServerPing(new PingCommand("Me too"));

				var responded_point_P1 = await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 7,
					iY = 7,
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					iGameId = 1,
					iPlayerId = 1
				});
				var responded_point_P2 = await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 8,
					iY = 8,
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					iGameId = 1,
					iPlayerId = 2
				});


				//Assert
				Assert.NotNull(responded_point_P1.TimeStamp);
				Assert.NotNull(responded_point_P2.TimeStamp);
				mockHubCallerContext_P1.Verify(clients => clients.Features, Times.Once);
				mockHubCallerContext_P2.Verify(clients => clients.Features, Times.Once);

				mockHubCallerClients.Verify(
					client => client.User(It.IsAny<string>()),
					Times.AtLeastOnce);

				mockGameClient.Verify(
					client => client.ServerToClientPing(It.Is<PingCommand>(pc => pc.Message == "I like motorcycles")),
					Times.Once);
				mockGameClient.Verify(
					client => client.ServerToClientPing(It.Is<PingCommand>(pc => pc.Message == "Me too")),
					Times.Once);

				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 7 && p.iY == 7 && p.TimeStamp != null)),
					Times.Once);
				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 8 && p.iY == 8 && p.TimeStamp != null)),
					Times.Once);

				var points_and_paths = await db.LoadPointsAndPathsAsync(1, token);
				Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 7 && p.iY == 7));
				Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 8 && p.iY == 8));




				//path comprising points
				var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };
				var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };
				//owned points
				var p1_owned = new int[1, 2] { { 8, 25 } };
				var p2_owned = new int[1, 2] { { 12, 25 } };

				for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
				{
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						iX = p1_pts[i, 0],
						iY = p1_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					});
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						iX = p2_pts[i, 0],
						iY = p2_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					});
				}
				var pt = await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					iX = p2_owned[0, 0],
					iY = p2_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
				});
				Assert.NotNull(pt.TimeStamp);
				pt = await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					iX = p1_owned[0, 0],
					iY = p1_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				});
				Assert.NotNull(pt.TimeStamp);

				//Assert
				var dto = await hub_P1.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					PointsAsString = "8,24 9,25 8,26 7,25 8,24",
					OwnedPointsAsString = "8,25"
				});
				Assert.IsType<InkBallPathViewModel>(dto);
				Assert.NotNull(((InkBallPathViewModel)dto).TimeStamp);
				dto = await hub_P2.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					PointsAsString = "12,24 13,25 12,26 11,25 12,24",
					OwnedPointsAsString = "12,25"
				});
				Assert.IsType<InkBallPathViewModel>(dto);
				Assert.NotNull(((InkBallPathViewModel)dto).TimeStamp);
			}
		}

		[Fact]
		public async Task SignalR_EFCore3_MultipleInsertsOfSamePoint()
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token, InkBallGame.GameTypeEnum.FIRST_5_PATHS);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				int count0 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				var responded_point_P1 = await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 7,
					iY = 7,
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					iGameId = 1,
					iPlayerId = 1
				});
				int count1 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count0 + 1, count1);
				var responded_point_P2 = await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 8,
					iY = 8,
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					iGameId = 1,
					iPlayerId = 2
				});
				int count2 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count1 + 1, count2);


				//Assert
				Assert.NotNull(responded_point_P1.TimeStamp);
				Assert.NotNull(responded_point_P2.TimeStamp);
				mockHubCallerContext_P1.Verify(clients => clients.Features, Times.Once);
				mockHubCallerContext_P2.Verify(clients => clients.Features, Times.Once);

				mockHubCallerClients.Verify(
					client => client.User(It.IsAny<string>()),
					Times.AtLeastOnce);

				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 7 && p.iY == 7 && p.TimeStamp != null)),
					Times.Once);
				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 8 && p.iY == 8 && p.TimeStamp != null)),
					Times.Once);

				var points_and_paths = await db.LoadPointsAndPathsAsync(1, token);
				Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 7 && p.iY == 7));
				Assert.NotNull(points_and_paths.Points.FirstOrDefault(p => p.iX == 8 && p.iY == 8));




				//path comprising points
				var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };
				var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };
				//owned points
				var p1_owned = new int[1, 2] { { 8, 25 } };
				var p2_owned = new int[1, 2] { { 12, 25 } };

				for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
				{
					count0 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						iX = p1_pts[i, 0],
						iY = p1_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					});
					count1 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
					Assert.Equal(count0 + 1, count1);
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						iX = p2_pts[i, 0],
						iY = p2_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					});
					count2 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
					Assert.Equal(count1 + 1, count2);
				}
				int count3 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					iX = p2_owned[0, 0],
					iY = p2_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
				});
				int count4 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count3 + 1, count4);
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					iX = p1_owned[0, 0],
					iY = p1_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				});

				int count5 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count4 + 1, count5);

				//Assert
				await hub_P1.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					PointsAsString = "8,24 9,25 8,26 7,25 8,24",
					OwnedPointsAsString = "8,25"
				});
				int count6 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count5, count6);
				await hub_P2.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					PointsAsString = "12,24 13,25 12,26 11,25 12,24",
					OwnedPointsAsString = "12,25"
				});
				int count7 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count6, count7);
			}
		}

		[Fact]
		public async Task SignalR_ClientToServer_InvalidBehavior()
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token, InkBallGame.GameTypeEnum.FIRST_5_PATHS);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				//corect player context
				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				//wrong player context
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				//Assert
				var exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
				{
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iX = 8,
						iY = 8,
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
						iGameId = 1,
						iPlayerId = 2
					});
				});
				Assert.StartsWith("not your turn", exception.Message);

				exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
				{
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iX = 1,
						iY = 1,
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
						iGameId = 1,
						iPlayerId = 1
					});
				});
				Assert.Equal("point already placed (1,1)", exception.Message);


				mockHubCallerContext_P1.Verify(clients => clients.Features, Times.AtLeastOnce);
				mockHubCallerContext_P2.Verify(clients => clients.Features, Times.AtLeastOnce);

				exception = await Assert.ThrowsAsync<ArgumentOutOfRangeException>(async () =>
				{
					await hub_P1.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						PointsAsString = "80,24 26,25 33,67 55,40 80,24",
						OwnedPointsAsString = "100,100"
					});
				});
				Assert.Contains("points are not stacked one after the other", exception.Message);

				exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
				{
					await hub_P1.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						PointsAsString = "80,24 26,25 33,67 foo 55,40 bar, 80,24",
						OwnedPointsAsString = "100,100"
					});
				});
				Assert.Contains("bad characters in path", exception.Message);

				exception = await Assert.ThrowsAsync<ArgumentException>(async () =>
				{
					//path comprising points
					var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };
					var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };
					//owned points
					var p1_owned = new int[1, 2] { { 8, 25 } };
					var p2_owned = new int[1, 2] { { 12, 25 } };

					for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
					{
						await hub_P1.ClientToServerPoint(new InkBallPointViewModel
						{
							iGameId = 1,
							iPlayerId = 1,
							iX = p1_pts[i, 0],
							iY = p1_pts[i, 1],
							Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
						});
						await hub_P2.ClientToServerPoint(new InkBallPointViewModel
						{
							iGameId = 1,
							iPlayerId = 2,
							iX = p2_pts[i, 0],
							iY = p2_pts[i, 1],
							Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
						});
					}
					await hub_P1.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						PointsAsString = "8,24 9,25 8,26 7,25 8,24",
						OwnedPointsAsString = "8,bad is bad25"
					});
					//failing test
				});
				Assert.Contains("bad characters in path", exception.Message);
			}
		}

		[Fact]
		public async Task SignalR_ClientToServer_WinSituationDetection()
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

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				//path comprising points
				var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };
				var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };
				//owned points
				var p1_owned = new int[1, 2] { { 8, 25 } };
				var p2_owned = new int[1, 2] { { 12, 25 } };

				for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
				{
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						iX = p1_pts[i, 0],
						iY = p1_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					});
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						iX = p2_pts[i, 0],
						iY = p2_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					});
				}
				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					iX = p2_owned[0, 0],
					iY = p2_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
				});
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					iX = p1_owned[0, 0],
					iY = p1_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				});

				//Assert
				var winMessagesgStatus = await hub_P1.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					PointsAsString = "8,24 9,25 8,26 7,25 8,24",
					OwnedPointsAsString = "8,25"
				});
				Assert.IsType<WinCommand>(winMessagesgStatus);
				Assert.Equal(InkBallGame.WinStatusEnum.RED_WINS, ((WinCommand)winMessagesgStatus).Status);
				Assert.Equal(1, ((WinCommand)winMessagesgStatus).WinningPlayerId);


				var exception = await Assert.ThrowsAsync<NoGameArgumentNullException>(async () =>
				{
					await hub_P2.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						PointsAsString = "12,24 13,25 12,26 11,25 12,24",
						OwnedPointsAsString = "12,25"
					});

				});
				Assert.Equal("game == null (Parameter 'dbGame')", exception.Message);
			}
		}


		[Fact]
		public async Task SignalR_ClientDisconnect()
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
				mockGameClient.Setup(c => c.ServerToClientOtherPlayerDisconnected(It.IsAny<string>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				//Assert
				mockGameClient.Verify(client => client.ServerToClientOtherPlayerConnected(It.Is<string>(msg =>
				   msg == $"Other player {hub_P1.ThisPlayer.User.UserName} connected 😁"
				   )), Times.Once);

				//Act 
				await hub_P1.OnDisconnectedAsync(null);
				//Assert
				mockGameClient.Verify(client => client.ServerToClientOtherPlayerDisconnected(It.Is<string>(msg =>
				   msg == $"Other player {hub_P1.ThisPlayer.User.UserName} disconnected 😢"
				   )), Times.Once);

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnDisconnectedAsync(null);
				//Assert
				mockGameClient.Verify(client => client.ServerToClientOtherPlayerDisconnected(It.Is<string>(msg =>
				   msg == $"Other player {hub_P2.ThisPlayer.User.UserName} disconnected 😢"
				   )), Times.Once);
			}
		}

		[Fact]
		public async Task SignalR_ClientToServer_PlayerJoin()
		{
			//Arrange
			var token = base.CancellationToken;

			//Start from creating a user
			//Arrange
			await CreateInitialUsers(new[] { "xxxxx", "yyyyy" }, null, token);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				//Create game for user and assume everything is ready, player, connecting structures, order of moves etc.
				//Arrange
				//Act
				var new_game = await db.CreateNewGameFromExternalUserIDAsync("xxxxx",
					InkBallGame.GameTypeEnum.FIRST_CAPTURE, 16, 20, 26, false, token);
				//Assert
				Assert.NotNull(new_game);
				Assert.NotNull(new_game.Player1);
				Assert.NotNull(new_game.Player1.User);
				Assert.Equal("xxxxx", new_game.Player1.User.sExternalId);

				//Get active games for ALL the users and check if there is game for our user
				//Act
				IEnumerable<InkBallGame> games_from_db = await db.GetGamesForRegistrationAsSelectTableRowsAsync(/*null, null, null, true, */token);
				//Assert
				Assert.NotNull(games_from_db);
				Assert.NotEmpty(games_from_db);
				Assert.NotNull(games_from_db.FirstOrDefault(p => p.Player1?.User.sExternalId == "xxxxx"));
				Assert.NotNull(games_from_db.First().GetPlayer());
				Assert.Equal("xxxxx", games_from_db.First().GetPlayer().User.sExternalId);
				Assert.True(games_from_db.First().IsThisPlayerActive());
				Assert.Equal(InkBallGame.GameStateEnum.AWAITING, games_from_db.First().GameState);
				Assert.True(games_from_db.First().iId > 0);



				//SignalR part
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};

				//Assue all structures (game, user, player, connections, order of moves etc.) are ready and waiting for our user/playee
				//Act
				//Assert
				await hub_P1.OnConnectedAsync();

				//Prepare for player JOIN action
				//Act
				var game_2_join = await db.GetGameFromDatabaseAsync(games_from_db.First().iId, false, token);

				//Assert
				Assert.NotNull(game_2_join);
				Assert.NotNull(game_2_join.Player1);
				Assert.Null(game_2_join.Player2);

				//Join P2 player
				//Act
				await db.JoinGameFromExternalUserIdAsync(new_game, "yyyyy", token);

				//Act
				game_2_join = await db.GetGameFromDatabaseAsync(games_from_db.First().iId, false, token);
				//Assert
				Assert.NotNull(game_2_join);
				Assert.NotNull(game_2_join.Player2);
				Assert.NotNull(game_2_join.Player2.User);
				Assert.NotNull(game_2_join.GetOtherPlayer());
				Assert.NotNull(game_2_join.GetOtherPlayer().User.sExternalId);
				Assert.Equal("yyyyy", game_2_join.Player2.User.sExternalId);
				Assert.Equal(InkBallGame.GameStateEnum.ACTIVE, game_2_join.GameState);


				//Arrange
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Sign in as P2 of this game and ensure all is ready for the game
				//Act
				//Assert
				await hub_P1.OnConnectedAsync();

				//Notify P1 that P2 is joining
				await hub_P2.Clients.User(game_2_join.GetOtherPlayer().User.sExternalId).ServerToClientPlayerJoin(
					new PlayerJoiningCommand(game_2_join.GetOtherPlayer().iId,
					game_2_join.GetPlayer().User.UserName,
					$"Player {game_2_join.GetPlayer().User.UserName ?? ""} joining"));

				//Assert
				mockGameClient.Verify(client => client.ServerToClientPlayerJoin(It.Is<PlayerJoiningCommand>(pjc =>
				   pjc.Message == "Player test_p1 joining"
				   && (pjc.OtherPlayerId == 1 || pjc.OtherPlayerId == 2)
				   && pjc.OtherPlayerName == "test_p1"
				   )), Times.Once);
			}
		}

		[Theory]
		[InlineData(false)]
		[InlineData(true)]
		public async Task SignalR_GetPlayerPointsAndPaths(bool viewOnly)
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token, InkBallGame.GameTypeEnum.FIRST_5_PATHS);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				//path comprising points
				var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };//red
				var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };//blue

				//owned points
				var p1_owned = new int[1, 2] { { 8, 25 } };//owned by blue
				var p2_owned = new int[1, 2] { { 12, 25 } };//owned by red

				for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
				{
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						iX = p1_pts[i, 0],
						iY = p1_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					});
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						iX = p2_pts[i, 0],
						iY = p2_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					});
				}
				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					iX = p2_owned[0, 0],
					iY = p2_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
				});
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					iX = p1_owned[0, 0],
					iY = p1_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				});

				//Assert
				await hub_P1.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					PointsAsString = "8,24 9,25 8,26 7,25 8,24",
					OwnedPointsAsString = "8,25"
				});
				await hub_P2.ClientToServerPath(new InkBallPathViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					PointsAsString = "12,24 13,25 12,26 11,25 12,24",
					OwnedPointsAsString = "12,25"
				});

				//Act
				var dto = await hub_P1.GetPlayerPointsAndPaths(viewOnly, 1);
				//Assert
				Assert.NotNull(dto);
				Assert.NotNull(dto.Points);
				Assert.NotNull(dto.Paths);

				//Assert
				TempPoint[] json_points = JsonSerializer.Deserialize<TempPoint[]>(dto.Points);
				InkBallPathViewModel[] json_paths = JsonSerializer.Deserialize<InkBallPathViewModel[]>(dto.Paths);
				Assert.NotNull(json_points);
				Assert.NotNull(json_paths);
				Assert.True(json_points.All(pt =>
					CommonPoint.UnDataMinimizerPlayerId(pt.iPlayerId) == 1 || CommonPoint.UnDataMinimizerPlayerId(pt.iPlayerId) == 2));
				Assert.True(json_paths.All(pa => /*pa.iGameId == 1 &&*/ (pa.iPlayerId == 1 || pa.iPlayerId == 2)));

				//Assert
				Assert.All(Enumerable.Range(0, p1_pts.GetLength(0)), (rank) =>
				{
					Assert.Single(json_points, q => CommonPoint.UnDataMinimizerPlayerId(q.iPlayerId) == 1 &&
						q.iX == p1_pts[rank, 0] && q.iY == p1_pts[rank, 1]);
					Assert.Single(json_points, q => CommonPoint.UnDataMinimizerPlayerId(q.iPlayerId) == 2 &&
						q.iX == p2_pts[rank, 0] && q.iY == p2_pts[rank, 1]);
				});
				Assert.NotEmpty(json_points.Where(pt => Enum.IsDefined(typeof(InkBallPoint.StatusEnum), pt.Status) == false));
				Assert.All(json_points, pt =>
				{
					Assert.True(Enum.IsDefined(typeof(InkBallPoint.StatusEnum), CommonPoint.UnDataMinimizerStatus(pt.Status)));
				});
				Assert.NotEmpty(json_points.Where(pt =>
					CommonPoint.UnDataMinimizerStatus(pt.Status) == 2 || CommonPoint.UnDataMinimizerStatus(pt.Status) == 3));

				//Assert
				Assert.Single(json_paths, q => q.iPlayerId == 1 &&// q.iGameId == 1 &&

					q.PointsAsString == Enumerable.Range(0, p1_pts.GetLength(0))
					.Select(rank => $"{p1_pts[rank, 0]},{p1_pts[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}") &&

					q.OwnedPointsAsString == Enumerable.Range(0, p1_owned.GetLength(0))
					.Select(rank => $"{p1_owned[rank, 0]},{p1_owned[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}")
				);
				Assert.Single(json_paths, q => q.iPlayerId == 2 &&// q.iGameId == 1 &&

					q.PointsAsString == Enumerable.Range(0, p2_pts.GetLength(0))
					.Select(rank => $"{p2_pts[rank, 0]},{p2_pts[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}") &&

					q.OwnedPointsAsString == Enumerable.Range(0, p2_owned.GetLength(0))
					.Select(rank => $"{p2_owned[rank, 0]},{p2_owned[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}")
				);

				//Act
				var points_n_paths = await db.LoadPointsAndPathsAsync(1, token);

				var json_points1 = JsonSerializer.Serialize(JsonSerializer.Deserialize<TempPoint[]>(
					CommonPoint.GetPointsAsJavaScriptArrayForPage(points_n_paths.Points),
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, IgnoreNullValues = true, AllowTrailingCommas = true }),
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, IgnoreNullValues = true, AllowTrailingCommas = true });

				var json_paths1 = JsonSerializer.Serialize(JsonSerializer.Deserialize<InkBallPathViewModel[]>(
					InkBallPath.GetPathsAsJavaScriptArrayForPage(points_n_paths.Paths),
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault, AllowTrailingCommas = true }),
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault, AllowTrailingCommas = true });

				//Assert
				Assert.Equal(dto.Points, json_points1);
				Assert.Equal(dto.Paths.Replace("\r", ""), json_paths1.Replace("\r", ""));
			}
		}

		[Theory]
		[InlineData(false, null)]
		[InlineData(true, 2 * InkBall.Module.Constants.PathAfterPointDrawAllowanceSecAmount)]
		[InlineData(false, 0.5 * InkBall.Module.Constants.PathAfterPointDrawAllowanceSecAmount)]
		public async Task SignalR_ClientToServer_OnStopAndDraw_PossibleTooLate(bool isDelayed, double? delayTimeInSecs)
		{
			//Arrange
			var token = base.CancellationToken;

			await CreateComplexGameHierarchy(token, InkBallGame.GameTypeEnum.FIRST_5_PATHS);

			using (var db = new GamesContext(Setup.DbOpts))
			{
				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(gameID: 1, playerID: 1, userID: 1, externalUserIdentifier: "xxxxx");
				var mockHubCallerContext_P2 = GetMockHubCallerContext(gameID: 1, playerID: 2, userID: 2, externalUserIdentifier: "yyyyy");

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();



				//Act
				//path comprising points
				var p1_pts = new int[5, 2] { { 8, 24 }, { 9, 25 }, { 8, 26 }, { 7, 25 }, { 8, 24 } };
				var p2_pts = new int[5, 2] { { 12, 24 }, { 13, 25 }, { 12, 26 }, { 11, 25 }, { 12, 24 } };
				//owned points
				var p1_owned = new int[1, 2] { { 8, 25 } };
				var p2_owned = new int[1, 2] { { 12, 25 } };

				for (int i = p1_pts.GetLength(0) - 2; i >= 0; i--)
				{
					await hub_P1.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 1,
						iX = p1_pts[i, 0],
						iY = p1_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					});
					hub_P1.ThisPlayer.TimeStamp = DateTime.Now.Subtract(TimeSpan.FromSeconds(delayTimeInSecs.GetValueOrDefault(0)));
					await hub_P2.ClientToServerPoint(new InkBallPointViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						iX = p2_pts[i, 0],
						iY = p2_pts[i, 1],
						Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					});
					hub_P2.ThisPlayer.TimeStamp = DateTime.Now.Subtract(TimeSpan.FromSeconds(delayTimeInSecs.GetValueOrDefault(0)));
				}
				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 1,
					iX = p2_owned[0, 0],
					iY = p2_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
				});
				hub_P1.ThisPlayer.TimeStamp = DateTime.Now.Subtract(TimeSpan.FromSeconds(delayTimeInSecs.GetValueOrDefault(0)));
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iGameId = 1,
					iPlayerId = 2,
					iX = p1_owned[0, 0],
					iY = p1_owned[0, 1],
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
				});
				hub_P2.ThisPlayer.TimeStamp = DateTime.Now.Subtract(TimeSpan.FromSeconds(delayTimeInSecs.GetValueOrDefault(0)));


				//Assert
				var exception = await Record.ExceptionAsync(async () =>
				{
					await hub_P2.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						PointsAsString = "12,24 13,25 12,26 11,25 12,24",
						OwnedPointsAsString = "12,25"
					});
					//hub_P2.ThisPlayer.TimeStamp = DateTime.Now.Subtract(TimeSpan.FromSeconds(delayTimeInSecs.GetValueOrDefault(0)));
				});
				if (isDelayed)
				{
					Assert.NotNull(exception);
					Assert.IsType<ArgumentException>(exception);
					Assert.Equal("not your turn", exception.Message);
				}
			}
		}

		[Theory]
		[InlineData(false, false)]
		[InlineData(true, false)]
		[InlineData(false, true)]
		[InlineData(true, true)]
		public async Task SignalR_ClientToServer_AdjacentPaths_Interleaved(bool properlyInterleavedPoints, bool properlyInterleavedPaths)
		{
			//Arrange
			var token = base.CancellationToken;
			var game = new InkBallGame
			{
				iId = 35,
				CreateTime = DateTime.Now,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				GameType = InkBallGame.GameTypeEnum.FIRST_5_ADVANTAGE_PATHS,
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
					iId = 3,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						//iId = 3,
						UserName = "test_p2",
						iPrivileges = 0,
						sExternalId = "yyyyy",
					}
				},
				iPlayer2Id = 3,
				iBoardWidth = 40,
				iBoardHeight = 52
			};
			using (var db = new GamesContext(Setup.DbOpts))
			{
				await db.AddAsync(game, token);
				await db.SaveChangesAsync(token);



				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(
					gameID: game.iId,
					playerID: game.Player1.iId,
					userID: game.Player1.iUserId.GetValueOrDefault(0),
					externalUserIdentifier: game.Player1.User.sExternalId);
				var mockHubCallerContext_P2 = GetMockHubCallerContext(
					gameID: game.iId,
					playerID: game.Player2.iId,
					userID: game.Player2.iUserId.GetValueOrDefault(0),
					externalUserIdentifier: game.Player2.User.sExternalId);

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();


				//Act
				if (!properlyInterleavedPoints)
				{
					var exception = await Record.ExceptionAsync(async () =>
					{
						await SetAllPoints(hub_P1, hub_P2, new int[][] {
							new int[]{24, 8, 3, 1},
							new int[]{12, 8, 2, 3},
							new int[]{12, 9, 1, 1},
							new int[]{23, 8, 1, 3},
							new int[]{12, 7, 1, 1},
							new int[]{25, 8, 1, 3},
							new int[]{11, 8, 1, 1},
							new int[]{24, 7, 1, 3},
							new int[]{13, 8, 1, 1},
							new int[]{24, 9, 1, 3},
							new int[]{14, 9, 1, 1},
							new int[]{13, 9, 2, 3},
							new int[]{13, 10, 1, 1},
							new int[]{22, 9, 1, 3},
							new int[]{23, 9, 3, 1},
							new int[]{24, 10, 1, 3},
							new int[]{14, 10, 1, 1},
							new int[]{23, 10, 1, 3},
							new int[]{11, 10, 1, 1},
							new int[]{25, 10, 1, 3},
							new int[]{12, 11, 1, 1},
							new int[]{26, 9, 1, 3},
							new int[]{10, 9, 1, 1},
							new int[]{23, 11, 1, 3},
							new int[]{24, 11, 3, 1},
							new int[]{12, 10, 2, 3},
							new int[]{25, 9, 3, 1},
							new int[]{24, 12, 1, 3},
							new int[]{13, 11, 1, 1},
							new int[]{25, 11, 1, 3},//player 2
							new int[]{21, 11, 1, 3},//player 2 after player 2 move!! should be player 1
							new int[]{22, 10, 3, 1},
							new int[]{21, 10, 1, 3},
							new int[]{22, 11, 3, 1},
							new int[]{11, 9, 2, 3},
							new int[]{10, 8, 1, 1},
							new int[]{22, 12, 1, 3},//player 2
							new int[]{11, 7, 2, 3},//player 2 after player 2!! should be player 1
							new int[]{25, 7, 3, 1},
							new int[]{25, 6, 1, 3},
							new int[]{10, 7, 1, 1},
							new int[]{26, 7, 1, 3},
							new int[]{11, 6, 1, 1},
							new int[]{26, 8, 1, 3},
							new int[]{12, 6, 1, 1},
							new int[]{16, 13, -3, 1},
							new int[]{20, 7, -2, 3},
							new int[]{17, 15, -3, 1},
							new int[]{22, 13, 1, 3},
							new int[]{14, 7, 1, 1},
							new int[]{23, 13, 1, 3},
							new int[]{13, 6, 1, 1},
							new int[]{13, 7, 2, 3},
							new int[]{23, 12, 3, 1}
						});
					});
					Assert.NotNull(exception);
					Assert.IsType<ArgumentException>(exception);
					Assert.StartsWith("not your turn", exception.Message);

					return;//we must exit 'coz there are no points added for proper path adding
				}
				else
				{
					await SetAllPoints(hub_P1, hub_P2, new int[][] {
						new int[]{24, 8, 3, 1},//p1
						new int[]{12, 8, 2, 3},//p2
						new int[]{12, 9, 1, 1},//p1
						new int[]{23, 8, 1, 3},//p2
						new int[]{12, 7, 1, 1},//p1
						new int[]{25, 8, 1, 3},//p2
						new int[]{11, 8, 1, 1},//p1
						new int[]{24, 7, 1, 3},//p2
						new int[]{13, 8, 1, 1},//p1
						new int[]{24, 9, 1, 3},//p2
						new int[]{14, 9, 1, 1},//p1
						new int[]{13, 9, 2, 3},//p2
						new int[]{13, 10, 1, 1},//p1
						new int[]{22, 9, 1, 3},//p2
						new int[]{23, 9, 3, 1},//p1
						new int[]{24, 10, 1, 3},//p2
						new int[]{14, 10, 1, 1},//p1
						new int[]{23, 10, 1, 3},//p2
						new int[]{11, 10, 1, 1},//p1
						new int[]{25, 10, 1, 3},//p2
						new int[]{12, 11, 1, 1},//p1
						new int[]{26, 9, 1, 3},//p2
						new int[]{10, 9, 1, 1},//p1
						new int[]{23, 11, 1, 3},//p2
						new int[]{24, 11, 3, 1},//p1
						new int[]{12, 10, 2, 3},//p2
						new int[]{25, 9, 3, 1},//p1
						new int[]{24, 12, 1, 3},//p2
						new int[]{13, 11, 1, 1},//p1
						new int[]{25, 11, 1, 3},//p2
						new int[]{22, 10, 3, 1},//p1
						new int[]{21, 10, 1, 3},//p2
						new int[]{22, 11, 3, 1},//p1
						new int[]{11, 9, 2, 3},//p2
						new int[]{10, 8, 1, 1},//p1
						new int[]{22, 12, 1, 3},//p2
						new int[]{25, 7, 3, 1},//p1
						new int[]{25, 6, 1, 3},//p2
						new int[]{10, 7, 1, 1},//p1
						new int[]{26, 7, 1, 3},//p2
						new int[]{11, 6, 1, 1},//p1
						new int[]{26, 8, 1, 3},//p2
						new int[]{12, 6, 1, 1},//p1
						new int[]{20, 7, -2, 3},//p2
						new int[]{17, 15, -3, 1},//p1
						new int[]{22, 13, 1, 3},//p2
						new int[]{14, 7, 1, 1},//p1
						new int[]{23, 13, 1, 3},//p2
						new int[]{13, 6, 1, 1},//p1
						new int[]{13, 7, 2, 3},//p2
						new int[]{23, 12, 3, 1},//p1
						new int[]{21, 11, 1, 3},//p2
						new int[]{16, 13, -3, 1},//p1
						new int[]{11, 7, 2, 3},//p2
					});

					//we continue to paths testing
				}
				if (!properlyInterleavedPaths)
				{
					var exception = await Record.ExceptionAsync(async () =>
					{
						await SetAllPaths2(hub_P1, hub_P2, new InkBallPathViewModel[] {
new InkBallPathViewModel{ iId = 75, iGameId = 35, iPlayerId = 1, PointsAsString = "13,8 12,9 11,8 12,7 13,8", OwnedPointsAsString = "12,8"},
new InkBallPathViewModel{ iId = 76, iGameId = 35, iPlayerId = 3, PointsAsString = "24,7 23,8 24,9 25,8 24,7", OwnedPointsAsString = "24,8"},
new InkBallPathViewModel{ iId = 77, iGameId = 35, iPlayerId = 1, PointsAsString = "14,9 14,10 13,10 12,9 11,8 12,7 13,8 14,9", OwnedPointsAsString = "13,9"},
new InkBallPathViewModel{ iId = 78, iGameId = 35, iPlayerId = 3, PointsAsString = "22,9 23,10 24,10 24,9 25,8 24,7 23,8 22,9", OwnedPointsAsString = "23,9"},
//player 2 path after player 2 path. Should be point (not too late!) or player 1 path only
new InkBallPathViewModel{ iId = 79, iGameId = 35, iPlayerId = 3, PointsAsString = "26,9 25,10 25,11 24,12 23,11 23,10 24,10 24,9 25,8 26,9", OwnedPointsAsString = "24,11 25,9"},
new InkBallPathViewModel{ iId = 80, iGameId = 35, iPlayerId = 1, PointsAsString = "11,10 12,11 13,11 14,10 13,10 12,9 11,10", OwnedPointsAsString = "12,10"},
new InkBallPathViewModel{ iId = 81, iGameId = 35, iPlayerId = 3, PointsAsString = "21,10 21,11 22,12 23,11 23,10 22,9 21,10", OwnedPointsAsString = "22,10 22,11"},
new InkBallPathViewModel{ iId = 82, iGameId = 35, iPlayerId = 1, PointsAsString = "10,8 10,9 11,10 12,9 11,8 10,8", OwnedPointsAsString = "11,9"},
//player 1 path after player 1 path. Should be point (not too late!) or player 2 path only
new InkBallPathViewModel{ iId = 83, iGameId = 35, iPlayerId = 1, PointsAsString = "11,6 10,7 10,8 11,8 12,7 12,6 11,6", OwnedPointsAsString = "11,7"},
new InkBallPathViewModel{ iId = 84, iGameId = 35, iPlayerId = 3, PointsAsString = "25,6 26,7 26,8 25,8 24,7 25,6", OwnedPointsAsString = "25,7"},
new InkBallPathViewModel{ iId = 85, iGameId = 35, iPlayerId = 1, PointsAsString = "12,6 13,6 14,7 13,8 12,7 12,6", OwnedPointsAsString = "13,7"},
new InkBallPathViewModel{ iId = 86, iGameId = 35, iPlayerId = 3, PointsAsString = "22,12 22,13 23,13 24,12 23,11 22,12", OwnedPointsAsString = "23,12"}
						});
					});
					Assert.NotNull(exception);
					Assert.IsType<ArgumentException>(exception);
					Assert.StartsWith("not your turn", exception.Message);
				}
				else
				{
					await SetAllPaths2(hub_P1, hub_P2, new InkBallPathViewModel[] {
					//p1
new InkBallPathViewModel{ iId = 75, iGameId = 35, iPlayerId = 1, PointsAsString = "13,8 12,9 11,8 12,7 13,8", OwnedPointsAsString = "12,8"},
					//p2
new InkBallPathViewModel{ iId = 76, iGameId = 35, iPlayerId = 3, PointsAsString = "24,7 23,8 24,9 25,8 24,7", OwnedPointsAsString = "24,8"},
					//p1
new InkBallPathViewModel{ iId = 77, iGameId = 35, iPlayerId = 1, PointsAsString = "14,9 14,10 13,10 12,9 11,8 12,7 13,8 14,9", OwnedPointsAsString = "13,9"},
					//p2
new InkBallPathViewModel{ iId = 78, iGameId = 35, iPlayerId = 3, PointsAsString = "22,9 23,10 24,10 24,9 25,8 24,7 23,8 22,9", OwnedPointsAsString = "23,9"},
					//p1
new InkBallPathViewModel{ iId = 80, iGameId = 35, iPlayerId = 1, PointsAsString = "11,10 12,11 13,11 14,10 13,10 12,9 11,10", OwnedPointsAsString = "12,10"},
					//p2
new InkBallPathViewModel{ iId = 81, iGameId = 35, iPlayerId = 3, PointsAsString = "21,10 21,11 22,12 23,11 23,10 22,9 21,10", OwnedPointsAsString = "22,10 22,11"},
					//p1
new InkBallPathViewModel{ iId = 82, iGameId = 35, iPlayerId = 1, PointsAsString = "10,8 10,9 11,10 12,9 11,8 10,8", OwnedPointsAsString = "11,9"},
					//p2
new InkBallPathViewModel{ iId = 79, iGameId = 35, iPlayerId = 3, PointsAsString = "26,9 25,10 25,11 24,12 23,11 23,10 24,10 24,9 25,8 26,9", OwnedPointsAsString = "24,11 25,9"},
					//p1
new InkBallPathViewModel{ iId = 83, iGameId = 35, iPlayerId = 1, PointsAsString = "11,6 10,7 10,8 11,8 12,7 12,6 11,6", OwnedPointsAsString = "11,7"},
					//p2
new InkBallPathViewModel{ iId = 84, iGameId = 35, iPlayerId = 3, PointsAsString = "25,6 26,7 26,8 25,8 24,7 25,6", OwnedPointsAsString = "25,7"},
					//p1
new InkBallPathViewModel{ iId = 85, iGameId = 35, iPlayerId = 1, PointsAsString = "12,6 13,6 14,7 13,8 12,7 12,6", OwnedPointsAsString = "13,7"},
					//p2
new InkBallPathViewModel{ iId = 86, iGameId = 35, iPlayerId = 3, PointsAsString = "22,12 22,13 23,13 24,12 23,11 22,12", OwnedPointsAsString = "23,12"}
					});
				}
			}//end using
		}//end method


		[Fact]
		public async Task SignalR_ClientToServer_AdjacentPaths_SimpleTest()
		{
			//Arrange
			var token = base.CancellationToken;
			var game = new InkBallGame
			{
				iId = 85,
				CreateTime = DateTime.Now,
				GameState = InkBallGame.GameStateEnum.ACTIVE,
				GameType = InkBallGame.GameTypeEnum.FIRST_5_ADVANTAGE_PATHS,
				Player1 = new InkBallPlayer
				{
					iId = 4,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						iId = 4,
						UserName = "test_p1",
						iPrivileges = 0,
						sExternalId = "xxxxx",
					}
				},
				iPlayer1Id = 4,
				Player2 = new InkBallPlayer
				{
					iId = 1,
					sLastMoveCode = "{}",
					User = new InkBallUser
					{
						iId = 1,
						UserName = "test_p2",
						iPrivileges = 0,
						sExternalId = "yyyyy",
					}
				},
				iPlayer2Id = 1,
				iBoardWidth = 20,
				iBoardHeight = 26
			};
			using (var db = new GamesContext(Setup.DbOpts))
			{
				await db.AddAsync(game, token);
				await db.SaveChangesAsync(token);



				var mockGameClient = new Mock<IGameClient>();
				mockGameClient.Setup(c => c.ServerToClientPath(It.IsAny<InkBallPathViewModel>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPing(It.IsAny<PingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerJoin(It.IsAny<PlayerJoiningCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerSurrender(It.IsAny<PlayerSurrenderingCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPlayerWin(It.IsAny<WinCommand>())).Returns(Task.FromResult(0));
				mockGameClient.Setup(c => c.ServerToClientPoint(It.IsAny<InkBallPointViewModel>())).Returns(Task.FromResult(0));

				var mockHubCallerClients = new Mock<IHubCallerClients<IGameClient>>();
				mockHubCallerClients.Setup(c => c.Client(It.IsAny<string>())).Returns(mockGameClient.Object);
				mockHubCallerClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockGameClient.Object);

				var mockHubCallerContext_P1 = GetMockHubCallerContext(
					gameID: game.iId,
					playerID: game.Player1.iId,
					userID: game.Player1.iUserId.GetValueOrDefault(0),
					externalUserIdentifier: game.Player1.User.sExternalId);
				var mockHubCallerContext_P2 = GetMockHubCallerContext(
					gameID: game.iId,
					playerID: game.Player2.iId,
					userID: game.Player2.iUserId.GetValueOrDefault(0),
					externalUserIdentifier: game.Player2.User.sExternalId);

				using var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				using var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();


				//Act
				await SetAllPoints(hub_P1, hub_P2, new int[][] {
new []{/*id=691*/14/*x*/, 4/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=692*/14/*x*/, 5/*y*/, 2/*val*/, 1/*playerID*/},
new []{/*id=693*/8/*x*/, 4/*y*/, 3/*val*/, 4/*playerID*/},
new []{/*id=694*/8/*x*/, 3/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=695*/14/*x*/, 6/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=696*/8/*x*/, 5/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=697*/13/*x*/, 5/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=698*/7/*x*/, 4/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=699*/15/*x*/, 5/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=700*/9/*x*/, 4/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=701*/11/*x*/, 7/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=702*/11/*x*/, 8/*y*/, 2/*val*/, 1/*playerID*/},
new []{/*id=703*/11/*x*/, 9/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=704*/7/*x*/, 7/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=705*/7/*x*/, 8/*y*/, 3/*val*/, 4/*playerID*/},
new []{/*id=706*/7/*x*/, 9/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=707*/10/*x*/, 8/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=708*/12/*x*/, 8/*y*/, 2/*val*/, 1/*playerID*/},
new []{/*id=709*/12/*x*/, 7/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=710*/6/*x*/, 8/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=711*/12/*x*/, 9/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=712*/8/*x*/, 8/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=713*/13/*x*/, 8/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=715*/6/*x*/, 6/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=716*/6/*x*/, 7/*y*/, 3/*val*/, 4/*playerID*/},
new []{/*id=717*/5/*x*/, 7/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=718*/9/*x*/, 9/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=719*/10/*x*/, 9/*y*/, 2/*val*/, 1/*playerID*/},
new []{/*id=720*/10/*x*/, 10/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=721*/12/*x*/, 10/*y*/, 2/*val*/, 1/*playerID*/},
new []{/*id=722*/5/*x*/, 8/*y*/, 3/*val*/, 4/*playerID*/},
new []{/*id=723*/4/*x*/, 7/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=724*/11/*x*/, 10/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=725*/3/*x*/, 8/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=726*/12/*x*/, 11/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=727*/4/*x*/, 9/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=728*/13/*x*/, 10/*y*/, 1/*val*/, 4/*playerID*/},
new []{/*id=729*/5/*x*/, 9/*y*/, 1/*val*/, 1/*playerID*/},
new []{/*id=714*/4/*x*/, 8/*y*/, 3/*val*/, 4/*playerID*/},
				});

				await SetAllPaths2(hub_P1, hub_P2, new InkBallPathViewModel[] {
/*ID=37*/new InkBallPathViewModel { OwnedPointsAsString = "14,5",iId = 37,iGameId = 85,iPlayerId = 4,PointsAsString = "14,4 15,5 14,6 13,5 14,4"},
/*ID=38*/new InkBallPathViewModel { OwnedPointsAsString = "8,4",iId = 38,iGameId = 85,iPlayerId = 1,PointsAsString = "8,3 9,4 8,5 7,4 8,3"},
/*ID=39*/new InkBallPathViewModel { OwnedPointsAsString = "11,8 12,8",iId = 39,iGameId = 85,iPlayerId = 4,PointsAsString = "11,7 10,8 11,9 12,9 13,8 12,7 11,7"},
/*ID=40*/new InkBallPathViewModel { OwnedPointsAsString = "7,8",iId = 40,iGameId = 85,iPlayerId = 1,PointsAsString = "7,7 6,8 7,9 8,8 7,7"},
/*ID=42*/new InkBallPathViewModel { OwnedPointsAsString = "10,9",iId = 42,iGameId = 85,iPlayerId = 4,PointsAsString = "11,7 10,8 9,9 10,10 11,9 12,9 13,8 12,7 11,7"},
/*ID=41*/new InkBallPathViewModel { OwnedPointsAsString = "6,7",iId = 41,iGameId = 85,iPlayerId = 1,PointsAsString = "6,8 5,7 6,6 7,7 6,8"},
/*ID=43*/new InkBallPathViewModel { OwnedPointsAsString = "12,10",iId = 43,iGameId = 85,iPlayerId = 4,PointsAsString = "12,9 13,10 12,11 11,10 11,9 12,9"},
/*ID=44*/new InkBallPathViewModel { OwnedPointsAsString = "4,8 5,8",iId = 44,iGameId = 85,iPlayerId = 1,PointsAsString = "5,7 4,7 3,8 4,9 5,9 6,8 7,7 6,6 5,7"}
			});

			}//end using
		}//end method

		[Fact]
		public void SignalR_ClientToServer_CPUOponent()
		{
			//TODO: implement this someday :-)
		}

	}//end class
}
