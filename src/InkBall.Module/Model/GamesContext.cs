using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
#if INCLUDE_POSTGRES
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
#endif
#if INCLUDE_ORACLE
using Oracle.EntityFrameworkCore.Metadata;
#endif
using System.Threading;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using static InkBall.Module.Model.InkBallGame;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace InkBall.Module.Model
{
	public interface IGamesContext
	{
		DbSet<InkBallGame> InkBallGame { get; set; }
		DbSet<InkBallPath> InkBallPath { get; set; }
		DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		DbSet<InkBallPoint> InkBallPoint { get; set; }
	}

	public partial class GamesContext : DbContext, IGamesContext
	{
		//private static DateTimeToBytesConverter _sqlServerTimestampConverter;

		public virtual DbSet<InkBallGame> InkBallGame { get; set; }
		public virtual DbSet<InkBallPath> InkBallPath { get; set; }
		public virtual DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		public virtual DbSet<InkBallPoint> InkBallPoint { get; set; }

		public GamesContext(DbContextOptions<GamesContext> options) : base(options)
		{
		}

		#region Helpers

		internal static readonly GameStateEnum[] ActiveVisibleGameStates =
			new GameStateEnum[] { GameStateEnum.ACTIVE, GameStateEnum.AWAITING };

		static readonly JsonSerializerOptions _ignoreDefaultsSerializerOptions = new JsonSerializerOptions
		{
			DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
		};

		internal static string TimeStampDefaultValueFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return "GETDATE()";

				case "Pomelo.EntityFrameworkCore.MySql":
					return "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";

				case "Microsoft.EntityFrameworkCore.Sqlite":
					return "datetime('now','localtime')";

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
				case "Oracle.EntityFrameworkCore":
					return "CURRENT_TIMESTAMP";

				default:
					throw new NotSupportedException($"Bad DBKind name {activeProvider}");
			}
		}

		internal static ValueConverter TimeStampValueConverterFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					//if (_sqlServerTimestampConverter == null)
					//	_sqlServerTimestampConverter = new DateTimeToBytesConverter();
					//return _sqlServerTimestampConverter;
					return null;

				case "Microsoft.EntityFrameworkCore.Sqlite":
				case "Pomelo.EntityFrameworkCore.MySql":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
				case "Oracle.EntityFrameworkCore":
					return null;

				default:
					throw new NotSupportedException($"Bad DBKind name {activeProvider}");
			}
		}

		internal static string TimeStampColumnTypeFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return "datetime2";

				case "Pomelo.EntityFrameworkCore.MySql":
				case "Microsoft.EntityFrameworkCore.Sqlite":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
				case "Oracle.EntityFrameworkCore":
					return "timestamp";

				default:
					throw new NotSupportedException($"Bad DBKind name{activeProvider}");
			}
		}

		public static string JsonColumnTypeFromProvider(string activeProvider)
		{
			return activeProvider switch
			{
				"Microsoft.EntityFrameworkCore.SqlServer" => "nvarchar(1000)",
				"Pomelo.EntityFrameworkCore.MySql" => "json",
				"Microsoft.EntityFrameworkCore.Sqlite" => "TEXT",
				"Npgsql.EntityFrameworkCore.PostgreSQL" => "jsonb",
				"Oracle.EntityFrameworkCore" => "VARCHAR2(4000)",
				_ => throw new NotSupportedException($"Bad DBKind name {activeProvider}"),
			};
		}

		/*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", new MySqlServerVersion(new Version(8, 0, 21)));
            }
        }*/

		#endregion Helpers

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<InkBallGame>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iPlayer1Id)
					.HasDatabaseName("ByPlayer1");

				entity.HasIndex(e => e.iPlayer2Id)
					.HasDatabaseName("ByPlayer2");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_MYSQL
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
					;

				entity.Property(e => e.bIsPlayer1Active)
					.HasColumnName("bIsPlayer1Active")
					.HasDefaultValue(true);

				entity.Property(e => e.CreateTime).HasColumnType("datetime");

				entity.Property(e => e.iBoardHeight)
					.HasColumnName("iBoardHeight")
					.HasDefaultValue(26);

				entity.Property(e => e.iBoardWidth)
					.HasColumnName("iBoardWidth")
					.HasDefaultValue(20);

				entity.Property(e => e.GameType)
					.HasMaxLength(256)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (GameTypeEnum)Enum.Parse(typeof(GameTypeEnum), v));

				entity.Property(e => e.GameState)
					.HasMaxLength(256)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (GameStateEnum)Enum.Parse(typeof(GameStateEnum), v));

				entity.Property(e => e.iGridSize)
					.HasColumnName("iGridSize")
					.HasDefaultValue(16);

				entity.Property(e => e.iPlayer1Id).HasColumnName("iPlayer1ID");

				entity.Property(e => e.iPlayer2Id).HasColumnName("iPlayer2ID");

				entity.Property(e => e.TimeStamp)
					.HasColumnType(TimeStampColumnTypeFromProvider(Database.ProviderName))
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampDefaultValueFromProvider(Database.ProviderName))
					.HasConversion(TimeStampValueConverterFromProvider(Database.ProviderName));

				entity.HasOne(d => d.Player1)
					.WithMany(p => p.InkBallGameIPlayer1)
					.HasForeignKey(d => d.iPlayer1Id)
					.OnDelete(DeleteBehavior.Restrict)
					.HasConstraintName("InkBallGame_ibfk_1");

				entity.HasOne(d => d.Player2)
					.WithMany(p => p.InkBallGameIPlayer2)
					.HasForeignKey(d => d.iPlayer2Id)
					.HasConstraintName("InkBallGame_ibfk_2");
			});

			modelBuilder.Entity<InkBallPath>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iGameId)
					.HasDatabaseName("IDX_InkBallPath_ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasDatabaseName("IDX_InkBallPath_ByPlayer");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_MYSQL
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
					;

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.Property(e => e.PointsAsString)
					.HasColumnName("PointsAsString")
					.HasColumnType(JsonColumnTypeFromProvider(Database.ProviderName));

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.Restrict)
					.HasConstraintName("InkBallPath_ibfk_1");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.Restrict)
					.HasConstraintName("InkBallPath_ibfk_2");
			});

			modelBuilder.Entity<InkBallPlayer>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_MYSQL
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
					;

				entity.Property(e => e.iDrawCount)
					.HasColumnName("iDrawCount")
					.HasColumnType("int(11)")
					.HasDefaultValue(0);

				entity.Property(e => e.iLossCount)
					.HasColumnName("iLossCount")
					.HasColumnType("int(11)")
					.HasDefaultValue(0);

				entity.Property(e => e.iWinCount)
					.HasColumnName("iWinCount")
					.HasColumnType("int(11)")
					.HasDefaultValue(0);

				entity.Property(e => e.sLastMoveCode)
					.HasColumnName("sLastMoveCode")
					.HasColumnType(JsonColumnTypeFromProvider(Database.ProviderName));

				entity.Property(e => e.TimeStamp)
					.HasColumnType(TimeStampColumnTypeFromProvider(Database.ProviderName))
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampDefaultValueFromProvider(Database.ProviderName))
					.HasConversion(TimeStampValueConverterFromProvider(Database.ProviderName));

				entity.HasData(new InkBallPlayer
				{
					iId = -1,
					iPrivileges = 1,
					UserName = Module.Model.InkBallPlayer.CPUOponentPlayerName,
					sLastMoveCode = "{}",
					iWinCount = 0,
					iLossCount = 0,
					iDrawCount = 0
				});
			});

			modelBuilder.Entity<InkBallPoint>(entity =>
			{
				entity.HasKey(e => new { e.iGameId, e.iX, e.iY });

				entity.HasIndex(e => e.iEnclosingPathId)
					.HasDatabaseName("ByEnclosingPath");

				//entity.HasIndex(e => e.iGameId)
				//	.HasDatabaseName("IDX_InkBallPoint_ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasDatabaseName("IDX_InkBallPoint_ByPlayer");

				entity.Property(e => e.iEnclosingPathId).HasColumnName("iEnclosingPathId");

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.Property(e => e.iX).HasColumnName("iX");

				entity.Property(e => e.iY).HasColumnName("iY");

				entity.Property(e => e.Status)
					.HasDefaultValue(Module.Model.InkBallPoint.StatusEnum.POINT_FREE)
					.HasConversion(new EnumToNumberConverter<InkBallPoint.StatusEnum, int>());

				entity.HasOne(d => d.EnclosingPath)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iEnclosingPathId)
					.HasConstraintName("InkBallPoint_ibfk_5");

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.Restrict)
					.HasConstraintName("InkBallPoint_ibfk_3");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.Restrict)
					.HasConstraintName("InkBallPoint_ibfk_4");
			});

		}

		#region Business logic methods

		public async Task<InkBallGame> CreateNewGameFromExternalUserIDAsync(string sPlayer1ExternalUserID, GameTypeEnum gameType,
			int gridSize, int width, int height, bool cpuOpponent = false, CancellationToken token = default)
		{
			try
			{
				if (!string.IsNullOrEmpty(sPlayer1ExternalUserID))
				{
					var dbPlayer1 = await CreateNewPlayerFromExternalUserIdAsync(sPlayer1ExternalUserID, "{}", token);
				}
			}
			catch (Exception ex)
			{
				throw new ApplicationException("Could not create user of that ID", ex);
			}


			bool bIsPlayer1Active = cpuOpponent;
			GameStateEnum gameState = cpuOpponent ? GameStateEnum.ACTIVE : GameStateEnum.AWAITING;
			int game_id = await PrivInkBallGameInsertAsync(null, sPlayer1ExternalUserID, gridSize, width, height, bIsPlayer1Active,
				cpuOpponent);

			if (game_id <= -1)
				throw new ArgumentNullException(nameof(game_id), "Could not create new game");

			var new_game = await GetGameFromDatabaseAsync(game_id, true);
			return new_game;

			//
			// private functions
			//
			async Task<int> PrivInkBallGameInsertAsync(int? iPlayer1ID, string player1ExternalUserID,
				int iGridSize, int iBoardWidth, int iBoardHeight, bool bIsPlayer1ActiveHere, bool cpuOpponent)
			{
				var cp1_query = from cp1 in this.InkBallPlayer
								where ((!iPlayer1ID.HasValue || cp1.iId == iPlayer1ID.Value)
								&& (string.IsNullOrEmpty(player1ExternalUserID) || cp1.sExternalId == player1ExternalUserID)
								&& (iPlayer1ID.HasValue || !string.IsNullOrEmpty(player1ExternalUserID)))
								&& !InkBallGame.Any(tmp => (tmp.iPlayer1Id == cp1.iId || tmp.iPlayer2Id == cp1.iId)
									&& ActiveVisibleGameStates.Contains(tmp.GameState))

								select (int?)cp1.iId;
				int? p1 = await cp1_query.FirstOrDefaultAsync(token);

				int? p2;
				if (cpuOpponent == true)
				{
					var cp2_query = from cp2 in this.InkBallPlayer
									where cp2.iId == -1
									select (int?)cp2.iId;
					p2 = await cp2_query.FirstOrDefaultAsync(token);
					if (p2 == null)
						throw new ArgumentNullException(nameof(game_id), "CPU player not found");
				}
				else
					p2 = null;

				//check for proper IDs
				if (p1.HasValue/* || p2.HasValue*/)
				{
					// insert into InkBallGame(iPlayer1ID, iPlayer2ID, iGridSize, iBoardWidth, iBoardHeight,
					// 	bIsPlayer1Active, GameState, CreateTime, GameType)
					// select p1, p2, iGridSize, iBoardWidth, iBoardHeight, bIsPlayer1Active, GameState, now(),
					// 	GameType;
					var gm = new InkBallGame
					{
						iPlayer1Id = p1.Value,
						iPlayer2Id = p2,
						bIsPlayer1Active = bIsPlayer1ActiveHere,
						iGridSize = iGridSize,
						iBoardWidth = iBoardWidth,
						iBoardHeight = iBoardHeight,
						GameType = gameType,
						GameState = gameState,
						//TimeStamp = DateTime.Now,
						CreateTime = Module.Model.InkBallGame.CreateTimeInitialValue
					};
					await InkBallGame.AddAsync(gm, token);

					await SaveChangesAsync(token);

					return gm.iId;
				}
				else
				{
					return -1;
				}
			}
		}

		public async Task<InkBallGame> GetGameFromDatabaseAsync(int iID, bool bIsPlayer1, CancellationToken token = default)
		{
			var query = from g in InkBallGame
							.Include(gp1 => gp1.Player1)
							.Include(gp2 => gp2.Player2)
						where g.iId == iID
						select g;

			var game = await query.FirstOrDefaultAsync(token);
			if (game != null)
				game.bIsPlayer1 = bIsPlayer1;
			return game;
		}

		private async Task<InkBallPlayer> CreateNewPlayerFromExternalUserIdAsync(string sExternalId, string sLastMoveCode, CancellationToken token = default)
		{
			var query = from p in this.InkBallPlayer
						where p.sExternalId == sExternalId
						select p;
			var player = await query.FirstOrDefaultAsync(token);
			if (player == null)
			{
				player = new InkBallPlayer
				{
					sLastMoveCode = sLastMoveCode,
					iWinCount = 0,
					iLossCount = 0,
					iDrawCount = 0,
					//TimeStamp = DateTime.Now
				};
				await this.InkBallPlayer.AddAsync(player, token);
			}
			else
			{
				player.sLastMoveCode = sLastMoveCode;
				//player.TimeStamp = DateTime.Now;//sqlite can not timestamp on update
			}
			await this.SaveChangesAsync(token);

			return player;
		}

		public async Task<bool> JoinGameFromExternalUserIdAsync(InkBallGame game, string sPlayer2ExternalUserID, CancellationToken token = default)
		{
			if (game.GameState != GameStateEnum.AWAITING || game.Player2 != null ||
				game.Player1 == null || game.Player1.sExternalId == sPlayer2ExternalUserID)
			{
				throw new ArgumentException("Wrong game state 2 join", nameof(game));
			}

			InkBallPlayer player2;
			try
			{
				player2 = await CreateNewPlayerFromExternalUserIdAsync(sPlayer2ExternalUserID, "{}", token);
			}
			catch (Exception ex)
			{
				throw new ArgumentException("Could not create user of that ID", nameof(player2), ex);
			}

			game.Player2 = player2;
			game.GameState = GameStateEnum.ACTIVE;
			game.bIsPlayer1 = false;
			game.bIsPlayer1Active = true;
			//game.TimeStamp = DateTime.Now;//sqlite can not timestamp on update

			await this.SaveChangesAsync(token);

			return true;
		}

		public async Task SurrenderGameFromPlayerAsync(InkBallGame game, ISession session, bool bForcePlayerLoose = false, CancellationToken token = default)
		{
			switch (game.GameState)
			{
				case GameStateEnum.ACTIVE:
					//update game(deactivate)...
					game.GameState = GameStateEnum.FINISHED;

					var last_move = Module.Model.InkBallPlayer.TimeStampInitialValue - game.GetOtherPlayer().TimeStamp;
					if (!bForcePlayerLoose && game.IsThisPlayerActive() && last_move > Module.Model.InkBallGame.DeactivationDelayInSeconds)
					{
						//...and update players statistics(highscores)
						//$sQuery = "call InkBallPlayerUpdate({$this->GetGameID()}, {$this->GetPlayer()->GetPlayerID()}, null, {$this->GetPlayer()->GetWinCount()}, null, null)";
						game.GetPlayer().iWinCount = game.GetPlayer().iWinCount + 1;

						//$sQuery = "call InkBallPlayerUpdate({$this->GetGameID()}, {$this->GetOtherPlayer()->GetPlayerID()}, null, null, {$this->GetOtherPlayer()->GetLossCount()}, null)";
						game.GetOtherPlayer().iLossCount = game.GetOtherPlayer().iLossCount + 1;
					}
					else
					{
						//...and update players statistics(highscores)
						//$sQuery = "call InkBallPlayerUpdate({$this->GetGameID()}, {$this->GetPlayer()->GetPlayerID()}, null, null, {$this->GetPlayer()->GetLossCount()}, null)";
						game.GetPlayer().iLossCount = game.GetPlayer().iLossCount + 1;

						game.GetOtherPlayer().iWinCount = game.GetOtherPlayer().iWinCount + 1;
					}

					await this.SaveChangesAsync(token);

					// //remove this game in session
					// session.Remove(nameof(InkBallGameViewModel));
					break;

				case GameStateEnum.AWAITING:
					//update game(deactivate)...
					game.GameState = GameStateEnum.INACTIVE;

					await this.SaveChangesAsync(token);

					// //remove this game in session
					// session.Remove(nameof(InkBallGameViewModel));
					break;

				case GameStateEnum.INACTIVE:
				case GameStateEnum.FINISHED:
				default:
					// //remove this game in session
					// session.Remove(nameof(InkBallGameViewModel));
					break;
			}

		}

		public async Task<int?> HandleWinStatusAsync(WinStatusEnum winStatus, InkBallGame game, CancellationToken token = default)
		{
			int? winningPlayerID;
			switch (winStatus)
			{
				case WinStatusEnum.RED_WINS:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);

					//...and update players statistics(highscores)
					if (game.IsThisPlayerPlayingWithRed())
					{
						game.GetPlayer().iWinCount++;
						game.GetOtherPlayer().iLossCount++;

						winningPlayerID = game.GetPlayer().iId;
					}
					else
					{
						game.GetOtherPlayer().iWinCount++;
						game.GetPlayer().iLossCount++;

						winningPlayerID = game.GetOtherPlayer().iId;
					}
					await this.SaveChangesAsync(token);

					break;

				case WinStatusEnum.GREEN_WINS:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);

					//...and update players statistics(highscores)
					if (!game.IsThisPlayerPlayingWithRed())
					{
						game.GetPlayer().iWinCount++;
						game.GetOtherPlayer().iLossCount++;

						winningPlayerID = game.GetPlayer().iId;
					}
					else
					{
						game.GetOtherPlayer().iWinCount++;
						game.GetPlayer().iLossCount++;

						winningPlayerID = game.GetOtherPlayer().iId;
					}
					await this.SaveChangesAsync(token);

					break;

				case WinStatusEnum.DRAW_WIN:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);

					//...and update players statistics(highscores)
					game.GetPlayer().iDrawCount++;
					game.GetOtherPlayer().iDrawCount++;

					await this.SaveChangesAsync(token);

					winningPlayerID = null;
					break;

				case WinStatusEnum.NO_WIN:
				default:
					winningPlayerID = null;
					break;
			}

			return winningPlayerID;
		}

		public async Task<IEnumerable<InkBallGame>> GetGamesForRegistrationAsSelectTableRowsAsync(CancellationToken token = default)
		{

			var query = from ig in InkBallGame
						.Include(ip1 => ip1.Player1)
						.Include(ip2 => ip2.Player2)
						where ActiveVisibleGameStates.Contains(ig.GameState)
						orderby ig.iId
						select ig;

			return await query.ToArrayAsync(token);
		}

		private async Task<IEnumerable<InkBallPoint>> GetPointsFromDatabaseAsync(int iGameID, CancellationToken token = default)
		{
			var query = from ip in InkBallPoint.AsNoTracking()
						where ip.iGameId == iGameID
						select ip;

			return await query.ToArrayAsync(token);
		}

		private static InkBallPath LoadPointsInPathFromJson(InkBallPath path,
			Action<InkBallPath, InkBallPathViewModel> jsonPathHandler,
			Action<InkBallPath, InkBallPathViewModel> createPathPointCollectionHandler)
		{
			var from_json = JsonSerializer.Deserialize<InkBallPathViewModel>(path.PointsAsString);

			jsonPathHandler(path, from_json);

			createPathPointCollectionHandler(path, from_json);

			return path;
		}

		protected internal async Task<IEnumerable<InkBallPath>> GetPathsFromDatabaseAsync(int iGameID, bool reserializeJsonPath,
			bool createPathPointCollection, CancellationToken token = default)
		{
			///Detect type of operation to pre-perform on paths:
			/// - reconstruct full JSON path or not
			/// - construct points collection form string point representation or not
			Action<InkBallPath, InkBallPathViewModel> jsonPath_Handler = reserializeJsonPath ?
				jsonPath_HandlerImpl : (_, _) => { /* dummy empty body*/ };
			Action<InkBallPath, InkBallPathViewModel> createPathPointCollection_Handler = createPathPointCollection ?
				createPathPointCollection_HandlerImpl : (_, _) => { /* dummy empty body*/ };

			var paths = await InkBallPath.AsNoTracking()
				 .Where(pa => pa.iGameId == iGameID)
				 .Select(m => LoadPointsInPathFromJson(m, jsonPath_Handler, createPathPointCollection_Handler))
				 .ToListAsync(token);

			return paths;

			//
			// private functions
			//
			///Reconstruct full JSON path 
			static void jsonPath_HandlerImpl(InkBallPath path, InkBallPathViewModel fromJson)
			{
				fromJson.iId = path.iId;
				fromJson.iGameId = 0;
				fromJson.iPlayerId = path.iPlayerId;

				//var reserialized = JsonSerializer.Serialize(fromJson, new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
				var reserialized = JsonSerializer.Serialize(fromJson, _ignoreDefaultsSerializerOptions);

				path.PointsAsString = reserialized;
			}

			///Construct points collection form string point representation
			static void createPathPointCollection_HandlerImpl(InkBallPath path, InkBallPathViewModel fromJson)
			{
				path.InkBallPoint = fromJson
					.InkBallPoint.Select(c => new InkBallPoint
					{
						//iId = c.iId,
						//iGameId = c.iGameId,
						//iPlayerId = c.iPlayerId,
						iX = c.iX,
						iY = c.iY,
						Status = c.Status,
						iEnclosingPathId = path.iId
					}).ToList();
			}
		}

		public async Task<(IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points)> LoadPointsAndPathsAsync(int iGameID,
			CancellationToken token = default, bool reserializeJsonPath = true, bool createPathPointCollection = false)
		{
			var points = await GetPointsFromDatabaseAsync(iGameID, token);
			var paths = await GetPathsFromDatabaseAsync(iGameID, reserializeJsonPath, createPathPointCollection, token);

			return (paths, points);
		}

		public async Task<IEnumerable<(int, string, int, int, int, int)>> GetPlayerStatisticTableAsync()
		{
			var query = this.InkBallPlayer
				.Select(ip => ValueTuple.Create(
							ip.iId,
							//ip.iUserId,
							ip.UserName,
							ip.iWinCount,
							ip.iLossCount,
							ip.iDrawCount,
							this.InkBallGame.Count(g => g.iPlayer1Id == ip.iId || g.iPlayer2Id == ip.iId)
						));

			return await query.ToArrayAsync();
		}

		#endregion Business logic methods
	}

	#region Helpers

	public interface IPointAndPathCounter
	{
		ValueTask<int> GetThisPlayerPathCountAsync();
		ValueTask<int> GetOtherPlayerPathCountAsync();
		ValueTask<int> GetOtherPlayerOwnedPointCountAsync();
		ValueTask<int> GetThisPlayerOwnedPointCountAsync();
	}

	public sealed class StatisticalPointAndPathCounter : IPointAndPathCounter
	{
		Dictionary<int, int> _pathCountsDict;
		Dictionary<InkBallPoint.StatusEnum, int> _ownedCountsDict;
		readonly GamesContext _dbContext;
		readonly int _gameID, _thisPlayerID, _otherPlayerID;
		readonly InkBallPoint.StatusEnum _thisPlayerOwningColor, _otherPlayerOwningColor;
		readonly CancellationToken _token;

		public StatisticalPointAndPathCounter(GamesContext dbContext, int gameID,
			int thisPlayerID, int otherPlayerID,
			ref InkBallPoint.StatusEnum thisPlayerOwningColor, ref InkBallPoint.StatusEnum otherPlayerOwningColor,
			ref CancellationToken token)
		{
			_dbContext = dbContext;
			_gameID = gameID;
			_thisPlayerID = thisPlayerID;
			_otherPlayerID = otherPlayerID;
			_thisPlayerOwningColor = thisPlayerOwningColor;
			_otherPlayerOwningColor = otherPlayerOwningColor;
			_token = token;
		}

		async ValueTask<int> GetPathCountAsync(int searchPlayerID)
		{
			if (_pathCountsDict == null)
			{
				_pathCountsDict = await (from pa in _dbContext.InkBallPath
										 where pa.iGameId == _gameID
										 group pa by pa.iPlayerId into g
										 select new
										 {
											 playerId = g.Key,
											 pathCount = g.Count()
										 })
										 .ToDictionaryAsync(k => k.playerId, v => v.pathCount, _token);
			}

			if (_pathCountsDict.TryGetValue(searchPlayerID, out var count))
				return count;
			return 0;
		}

		async ValueTask<int> OwnedPointCountAsync(InkBallPoint.StatusEnum searchedOwningColor)
		{
			if (_ownedCountsDict == null)
			{
				var statuses = new[] { InkBallPoint.StatusEnum.POINT_OWNED_BY_RED, InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE };

				_ownedCountsDict = await (from pt in _dbContext.InkBallPoint
										  where pt.iGameId == _gameID && pt.iEnclosingPathId.HasValue &&
										  statuses.Contains(pt.Status)
										  group pt by pt.Status into g
										  select new
										  {
											  owningColor = g.Key,
											  ownedCount = g.Count()
										  })
										  .ToDictionaryAsync(k => k.owningColor, v => v.ownedCount, _token);
			}

			if (_ownedCountsDict.TryGetValue(searchedOwningColor, out var count))
				return count;
			return 0;
		}

		public ValueTask<int> GetOtherPlayerOwnedPointCountAsync()
		{
			return this.OwnedPointCountAsync(_otherPlayerOwningColor);
		}

		public ValueTask<int> GetThisPlayerOwnedPointCountAsync()
		{
			return this.OwnedPointCountAsync(_thisPlayerOwningColor);
		}

		public ValueTask<int> GetThisPlayerPathCountAsync()
		{
			return this.GetPathCountAsync(_thisPlayerID);
		}

		public ValueTask<int> GetOtherPlayerPathCountAsync()
		{
			return this.GetPathCountAsync(_otherPlayerID);
		}
	}

	#endregion Helpers
}
