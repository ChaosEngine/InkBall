using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
	}

	public interface IGameServer
	{
		Task<InkBallPointViewModel> ClientToServerPoint(InkBallPointViewModel point);

		Task<IDtoMsg> ClientToServerPath(InkBallPathViewModel path);

		Task<IDtoMsg> ClientToServerCheck4Win();

		Task ClientToServerPing(PingCommand ping);

		Task<PlayerPointsAndPathsDTO> GetPlayerPointsAndPaths(int gameID);
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
			var this_UserIdentifier = ThisUserIdentifier;

			//IPlayer<InkBallPoint, InkBallPath> this_Player = await GetPlayer(claimsPrincipal, this_UserIdentifier, token);
			//ThisPlayer = this_Player;

			(InkBallGame game, InkBallPlayer this_Player) = await GetGameAndThisPlayer(claimsPrincipal, this_UserIdentifier,
				ThisGameID.Value, ThisPlayerID.Value, token);
			ThisGame = game;
			ThisPlayer = this_Player;

			ThisUserName = ThisPlayer.User.UserName;

			(InkBallPlayer other_Player, string other_UserIdentifier) = GetOtherPlayer(ThisGame, this_UserIdentifier, this_Player);
			OtherPlayer = other_Player;
			OtherUserIdentifier = other_UserIdentifier;
		}

		private (InkBallPlayer other_Player, string other_UserIdentifier) GetOtherPlayer(InkBallGame game,
			string this_UserIdentifier, IPlayer<InkBallPoint, InkBallPath> this_Player)
		{
			InkBallPlayer other_Player;
			string other_UserIdentifier;
			//if (
			//	!(this.Context.Items.TryGetValue(nameof(OtherPlayer), out var opObj) && opObj is IPlayer<InkBallPointViewModel, InkBallPathViewModel> other_Player)
			//	|| !(this.Context.Items.TryGetValue(nameof(OtherUserIdentifier), out var ouidenObj) && ouidenObj is string other_UserIdentifier)
			//	)
			{
				//obtain another player; co-player
				InkBallPlayer otherDbPlayer = game.Player1.User.sExternalId == this_UserIdentifier ? game.Player2 : game.Player1;
				if (otherDbPlayer != null)
				{
					if (otherDbPlayer.iId == this_Player.iId || OtherUserIdentifier == this_UserIdentifier)
						throw new ArgumentException("both game players ar the same");
					other_Player = otherDbPlayer;
					other_UserIdentifier = otherDbPlayer.User.sExternalId;
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

		private async Task<(InkBallGame, InkBallPlayer)> GetGameAndThisPlayer(ClaimsPrincipal claimsPrincipal, string this_UserIdentifier,
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
					&& (w.Player1.User.sExternalId == this_UserIdentifier || w.Player2.User.sExternalId == this_UserIdentifier)
					&& (w.GameState == InkBallGame.GameStateEnum.ACTIVE || w.GameState == InkBallGame.GameStateEnum.AWAITING)
				, token);
				if (dbGame == null)
					throw new NullReferenceException("game == null");
				if (!(dbGame.iPlayer1Id == ThisPlayerID || (dbGame.iPlayer2Id.HasValue && dbGame.iPlayer2Id.Value == ThisPlayerID)))
					throw new ArgumentException("no player exist in that game");

				bool bIsPlayer1;
				if (this_UserIdentifier == dbGame.Player1.User.sExternalId)
				{
					this_Player = dbGame.Player1;
					bIsPlayer1 = true;
				}
				else if (this_UserIdentifier == dbGame.Player2.User.sExternalId)
				{
					this_Player = dbGame.Player2;
					bIsPlayer1 = false;
				}
				else
					throw new NotSupportedException("player not found");
				dbGame.bIsPlayer1 = bIsPlayer1;

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != this_Player.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId");

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
				InkBallPlayer dbPlayer = await _dbContext.InkBallPlayer.Include(u => u.User).FirstOrDefaultAsync(p => p.User.sExternalId == thisUserIdentifier, token);
				if (dbPlayer == null)
					throw new NullReferenceException("no player");

				//additional validation
				string value = claimsPrincipal.FindFirstValue(nameof(Pages.BasePageModel.InkBallUserId));
				int.TryParse(value, out int this_UserId);
				if (this_UserId != dbPlayer.iUserId)
					throw new ArgumentException("this_UserId != this_Player.iUserId");

				this_Player = dbPlayer;
				//this.Context.Items[nameof(ThisPlayer)] = this_Player;
			}
			return this_Player;
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

			await base.OnConnectedAsync();
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
				if (!ThisGame.IsThisPlayerActive())
				{
					throw new ArgumentException("not your turn");
				}

				var current_player_color = ThisGame.IsThisPlayerPlayingWithRed() ? InkBallPoint.StatusEnum.POINT_FREE_RED : InkBallPoint.StatusEnum.POINT_FREE_BLUE;

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
						db_point_player.sLastMoveCode = JsonConvert.SerializeObject(new_point);
#if DEBUG
						//throw new Exception($"FAKE EXCEPTION {new_point}");
#endif
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
				if (!ThisGame.IsThisPlayerActive())
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
				var db_path_player = ThisPlayer.iId == path.iPlayerId ? ThisPlayer : OtherPlayer;

				var all_placed_points_fromDB = await (from p in _dbContext.InkBallPoint
													  where p.iGameId == ThisGame.iId && p.iEnclosingPathId == null
													  && (p.Status == current_player_color || p.Status == other_player_color)
													  select p).Cast<IPoint>()
													  .ToDictionaryAsync(pip => pip, _simpleCoordsPointComparer, token);

				IDtoMsg new_path;
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
						int order = 1;
						foreach (var pop in points_on_path)
						{
							//TODO: check in-path-next-point from start to end with closing
							if (!(all_placed_points_fromDB.TryGetValue(pop, out IPoint iobj) && iobj is InkBallPoint found)
								|| !((found.Status == current_player_color || _simpleCoordsPointComparer.Equals(found, points_on_path.Last())) && found.iPlayerId == ThisPlayer.iId))
							{
								throw new ArgumentOutOfRangeException($"point not in path [{pop}]");
							}

							db_path.InkBallPointsInPath.Add(new InkBallPointsInPath
							{
								Path = db_path,
								Point = found,
								Order = order++
							});
							found.Status = status;
							status = InkBallPoint.StatusEnum.POINT_IN_PATH;
						}

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

						db_path_player.sLastMoveCode = db_path.PointsAsString = JsonConvert.SerializeObject(path);

						await _dbContext.SaveChangesAsync(token);
#if DEBUG
						// var saved_pts = await _dbContext.LoadPointsAndPathsAsync(ThisGameID.Value, token);
						// var restored_from_db = saved_pts.Paths.LastOrDefault()?.InkBallPointsInPath.Select(z => $"{z.Point.iX},{z.Point.iY}");
						// var str = (new Module.Pages.IndexModel(null, null, null)).GetPathsAsJavaScriptArray(saved_pts.Paths);
						// throw new Exception($"FAKE EXCEPTION org pts:[{path.PointsAsString}], restored pts:[{str}], owned:[{path.OwnedPointsAsString}]");
#endif

						var statisticalPointAndPathCounter = new StatisticalPointAndPathCounter(_dbContext, ThisGame.iId,
							ThisPlayer.iId, OtherPlayer.iId, ref owning_color, ref other_owning_color, ref token);

						var win_status = await ThisGame.Check4Win(statisticalPointAndPathCounter);
						if (win_status != InkBallGame.WinStatusEnum.NO_WIN)
						{
							int? winningPlayerID = await _dbContext.HandleWinStatusAsync(win_status, ThisGame, token);

							var win = new WinCommand(win_status, winningPlayerID.GetValueOrDefault(0),
								$"Bravo {(win_status == InkBallGame.WinStatusEnum.GREEN_WINS ? "green" : "red")}!");

							new_path = win;
							await Clients.User(OtherUserIdentifier).ServerToClientPlayerWin(win);
						}
						else
						{
							path = new InkBallPathViewModel(db_path, path.PointsAsString, path.OwnedPointsAsString);
							new_path = path;
							await Clients.User(OtherUserIdentifier).ServerToClientPath(path);
						}

						trans.Commit();

						return new_path;
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
					throw new NullReferenceException("ping == null");

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

		[Authorize(Policy = Constants.InkBallViewOtherGamesPolicyName)]
		public async Task<PlayerPointsAndPathsDTO> GetPlayerPointsAndPaths(int gameID)
		{
			CancellationToken token = this.Context.ConnectionAborted;

			var claimsPrincipal = this.Context.User;
			ThisPlayer = await GetPlayer(claimsPrincipal, ThisUserIdentifier, token);

			try
			{
				if (gameID <= 0 || ThisPlayer == null)
				{
					throw new ArgumentException("bad player or game");
				}

				var packed = await _dbContext.LoadPointsAndPathsAsync(gameID, token);
				var points = CommonPoint.GetPointsAsJavaScriptArrayStatic(packed.Points);
				var paths = InkBallPath.GetPathsAsJavaScriptArrayStatic(packed.Paths);
				var dto = new PlayerPointsAndPathsDTO(points, paths);

				return dto;
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
