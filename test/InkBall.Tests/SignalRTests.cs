﻿using InkBall.Module.Hubs;
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
			public int iX { get { return base[0]; } }

			[JsonIgnore]
			public int iY { get { return base[1]; } }

			[JsonIgnore]
			public InkBallPoint.StatusEnum Status { get { return (InkBallPoint.StatusEnum)base[2]; } }

			[JsonIgnore] public int iPlayerId { get { return base[3]; } }

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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				await hub_P1.ClientToServerPing(new PingCommand("I like motorcycles"));
				await hub_P1.ClientToServerPing(new PingCommand("Me too"));

				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 7,
					iY = 7,
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					iGameId = 1,
					iPlayerId = 1
				});
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 8,
					iY = 8,
					Status = InkBallPoint.StatusEnum.POINT_FREE_BLUE,
					iGameId = 1,
					iPlayerId = 2
				});


				//Assert
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
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 7 && p.iY == 7)),
					Times.Once);
				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 8 && p.iY == 8)),
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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P2.Object
				};

				//Act
				await hub_P1.OnConnectedAsync();
				await hub_P2.OnConnectedAsync();

				int count0 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				await hub_P1.ClientToServerPoint(new InkBallPointViewModel
				{
					iX = 7,
					iY = 7,
					Status = InkBallPoint.StatusEnum.POINT_FREE_RED,
					iGameId = 1,
					iPlayerId = 1
				});
				int count1 = await db.InkBallPoint.CountAsync(p => p.iGameId == 1, token);
				Assert.Equal(count0 + 1, count1);
				await hub_P2.ClientToServerPoint(new InkBallPointViewModel
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
				mockHubCallerContext_P1.Verify(clients => clients.Features, Times.Once);
				mockHubCallerContext_P2.Verify(clients => clients.Features, Times.Once);

				mockHubCallerClients.Verify(
					client => client.User(It.IsAny<string>()),
					Times.AtLeastOnce);

				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 7 && p.iY == 7)),
					Times.Once);
				mockGameClient.Verify(
					client => client.ServerToClientPoint(It.Is<InkBallPointViewModel>(p => p.iX == 8 && p.iY == 8)),
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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
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
				Assert.Equal("not your turn", exception.Message);

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
				Assert.Equal("point already placed", exception.Message);


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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
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


				var exception = await Assert.ThrowsAsync<NullReferenceException>(async () =>
				{
					await hub_P2.ClientToServerPath(new InkBallPathViewModel
					{
						iGameId = 1,
						iPlayerId = 2,
						PointsAsString = "12,24 13,25 12,26 11,25 12,24",
						OwnedPointsAsString = "12,25"
					});

				});
				Assert.Equal("game == null", exception.Message);
			}
		}

		[Fact]
		public async Task SignalR_ClientToServer_PlayerJoin()
		{
			//Arrange
			var token = base.CancellationToken;

			//Start from creating a user
			//Arrange
			await CreateInitialUsers(token, new[] { "xxxxx", "yyyyy" });

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
				var hub_P1 = new GameHub(db, Setup.Logger)
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
				var hub_P2 = new GameHub(db, Setup.Logger)
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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
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
				Assert.True(json_points.All(pt => pt.iPlayerId == 1 || pt.iPlayerId == 2));
				Assert.True(json_paths.All(pa => pa.iGameId == 1 && (pa.iPlayerId == 1 || pa.iPlayerId == 2)));

				//Assert
				Assert.All(Enumerable.Range(0, p1_pts.GetLength(0)), (rank) =>
				{
					Assert.Single(json_points, q => q.iPlayerId == 1 && q.iX == p1_pts[rank, 0] && q.iY == p1_pts[rank, 1]);
					Assert.Single(json_points, q => q.iPlayerId == 2 && q.iX == p2_pts[rank, 0] && q.iY == p2_pts[rank, 1]);
				});

				//Assert
				Assert.Single(json_paths, q => q.iPlayerId == 1 && q.iGameId == 1 &&

					q.PointsAsString == Enumerable.Range(0, p1_pts.GetLength(0))
					.Select(rank => $"{p1_pts[rank, 0]},{p1_pts[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}") &&

					q.OwnedPointsAsString == Enumerable.Range(0, p1_owned.GetLength(0))
					.Select(rank => $"{p1_owned[rank, 0]},{p1_owned[rank, 1]}")
					.Aggregate((prev, next) => $"{prev} {next}")
				);
				Assert.Single(json_paths, q => q.iPlayerId == 2 && q.iGameId == 1 &&

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
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, AllowTrailingCommas = true }));

				var json_paths1 = JsonSerializer.Serialize(JsonSerializer.Deserialize<InkBallPathViewModel[]>(
					InkBallPath.GetPathsAsJavaScriptArrayForPage2(points_n_paths.Paths),
					new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, AllowTrailingCommas = true }));

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

				var hub_P1 = new GameHub(db, Setup.Logger)
				{
					Clients = mockHubCallerClients.Object,
					Context = mockHubCallerContext_P1.Object
				};
				var hub_P2 = new GameHub(db, Setup.Logger)
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

	}//end class
}
