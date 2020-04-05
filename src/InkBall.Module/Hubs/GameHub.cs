using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module.Hubs
{
	public interface IGameClient
	{
		Task ServerToClientPoint(InkBallPointViewModel point);

		Task ServerToClientPath(InkBallPathViewModel path);

		Task ServerToClientPing(PingCommand ping);

		Task ServerToClientPlayerJoin(PlayerJoiningCommand join);

		Task ServerToClientPlayerSurrender(PlayerSurrenderingCommand surrender);

		Task ServerToClientPlayerWin(WinCommand win);

		Task ServerToClientStopAndDraw(StopAndDrawCommand notification);

		Task ServerToClientOtherPlayerDisconnected(string message);

		Task ServerToClientOtherPlayerConnected(string message);
	}

	public interface IGameServer
	{
		Task<InkBallPointViewModel> ClientToServerPoint(InkBallPointViewModel point);

		Task<IDtoMsg> ClientToServerPath(InkBallPathViewModel path);

		Task<IDtoMsg> ClientToServerCheck4Win();

		Task ClientToServerPing(PingCommand ping);

		Task<PlayerPointsAndPathsDTO> GetPlayerPointsAndPaths(bool viewOnly, int gameID);

		Task<string> GetUserSettings();

		Task ClientToServerStopAndDraw(StopAndDrawCommand notification);
	}

	[Authorize(Policy = Constants.InkBallPolicyName)]
	public class GameHub : Hub<IGameClient>, IGameServer
	{
		#region Fields

		public const string HubName = "gameHub";

		//Allowed origins here
		internal static readonly SynchronizedCache<string> WebSocketAllowedOrigins = new SynchronizedCache<string>();

		private static readonly SimpleCoordsPointComparer _simpleCoordsPointComparer = new SimpleCoordsPointComparer();

		private readonly GamesContext _dbContext;
		private readonly ILogger<GameHub> _logger;

		#endregion Fields

		#region Properties

		public InkBallPlayer ThisPlayer { get; private set; }

		public InkBallPlayer OtherPlayer { get; private set; }

		public int? ThisGameID
		{
			get
			{
				if (base.Context.Items.TryGetValue(nameof(ThisGameID), out object oObj) && oObj is int iVal)
					return iVal;
				return null;
			}
			private set
			{
				base.Context.Items[nameof(ThisGameID)] = value.GetValueOrDefault(0);
			}
		}

		public int? ThisPlayerID
		{
			get
			{
				if (base.Context.Items.TryGetValue(nameof(ThisPlayerID), out object oObj) && oObj is int iVal)
					return iVal;
				return null;
			}
			private set
			{
				base.Context.Items[nameof(ThisPlayerID)] = value.GetValueOrDefault(0);
			}
		}

		public InkBallGame ThisGame { get; private set; }

		internal string ThisUserIdentifier => base.Context.UserIdentifier;

		public string OtherUserIdentifier { get; private set; }

		public string ThisUserName { get; private set; }

		#endregion Properties

		#region Private methods

		private void ValidateOriginHeaderAndAccessToken(HttpContext ctx)
		{
			//Index page populates WebSocketAllowedOrigins
			if (WebSocketAllowedOrigins.Any() && ctx.Request.Headers.TryGetValue(HeaderNames.Origin, out var origin)
				&& ctx.Request.Headers.TryGetValue(HeaderNames.Upgrade, out var upgrade))
			{
				if (string.Equals(upgrade, "websocket", StringComparison.InvariantCultureIgnoreCase))
				{
					if (!string.IsNullOrEmpty(origin) && !WebSocketAllowedOrigins.ContainsValue(origin))
					{
						throw new UnauthorizedAccessException("Origin not allowed!");
					}
				}
			}
		}

		private (int gameID, int playerID) GetGameIdAndPlayerIDFromContext(HttpContext ctx)
		{
			//Authorization: Bearer iGameID=123 or Query: iGameID=123&iPlayerID=456
			if (!(ctx.Request.Headers.TryGetValue(HeaderNames.Authorization, out var access_token)
				|| ctx.Request.Query.TryGetValue("access_token", out access_token))
				|| string.IsNullOrEmpty(access_token))
			{
				throw new UnauthorizedAccessException($"{nameof(access_token)} not passed!");
			}

			var token_vars = GetGameIDFromAccessToken();
			return token_vars;

			//
			// private internal function
			//
			(int gameID, int playerID) GetGameIDFromAccessToken()
			{
				string value = access_token.FirstOrDefault();
				if (value.StartsWith("bearer ", StringComparison.InvariantCultureIgnoreCase))
					value = value.Substring("bearer ".Length);

				var queryDictionary = QueryHelpers.ParseQuery(value);

				if (!queryDictionary.TryGetValue("iGameID", out StringValues str) || !int.TryParse(str, out int game_id))
					game_id = 0;

				if (!queryDictionary.TryGetValue("iPlayerID", out str) || !int.TryParse(str, out int player_id))
					player_id = 0;

				return (game_id, player_id);
			}
		}

		private async Task LoadGameAndPlayerStructures(CancellationToken token)
		{
			var claimsPrincipal = this.Context.User;
			var thisUserIdentifier = ThisUserIdentifier;

			// if (ThisGame == null || ThisPlayer == null)
			{
				(InkBallGame game, InkBallPlayer this_Player) = await GetGameAndThisPlayer(claimsPrincipal, thisUserIdentifier,
					ThisGameID.Value, ThisPlayerID.Value, token);
				ThisGame = game;
				ThisPlayer = this_Player;
			}

			ThisUserName = ThisPlayer.User.UserName;

			// if (OtherPlayer == null || OtherUserIdentifier == null)
			{
				(InkBallPlayer other_Player, string other_UserIdentifier) = GetOtherPlayer(ThisGame, thisUserIdentifier, ThisPlayer);
				OtherPlayer = other_Player;
				OtherUserIdentifier = other_UserIdentifier;
			}
		}

		private (InkBallPlayer other_Player, string other_UserIdentifier) GetOtherPlayer(InkBallGame game,
			string thisUserIdentifier, IPlayer<InkBallPoint, InkBallPath> this_Player)
		{
			InkBallPlayer other_Player;
			string other_UserIdentifier;
			//if (
			//	!(this.Context.Items.TryGetValue(nameof(OtherPlayer), out var opObj) && opObj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> other_Player)
			//	|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out var ouidenObj) && ouidenObj is string other_UserIdentifier)
			//	)
			{
				//obtain another player; co-player
				InkBallPlayer otherDbPlayer = game.Player1.User.sExternalId == thisUserIdentifier ? game.Player2 : game.Player1;
				if (otherDbPlayer != null)
				{
					if (otherDbPlayer.iId == this_Player.iId || OtherUserIdentifier == thisUserIdentifier)
						throw new ArgumentException("both game players ar the same");
					other_Player = otherDbPlayer;
					other_UserIdentifier = otherDbPlayer.User.sExternalId;

					//Check for other player being CPU player which is treated specially.
					if (string.IsNullOrEmpty(other_UserIdentifier) && otherDbPlayer.iId == -1 && otherDbPlayer.iUserId == -1)
					{
						other_UserIdentifier = thisUserIdentifier;
					}
				}
				else
				{
					other_Player = null;
					other_UserIdentifier = null;
				}
				//this.Context.Items[nameof(OtherPlayer)] = other_Player;
				//this.Context.Items[nameof(OtherUserIdentifier)] = other_UserIdentifier;
			}

			return (other_Player, other_UserIdentifier);
		}

		private async Task<(InkBallGame, InkBallPlayer)> GetGameAndThisPlayer(ClaimsPrincipal claimsPrincipal, string thisUserIdentifier,
			int gameID, int playerID, CancellationToken token)
		{
			InkBallGame game;
			InkBallPlayer this_Player;
			//if (!(this.Context.Items.TryGetValue(nameof(ThisGame), out object gObj) && gObj is InkBallGameViewModel game))
			{
				//get game from db
				InkBallGame dbGame = await _dbContext.InkBallGame
				.Include(gp1 => gp1.Player1)
					.ThenInclude(p1 => p1.User)
				.Include(gp2 => gp2.Player2)
					.ThenInclude(p2 => p2.User)
				.FirstOrDefaultAsync(
					w => w.iId == gameID
					&& (w.iPlayer1Id == playerID || w.iPlayer2Id == playerID)
					&& (w.Player1.User.sExternalId == thisUserIdentifier || w.Player2.User.sExternalId == thisUserIdentifier)
					&& (GamesContext.ActiveVisibleGameStates.Contains(w.GameState))
				, token);
				if (dbGame == null)
					throw new NullReferenceException("game == null");
				if (!(dbGame.iPlayer1Id == ThisPlayerID || (dbGame.iPlayer2Id.HasValue && dbGame.iPlayer2Id.Value == ThisPlayerID)))
					throw new ArgumentException("no player exist in that game");

				bool bIsPlayer1;
				if (thisUserIdentifier == dbGame.Player1.User.sExternalId)
				{
					this_Player = dbGame.Player1;
					bIsPlayer1 = true;
				}
				else if (thisUserIdentifier == dbGame.Player2.User.sExternalId)
				{
					this_Player = dbGame.Player2;
					bIsPlayer1 = false;
				}
				else
					throw new ArgumentNullException(nameof(thisUserIdentifier), "player not found");
				dbGame.bIsPlayer1 = bIsPlayer1;

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != this_Player.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId", nameof(this_Player.iUserId));

				game = dbGame;
				//this.Context.Items[nameof(ThisGame)] = game;
				//this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			return (game, this_Player);
		}

		private async Task<InkBallPlayer> GetPlayer(ClaimsPrincipal claimsPrincipal, string thisUserIdentifier,
			CancellationToken token)
		{
			InkBallPlayer this_Player;
			//if (!(this.Context.Items.TryGetValue(nameof(ThisPlayer), out object pobj) && pobj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> this_Player))
			{
				//get player from db
				InkBallPlayer dbPlayer = await _dbContext.InkBallPlayer.Include(u => u.User)
					.FirstOrDefaultAsync(p => p.User.sExternalId == thisUserIdentifier, token);
				if (dbPlayer == null)
					throw new ArgumentNullException(nameof(dbPlayer), "no player");

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != dbPlayer.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId", nameof(dbPlayer.iUserId));

				this_Player = dbPlayer;
				//this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			return this_Player;
		}

		private async Task OtherPlayerConnectNotification(CancellationToken token)
		{
			try
			{
				await LoadGameAndPlayerStructures(token);

				if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
					|| string.IsNullOrEmpty(ThisUserName) || ThisGame.CpuOponent == true)
					return;

				var msg = $"Other player {ThisPlayer?.User?.UserName} connected 😁";
				await Clients.User(OtherUserIdentifier).ServerToClientOtherPlayerConnected(msg);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
			}
		}

		private async Task OtherPlayerDisconnectNotification(Exception exception, CancellationToken token = default)
		{
			if (exception != null)
				_logger.LogInformation(exception, nameof(OnDisconnectedAsync));

			try
			{
				await LoadGameAndPlayerStructures(token);

				if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
					|| string.IsNullOrEmpty(ThisUserName) || ThisGame.CpuOponent == true)
					return;

				var msg = $"Other player {ThisPlayer?.User?.UserName} disconnected 😢";
				await Clients.User(OtherUserIdentifier).ServerToClientOtherPlayerDisconnected(msg);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
			}
		}

		#endregion Private methods

		public GameHub(GamesContext dbContext, ILogger<GameHub> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		public override async Task OnConnectedAsync()
		{
			var ctx = this.Context.GetHttpContext();

			ValidateOriginHeaderAndAccessToken(ctx);

			(int gameID, int playerID) = GetGameIdAndPlayerIDFromContext(ctx);
			ThisGameID = gameID;
			ThisPlayerID = playerID;


			await OtherPlayerConnectNotification(this.Context.ConnectionAborted);
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			await OtherPlayerDisconnectNotification(exception);
		}

		#region IGameServer implementation

		public async Task<InkBallPointViewModel> ClientToServerPoint(InkBallPointViewModel point)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);

			try
			{
				if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
					|| string.IsNullOrEmpty(ThisUserName))
				{
					throw new ArgumentException("bad player or game");
				}
				if (!ThisGame.IsThisPlayerActive(point))
				{
					throw new ArgumentException("not your turn");
				}

				var current_player_color = ThisGame.IsThisPlayerPlayingWithRed(point) ? InkBallPoint.StatusEnum.POINT_FREE_RED : InkBallPoint.StatusEnum.POINT_FREE_BLUE;

				if (point == null || point.iGameId != ThisGame.iId || point.Status != current_player_color
					|| point.iX < 0 || point.iY < 0 || point.iX > ThisGame.iBoardWidth || point.iY > this.ThisGame.iBoardHeight)
					throw new ArgumentException("bad point");
				if (point.iPlayerId != ThisPlayer.iId && point.iPlayerId != OtherPlayer.iId)
					throw new ArgumentException("bad Player ID");


				var already_placed = await _dbContext.InkBallPoint.AnyAsync(pts =>
									pts.iGameId == ThisGame.iId && pts.iPlayerId == point.iPlayerId
									&& pts.iX == point.iX && pts.iY == point.iY
									, token);
				var db_point_player = ThisPlayer.iId == point.iPlayerId ? ThisPlayer : OtherPlayer;
				if (already_placed)
					throw new ArgumentException("point already placed");

				var game_paths = await _dbContext.GetPathsFromDatabaseAsync(point.iGameId, true, token);
				if (game_paths.Any(pa => pa.IsPointInsidePath(point)))
					throw new ArgumentException("point inside path");

				var db_point = new InkBallPoint
				{
					//iId = point.iId,
					iGameId = ThisGame.iId,
					iPlayerId = point.iPlayerId,
					iX = point.iX,
					iY = point.iY,
					Status = point.Status,
					iEnclosingPathId = point.iEnclosingPathId <= 0 ? null : point.iEnclosingPathId
				};
				InkBallPointViewModel new_point;

				using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
				{
					try
					{
						await _dbContext.InkBallPoint.AddAsync(db_point, token);
						ThisGame.bIsPlayer1Active = !ThisGame.bIsPlayer1Active;

						new_point = new InkBallPointViewModel(db_point);
						db_point_player.sLastMoveCode = JsonSerializer.Serialize(new_point);
						// #if DEBUG
						// 						throw new Exception($"FAKE EXCEPTION {new_point}");
						// #endif
						await _dbContext.SaveChangesAsync(token);

						trans.Commit();
					}
					catch (Exception ex)
					{
						trans.Rollback();
						_logger.LogError(ex, nameof(ClientToServerPoint));
						throw;
					}
				}

				if (!ThisGame.CpuOponent)
					await Clients.User(OtherUserIdentifier).ServerToClientPoint(new_point);

				return new_point;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task<IDtoMsg> ClientToServerPath(InkBallPathViewModel path)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);

			try
			{
				if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
					|| string.IsNullOrEmpty(ThisUserName))
					throw new ArgumentException("bad game or player");
				bool isDelayedPathDrawn = false;
				if (!ThisGame.IsThisPlayerActive(path)
					&& !(isDelayedPathDrawn = ThisPlayer.IsDelayedPathDrawPossible()))
					throw new ArgumentException("not your turn");

				if (path == null || path.iPlayerId <= 0 || path.iGameId <= 0 || path.iGameId != ThisGame.iId)
					throw new ArgumentException("bad path");
				if (path.iPlayerId != ThisPlayer.iId && path.iPlayerId != OtherPlayer.iId)
					throw new ArgumentException("bad Player ID");
				ICollection<InkBallPointViewModel> points_on_path = path.InkBallPoint;//serialize points from path int objects

				InkBallPoint.StatusEnum current_player_color, other_player_color, owning_color, other_owning_color;
				if (ThisGame.IsThisPlayerPlayingWithRed())
				{
					current_player_color = InkBallPoint.StatusEnum.POINT_FREE_RED;
					other_player_color = InkBallPoint.StatusEnum.POINT_FREE_BLUE;
					owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_RED;
					other_owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE;
				}
				else
				{
					current_player_color = InkBallPoint.StatusEnum.POINT_FREE_BLUE;
					other_player_color = InkBallPoint.StatusEnum.POINT_FREE_RED;
					owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE;
					other_owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_RED;
				}
				InkBallPoint.StatusEnum[] free_colors = new[] { current_player_color, other_player_color };
				InkBallPoint.StatusEnum[] in_path_colors = new[] { InkBallPoint.StatusEnum.POINT_IN_PATH, InkBallPoint.StatusEnum.POINT_STARTING };
				var db_path_player = ThisPlayer.iId == path.iPlayerId ? ThisPlayer : OtherPlayer;
				var all_placed_points_fromDB = await (from p in _dbContext.InkBallPoint
													  where p.iGameId == ThisGame.iId &&
													  (
														  (p.iEnclosingPathId == null && free_colors.Contains(p.Status)) ||
														  (p.iEnclosingPathId != null && in_path_colors.Contains(p.Status))
													  )
													  select p).Cast<IPoint>()
													  .ToDictionaryAsync(pip => pip, _simpleCoordsPointComparer, token);

				var db_path = new InkBallPath
				{
					// iId = path.iId,
					iGameId = path.iGameId,
					iPlayerId = path.iPlayerId,
					//PointsAsString = path.PointsAsString
				};
				using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
				{
					try
					{
						await _dbContext.InkBallPath.AddAsync(db_path, token);
						await _dbContext.SaveChangesAsync(token);

						var status = InkBallPoint.StatusEnum.POINT_STARTING;
						var last_point_in_path = points_on_path.Last();
						foreach (var pop in points_on_path)
						{
							//TODO: check in-path-next-point from start to end with closing
							if (!(all_placed_points_fromDB.TryGetValue(pop, out IPoint iobj) && iobj is InkBallPoint found)
								|| !(found.iPlayerId == ThisPlayer.iId &&
									(
										((found.iEnclosingPathId == null && (found.Status == current_player_color || _simpleCoordsPointComparer.Equals(found, last_point_in_path))) ||
										(found.iEnclosingPathId != null && in_path_colors.Contains(found.Status)))
									))
								)
							{
								throw new ArgumentOutOfRangeException($"point not in path [{pop}]");
							}

							found.Status = status;
							status = InkBallPoint.StatusEnum.POINT_IN_PATH;
							found.EnclosingPath = db_path;
						}

						if (!isDelayedPathDrawn)
							ThisGame.bIsPlayer1Active = !ThisGame.bIsPlayer1Active;

						var owning_points = path.GetOwnedPoints(owning_color, OtherPlayer.iId);
						foreach (var op in owning_points)
						{
							if (!(all_placed_points_fromDB.TryGetValue(op, out IPoint iobj) && iobj is InkBallPoint found)
								|| !(found.Status == other_player_color && found.iPlayerId == OtherPlayer.iId))
							{
								throw new ArgumentOutOfRangeException($"owning point not found [{op}]");
							}
							if (!path.IsPointInsidePath(op))
							{
								throw new ArgumentOutOfRangeException($"owning point not found [{op}]");
							}

							found.Status = owning_color;
							found.EnclosingPath = db_path;
						}

						path.iId = db_path.iId;//get real DB id saved previously
						db_path_player.sLastMoveCode = db_path.PointsAsString = JsonSerializer.Serialize(path);

						await _dbContext.SaveChangesAsync(token);
						// #if DEBUG
						// 						var saved_pts = await _dbContext.LoadPointsAndPathsAsync(ThisGameID.Value, token);
						// 						var restored_from_db = saved_pts.Paths.LastOrDefault()?.InkBallPoint.Select(z => $"{z.iX},{z.iY}");
						// 						var str = InkBallPath.GetPathsAsJavaScriptArrayForPage2(saved_pts.Paths);
						// 						throw new Exception($"FAKE EXCEPTION org pts:[{path.PointsAsString}], restored pts:[{str}], owned:[{path.OwnedPointsAsString}]");
						// #endif

						var statisticalPointAndPathCounter = new StatisticalPointAndPathCounter(_dbContext, ThisGame.iId,
							ThisPlayer.iId, OtherPlayer.iId, ref owning_color, ref other_owning_color, ref token);

						IDtoMsg dto;
						var win_status = await ThisGame.Check4Win(statisticalPointAndPathCounter);
						if (win_status != InkBallGame.WinStatusEnum.NO_WIN)
						{
							int? winningPlayerID = await _dbContext.HandleWinStatusAsync(win_status, ThisGame, token);

							var win = new WinCommand(win_status, winningPlayerID.GetValueOrDefault(0),
								$"Bravo {(win_status == InkBallGame.WinStatusEnum.GREEN_WINS ? "green" : "red")}!");

							dto = win;
							await Clients.User(OtherUserIdentifier).ServerToClientPlayerWin(win);
						}
						else
						{
							path = new InkBallPathViewModel(db_path, path.PointsAsString, path.OwnedPointsAsString);
							dto = path;
							if (!ThisGame.CpuOponent)
								await Clients.User(OtherUserIdentifier).ServerToClientPath(path);
						}

						trans.Commit();

						return dto;
					}
					catch (Exception ex)
					{
						trans.Rollback();
						_logger.LogError(ex, nameof(ClientToServerPath));
						throw;
					}
				}//trans end
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}//method end

		public async Task<IDtoMsg> ClientToServerCheck4Win()
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);

			try
			{
				if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
					|| string.IsNullOrEmpty(ThisUserName))
					throw new ArgumentException("bad game or player");
				if (!ThisGame.IsThisPlayerActive())
					throw new ArgumentException("not your turn");


				InkBallPoint.StatusEnum owning_color, other_owning_color;
				if (ThisGame.IsThisPlayerPlayingWithRed())
				{
					owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_RED;
					other_owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE;
				}
				else
				{
					owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE;
					other_owning_color = InkBallPoint.StatusEnum.POINT_OWNED_BY_RED;
				}
				using (var trans = await _dbContext.Database.BeginTransactionAsync(token))
				{
					try
					{
						var statisticalPointAndPathCounter = new StatisticalPointAndPathCounter(_dbContext, ThisGame.iId,
							ThisPlayer.iId, OtherPlayer.iId, ref owning_color, ref other_owning_color, ref token);

						InkBallGame.WinStatusEnum win_status = await ThisGame.Check4Win(statisticalPointAndPathCounter);

						int? winningPlayerID = await _dbContext.HandleWinStatusAsync(win_status, ThisGame, token);

						var win = new WinCommand(win_status, winningPlayerID.GetValueOrDefault(0), win_status.ToString());

						await Clients.User(OtherUserIdentifier).ServerToClientPlayerWin(win);

						trans.Rollback();

						return win;
					}
					catch (Exception ex)
					{
						trans.Rollback();
						_logger.LogError(ex, nameof(ClientToServerPath));
						throw;
					}
				}//trans end
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task ClientToServerPing(PingCommand ping)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);

			if (ThisGame == null || ThisPlayer == null || OtherPlayer == null || string.IsNullOrEmpty(OtherUserIdentifier)
				|| string.IsNullOrEmpty(ThisUserName))
				return;

			try
			{
				if (ping == null)
					throw new ArgumentNullException(nameof(ping), "ping == null");

				var new_ping = new PingCommand(ping);

				await Clients.User(OtherUserIdentifier).ServerToClientPing(new_ping);
			}
			catch (Exception ex)
			{
				string str = string.Empty;
				if (this.Context.Items.Count > 1)
				{
					System.Type t = typeof(System.Net.WebSockets.WebSocketProtocol);
					str = "more than 1 " + t.ToString();
				}
				_logger.LogError(ex.Message + str);
				throw;
			}
		}

		//[Authorize(Policy = Constants.InkBallViewOtherGamesPolicyName)]
		public async Task<PlayerPointsAndPathsDTO> GetPlayerPointsAndPaths(bool viewOnly, int gameID)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			if (viewOnly)
			{
				//if(!(await authorization.AuthorizeAsync(base.User, Constants.InkBallViewOtherGamesPolicyName)).Succeeded)
				if (!this.Context.User.HasClaim("role", "InkBallViewOtherPlayerGames"))
					throw new UnauthorizedAccessException("Can not watch other player games!");

				var claimsPrincipal = this.Context.User;
				ThisPlayer = await GetPlayer(claimsPrincipal, ThisUserIdentifier, token);

				if (gameID <= 0 || ThisPlayer == null)
					throw new ArgumentException("bad player or game");
			}
			else
			{
				await LoadGameAndPlayerStructures(token);
				if (ThisGame == null || ThisPlayer == null || string.IsNullOrEmpty(ThisUserName))
					throw new ArgumentException("bad player or game");

				gameID = ThisGame.iId;
			}

			try
			{
				var packed = await _dbContext.LoadPointsAndPathsAsync(gameID, token, false);
				var points = CommonPoint.GetPointsAsJavaScriptArrayForSignalR(packed.Points);
				var paths = InkBallPath.GetPathsAsJavaScriptArrayForSignalR2(packed.Paths);
				var dto = new PlayerPointsAndPathsDTO(points, paths);

				return dto;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task<string> GetUserSettings()
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);
			if (ThisGame == null || ThisPlayer == null || string.IsNullOrEmpty(ThisUserName))
				throw new ArgumentException("bad player or game");

			try
			{
				var settings_json = this.Context.User.FindFirst(c => c.ValueType == "UserSettings" && c.Type == ClaimTypes.UserData);
				if (settings_json != null && settings_json.Value != null)
				{
					// var settings = Newtonsoft.Json.JsonConvert.DeserializeObject<ApplicationUserSettings>(settings_json.Value,
					// 	new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
					var settings = settings_json.Value;
					return settings;
				}
				else
					return null;
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		public async Task ClientToServerStopAndDraw(StopAndDrawCommand notification)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			await LoadGameAndPlayerStructures(token);
			if (ThisGame == null || ThisPlayer == null || string.IsNullOrEmpty(ThisUserName))
				throw new ArgumentException("bad player or game");

			try
			{
				await Clients.User(OtherUserIdentifier).ServerToClientStopAndDraw(notification);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex.Message);
				throw;
			}
		}

		#endregion IGameServer implementation
	}
}
