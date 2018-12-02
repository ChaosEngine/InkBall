using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using System.Threading;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Collections.Generic;
using static InkBall.Module.Model.InkBallGame;

namespace InkBall.Module.Model
{
	public interface IGamesContext
	{
		DbSet<InkBallGame> InkBallGame { get; set; }
		DbSet<InkBallPath> InkBallPath { get; set; }
		DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		DbSet<InkBallPoint> InkBallPoint { get; set; }
		DbSet<InkBallPointsInPath> InkBallPointsInPath { get; set; }
		DbSet<InkBallUser> InkBallUsers { get; set; }
	}

	public partial class GamesContext : DbContext, IGamesContext
	{
		private static DateTimeToBytesConverter _sqlServerDateTimeToBytesConverter;

		public virtual DbSet<InkBallGame> InkBallGame { get; set; }
		public virtual DbSet<InkBallPath> InkBallPath { get; set; }
		public virtual DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		public virtual DbSet<InkBallPoint> InkBallPoint { get; set; }
		public virtual DbSet<InkBallPointsInPath> InkBallPointsInPath { get; set; }
		public virtual DbSet<InkBallUser> InkBallUsers { get; set; }

		public GamesContext(DbContextOptions<GamesContext> options) : base(options)
		{
		}

		#region Helpers

		internal static string TimeStampInitialValueFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return null;

				case "Pomelo.EntityFrameworkCore.MySql":
					return "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";

				case "Microsoft.EntityFrameworkCore.Sqlite":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					return "CURRENT_TIMESTAMP";

