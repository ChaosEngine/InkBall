using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace InkBall.Tests
{
	public class SignalRTests : DbContextTests
	{
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
						new Claim(nameof(InkBall.Module.Pages.HomeModel.InkBallUserId), userID.ToString(), nameof(InkBall.Module.Model.InkBallUser)) }) }));
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
				//Create game for user and assume eveyrthing is ready, player, connecting strucures, order of moves etc.
				//Arrange
				//Act
				var new_game = await db.CreateNewGameFromExternalUserIDAsync("xxxxx", InkBallGame.GameStateEnum.AWAITING,
					InkBallGame.GameTypeEnum.FIRST_CAPTURE, 16, 20, 26, true, token);
				//Assert
				Assert.NotNull(new_game);
				Assert.NotNull(new_game.Player1);
				Assert.NotNull(new_game.Player1.User);
				Assert.Equal("xxxxx", new_game.Player1.User.sExternalId);

				//Get active games for ALL the users and check if there is game for our user
				//Act
				IEnumerable<InkBallGame> games_from_db = await db.GetGamesForRegistrationAsSelectTableRowsAsync(null, null, null, true, token);
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
				   pjc.Message == "Player test_p2 joining"
				   && (pjc.OtherPlayerId == 1 || pjc.OtherPlayerId == 2)
				   && pjc.OtherPlayerName == "test_p2"
				   )), Times.Once);
			}
		}
	}//end class
}