				default:
					throw new NotSupportedException($"Bad DBKind name");
			}
		}

		internal ValueConverter TimeStampValueConverterFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					if (_sqlServerDateTimeToBytesConverter == null)
						_sqlServerDateTimeToBytesConverter = new DateTimeToBytesConverter();
					return _sqlServerDateTimeToBytesConverter;

				case "Microsoft.EntityFrameworkCore.Sqlite":
				case "Pomelo.EntityFrameworkCore.MySql":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					return null;

				default:
					throw new NotSupportedException($"Bad DBKind name");
			}
		}

		/*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            }
        }*/

		#endregion Helpers

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<InkBallGame>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iPlayer1Id)
					.HasName("ByPlayer1");

				entity.HasIndex(e => e.iPlayer2Id)
					.HasName("ByPlayer2");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

				entity.Property(e => e.bIsPlayer1Active)
					.HasColumnName("bIsPlayer1Active")
					.HasDefaultValue(true);

				entity.Property(e => e.CreateTime).HasColumnType("datetime");

				entity.Property(e => e.iBoardHeight)
					.HasColumnName("iBoardHeight")
					.HasDefaultValue(800);

				entity.Property(e => e.iBoardWidth)
					.HasColumnName("iBoardWidth")
					.HasDefaultValue(600);

				entity.Property(e => e.GameType)
					//.HasMaxLength(50)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallGame.GameTypeEnum)Enum.Parse(typeof(InkBallGame.GameTypeEnum), v));

				entity.Property(e => e.GameState)
					//.HasMaxLength(50)
					//.IsUnicode(false)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallGame.GameStateEnum)Enum.Parse(typeof(InkBallGame.GameStateEnum), v));

				entity.Property(e => e.iGridSize)
					.HasColumnName("iGridSize")
					.HasDefaultValue(15);

				entity.Property(e => e.iPlayer1Id).HasColumnName("iPlayer1ID");

				entity.Property(e => e.iPlayer2Id).HasColumnName("iPlayer2ID");

				entity.Property(e => e.TimeStamp)
					.HasColumnType("timestamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampInitialValueFromProvider(Database.ProviderName))
					.HasConversion(TimeStampValueConverterFromProvider(Database.ProviderName));

				entity.HasOne(d => d.Player1)
					.WithMany(p => p.InkBallGameIPlayer1)
					.HasForeignKey(d => d.iPlayer1Id)
					.OnDelete(DeleteBehavior.ClientSetNull)
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
					.HasName("IDX_InkBallPath_ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasName("IDX_InkBallPath_ByPlayer");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPath_ibfk_1");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPath)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPath_ibfk_2");
			});

			modelBuilder.Entity<InkBallPlayer>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iUserId)
					.HasName("ByUser");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

				entity.Property(e => e.iUserId)
					.HasColumnName("iUserID");

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
					.HasColumnType("varchar(1000)");

				entity.Property(e => e.TimeStamp)
					.HasColumnType("timestamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampInitialValueFromProvider(Database.ProviderName))
					.HasConversion(TimeStampValueConverterFromProvider(Database.ProviderName));

				entity.HasOne(d => d.User)
					.WithMany(p => p.InkBallPlayer)
					.HasPrincipalKey(u => u.iId)
					.HasForeignKey(pd => pd.iUserId)
					.HasConstraintName("InkBallPlayer_ibfk_1");
			});

			modelBuilder.Entity<InkBallPoint>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iEnclosingPathId)
					.HasName("ByEnclosingPath");

				entity.HasIndex(e => e.iGameId)
					.HasName("IDX_InkBallPoint_ByGame");

				entity.HasIndex(e => e.iPlayerId)
					.HasName("IDX_InkBallPoint_ByPlayer");

				entity.Property(e => e.iId).HasColumnName("iId");

				entity.Property(e => e.iEnclosingPathId).HasColumnName("iEnclosingPathId");

				entity.Property(e => e.iGameId).HasColumnName("iGameID");

				entity.Property(e => e.iPlayerId).HasColumnName("iPlayerID");

				entity.Property(e => e.iX).HasColumnName("iX");

				entity.Property(e => e.iY).HasColumnName("iY");

				entity.Property(e => e.Status)
					.HasConversion(
						v => v.ToString(),
						v => (InkBallPoint.StatusEnum)Enum.Parse(typeof(InkBallPoint.StatusEnum), v));

				entity.HasOne(d => d.EnclosingPath)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iEnclosingPathId)
					.HasConstraintName("InkBallPoint_ibfk_5");

				entity.HasOne(d => d.Game)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iGameId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPoint_ibfk_3");

				entity.HasOne(d => d.Player)
					.WithMany(p => p.InkBallPoint)
					.HasForeignKey(d => d.iPlayerId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPoint_ibfk_4");
			});

			modelBuilder.Entity<InkBallPointsInPath>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.iPathId)
					.HasName("ByPath");

				entity.HasIndex(e => e.iPointId)
					.HasName("ByPoint");

				entity.Property(e => e.iId).HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

				entity.Property(e => e.iPathId).HasColumnName("iPathId");

				entity.Property(e => e.iPointId).HasColumnName("iPointId");

				entity.HasOne(d => d.Path)
					.WithMany(p => p.InkBallPointsInPath)
					.HasForeignKey(d => d.iPathId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPointsInPath_ibfk_1");

				entity.HasOne(d => d.Point)
					.WithMany(p => p.InkBallPointsInPath)
					.HasForeignKey(d => d.iPointId)
					.OnDelete(DeleteBehavior.ClientSetNull)
					.HasConstraintName("InkBallPointsInPath_ibfk_2");
			});

			modelBuilder.Entity<InkBallUser>(entity =>
			{
				entity.HasKey(e => e.iId);

				entity.HasIndex(e => e.sExternalId)
					.HasName("sExternalId")
					.IsUnique();

				entity.Property(e => e.iId)
					.HasColumnName("iId")
					.ValueGeneratedOnAdd()
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

				entity.Property(e => e.iPrivileges)
					.HasColumnName("iPrivileges")
					.HasDefaultValue(0);
			});
		}













		#region WIP

		public async Task<InkBallGame> CreateNewGameFromExternalUserIDAsync(string sPlayer1ExternaUserID, InkBallGame.GameStateEnum gameState, InkBallGame.GameTypeEnum gameType,
			int gridSize, int width, int height, bool bIsPlayer1Active = true, CancellationToken token = default)
		{
			try
			{
				if (!string.IsNullOrEmpty(sPlayer1ExternaUserID))
				{
					var dbPlayer1 = await CreateNewPlayerFromExternalUserIDAsync(sPlayer1ExternaUserID, "", token);
				}
			}
			catch (Exception ex)
			{
				throw new Exception("Could not create user of that ID", ex);
			}



			int game_id = await PrivInkBallGameInsertAsync(null, sPlayer1ExternaUserID, null, null, gridSize, width, height, bIsPlayer1Active, gameState, gameType);

			if (game_id <= -1)
				throw new Exception("Could not create new game");

			var new_game = await GetGameFromDatabaseAsync(game_id, true);
			return new_game;


			async Task<int> PrivInkBallGameInsertAsync(
				int? iPlayer1ID, string iPlayer1ExternalUserID,
				int? iPlayer2ID, string iPlayer2ExternalUserID,
				int iGridSize, int iBoardWidth, int iBoardHeight, bool bIsPlayer1ActiveHere,
				InkBallGame.GameStateEnum GameState, InkBallGame.GameTypeEnum GameType)
			{
				var cp1_query = from cp1 in this.InkBallPlayer.Include(u => u.User)
								where ((!iPlayer1ID.HasValue || cp1.iId == iPlayer1ID.Value)
								&& (string.IsNullOrEmpty(iPlayer1ExternalUserID) || cp1.User.sExternalId == iPlayer1ExternalUserID)
								&& (iPlayer1ID.HasValue || !string.IsNullOrEmpty(iPlayer1ExternalUserID)))
								&& !InkBallGame.Any(tmp => (tmp.iPlayer1Id == cp1.iId || tmp.iPlayer2Id == cp1.iId)
									&& (tmp.GameState == Module.Model.InkBallGame.GameStateEnum.ACTIVE || tmp.GameState == Module.Model.InkBallGame.GameStateEnum.AWAITING))

								select (int?)cp1.iId;
				int? p1 = await cp1_query.FirstOrDefaultAsync(token);

				var cp2_query = from cp2 in this.InkBallPlayer.Include(u => u.User)
								where ((!iPlayer2ID.HasValue || cp2.iId == iPlayer2ID.Value)
								&& (string.IsNullOrEmpty(iPlayer2ExternalUserID) || cp2.User.sExternalId == iPlayer2ExternalUserID)
								&& (iPlayer2ID.HasValue || !string.IsNullOrEmpty(iPlayer2ExternalUserID)))
								&& !InkBallGame.Any(tmp => (tmp.iPlayer1Id == cp2.iId || tmp.iPlayer2Id == cp2.iId)
									&& (tmp.GameState == Module.Model.InkBallGame.GameStateEnum.ACTIVE || tmp.GameState == Module.Model.InkBallGame.GameStateEnum.AWAITING))

								select (int?)cp2.iId;
				int? p2 = await cp2_query.FirstOrDefaultAsync(token);


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
						//TimeStamp = DateTime.UtcNow,
						CreateTime = DateTime.UtcNow,
					};
					await InkBallGame.AddAsync(gm, token);

					await SaveChangesAsync(true, token);

					// select LAST_INSERT_ID() as iGameID, p1 as iPlayer1ID, p2 as iPlayer2ID, iGridSize,
					// 	iBoardWidth, iBoardHeight, bIsPlayer1Active, GameState;
					return gm.iId;
				}
				else
				{
					// select -1 as iGameID, p1 as iPlayer1ID, p2 as iPlayer2ID, iGridSize, iBoardWidth, iBoardHeight,
					// 	bIsPlayer1Active, GameState;
					return -1;
				}
			}
		}

		public async Task<InkBallGame> GetGameFromDatabaseAsync(int iID, bool bIsPlayer1, CancellationToken token = default)
		{
			var query = from g in InkBallGame
							.Include(gp1 => gp1.Player1)
								.ThenInclude(p1 => p1.User)
							.Include(gp2 => gp2.Player2)
								.ThenInclude(p2 => p2.User)
							.Include(pt => pt.InkBallPoint)
							.Include(pa => pa.InkBallPath)
						where g.iId == iID
						select g;

			return await query.FirstOrDefaultAsync(token);
		}

		private async Task<InkBallPlayer> CreateNewPlayerFromExternalUserIDAsync(string sExternalId, string sLastMoveCode, CancellationToken token = default)
		{
			var query = from p in this.InkBallPlayer.Include(x => x.User)
						where p.User.sExternalId == sExternalId
						select p;
			var player = await query.FirstOrDefaultAsync(token);
			if (player == null)
			{
				var new_user_id = await this.InkBallUsers.FirstOrDefaultAsync(x => x.sExternalId == sExternalId, token);
				player = new InkBallPlayer
				{
					iUserId = new_user_id.iId,
					sLastMoveCode = sLastMoveCode,
					iWinCount = 0,
					iLossCount = 0,
					iDrawCount = 0,
					//TimeStamp = DateTime.UtcNow
				};
				await this.InkBallPlayer.AddAsync(player, token);
			}
			else
			{
				player.sLastMoveCode = sLastMoveCode;
			}
			await this.SaveChangesAsync(true, token);

			return player;
		}

		public void SurrenderGameFromPlayer<P>(IGame<P> game) where P : IPlayer
		{
			//TODO: implement this
		}

		public async Task<IEnumerable<InkBallGame>> GetGamesForRegistrationAsSelectTableRowsAsync(
			int? iGameID = null, int? iUserID = null, string sExternalUserId = null, bool? bShowOnlyActive = true,
			CancellationToken token = default)
		{
			var query = from ig in InkBallGame
						.Include(ip1 => ip1.Player1)
							.ThenInclude(u1 => u1.User)
						.Include(ip2 => ip2.Player2)
							.ThenInclude(u2 => u2.User)
						where (!iGameID.HasValue || ig.iId == iGameID.Value)
							&& (!bShowOnlyActive.HasValue ||
								(bShowOnlyActive.Value == true && (ig.GameState == GameStateEnum.ACTIVE || ig.GameState == GameStateEnum.AWAITING)))
							&& (!iUserID.HasValue ||
								(iUserID.Value == ig.Player1.iUserId || (ig.Player2.iUserId.HasValue && iUserID == ig.Player2.iUserId)))
							&& (string.IsNullOrEmpty(sExternalUserId) ||
								(sExternalUserId == ig.Player1.User.sExternalId || (ig.Player2.iUserId.HasValue && sExternalUserId == ig.Player2.User.sExternalId)))
						orderby ig.iId
						select ig;

			return await query.ToListAsync(token);
		}

		#endregion WIP










	}
}
