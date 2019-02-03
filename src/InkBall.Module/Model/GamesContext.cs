﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using System.Threading;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
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
		//private static DateTimeToBytesConverter _sqlServerTimestampConverter;

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

		internal static string TimeStampDefaultValueFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return "GETDATE()";

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
					//if (_sqlServerTimestampConverter == null)
					//	_sqlServerTimestampConverter = new DateTimeToBytesConverter();
					//return _sqlServerTimestampConverter;
					return null;

				case "Microsoft.EntityFrameworkCore.Sqlite":
				case "Pomelo.EntityFrameworkCore.MySql":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					return null;

				default:
					throw new NotSupportedException($"Bad DBKind name");
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
					return "timestamp";

				default:
					throw new NotSupportedException($"Bad DBKind name");
			}
		}

		internal static string JsonColumnTypeFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return "nvarchar(1000)";

				case "Pomelo.EntityFrameworkCore.MySql":
					return "json";

				case "Microsoft.EntityFrameworkCore.Sqlite":
					return "TEXT";

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					return "jsonb";

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
					.HasColumnType(TimeStampColumnTypeFromProvider(Database.ProviderName))
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampDefaultValueFromProvider(Database.ProviderName))
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
					.HasColumnType(JsonColumnTypeFromProvider(Database.ProviderName));

				entity.Property(e => e.TimeStamp)
					.HasColumnType(TimeStampColumnTypeFromProvider(Database.ProviderName))
					.ValueGeneratedOnAddOrUpdate()
					.HasDefaultValueSql(TimeStampDefaultValueFromProvider(Database.ProviderName))
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
					.HasDefaultValue(Module.Model.InkBallPoint.StatusEnum.POINT_FREE)
					.HasConversion(new EnumToNumberConverter<InkBallPoint.StatusEnum, int>());

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

				entity.Property(e => e.UserName)
					.HasColumnName("UserName");
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
					var dbPlayer1 = await CreateNewPlayerFromExternalUserIdAsync(sPlayer1ExternaUserID, "", token);
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

			//
			// private functions
			//
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
						//TimeStamp = DateTime.Now,
						CreateTime = DateTime.Now,
					};
					await InkBallGame.AddAsync(gm, token);

					await SaveChangesAsync(token);

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

			var game = await query.FirstOrDefaultAsync(token);
			game.bIsPlayer1 = bIsPlayer1;
			return game;
		}

		private async Task<InkBallPlayer> CreateNewPlayerFromExternalUserIdAsync(string sExternalId, string sLastMoveCode, CancellationToken token = default)
		{
			var query = from p in this.InkBallPlayer.Include(x => x.User)
						where p.User.sExternalId == sExternalId
						select p;
			var player = await query.FirstOrDefaultAsync(token);
			if (player == null)
			{
				var ib_user = await this.InkBallUsers.FirstOrDefaultAsync(x => x.sExternalId == sExternalId, token);
				player = new InkBallPlayer
				{
					iUserId = ib_user.iId,
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

		internal async Task<bool> JoinGameFromExternalUserIdAsync(InkBallGame game, string sPlayer2ExternaUserID, CancellationToken token = default)
		{
			if (game.GameState != GameStateEnum.AWAITING || game.Player2 != null ||
				game.Player1 == null || game.Player1.User.sExternalId == sPlayer2ExternaUserID)
			{
				throw new Exception("Wrong game state 2 join");
			}

			InkBallPlayer player2;
			try
			{
				player2 = await CreateNewPlayerFromExternalUserIdAsync(sPlayer2ExternaUserID, "", token);
			}
			catch (Exception ex)
			{
				throw new Exception("Could not create user of that ID", ex);
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

					var last_move = DateTime.Now - game.GetOtherPlayer().TimeStamp;
					if (!bForcePlayerLoose && game.IsThisPlayerActive() && last_move > InkBall.Module.Model.InkBallGame.GetDeactivationDelayInSeconds())
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

						//$sQuery = "call InkBallPlayerUpdate({$this->GetGameID()}, {$this->GetOtherPlayer()->GetPlayerID()}, null, {$this->GetOtherPlayer()->GetWinCount()}, null, null)";
						game.GetOtherPlayer().iWinCount = game.GetOtherPlayer().iWinCount + 1;
					}

					await this.SaveChangesAsync(token);

					// //remove this game in session
					// session.Remove(nameof(InkBallGameViewModel));
					break;

				case GameStateEnum.AWAITING:
					//update game(deactivate)...
					game.GameState = InkBall.Module.Model.InkBallGame.GameStateEnum.INACTIVE;

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
			int? winid;
			switch (winStatus)
			{
				case WinStatusEnum.RED_WINS:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);
					// sQuery = "call InkBallGameUpdate({this.GetGameID()}, null, null, null, null, null, null, '{this.GetState()}')";
					// Result = mysqli_query(Connection, sQuery);
					// if(Result != true)	throw new Exception("Query19 failed: " . mysqli_error(Connection));

					//...and update players statistics(highscores)
					if (game.IsThisPlayerPlayingWithRed())
					{
						game.GetPlayer().SetWinCount(game.GetPlayer().GetWinCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetPlayer().GetPlayerID()}, null, {this.GetPlayer().GetWinCount()}, null, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query20 failed: " . mysqli_error(Connection));

						game.GetOtherPlayer().SetLossCount(game.GetOtherPlayer().GetLossCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetOtherPlayer().GetPlayerID()}, null, null, {this.GetOtherPlayer().GetLossCount()}, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query21 failed: " . mysqli_error(Connection));
						winid = game.GetPlayer().iId;
					}
					else
					{
						game.GetOtherPlayer().SetWinCount(game.GetOtherPlayer().GetWinCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetOtherPlayer().GetPlayerID()}, null, {this.GetOtherPlayer().GetWinCount()}, null, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query22 failed: " . mysqli_error(Connection));

						game.GetPlayer().SetLossCount(game.GetPlayer().GetLossCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetPlayer().GetPlayerID()}, null, null, {this.GetPlayer().GetLossCount()}, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query23 failed: " . mysqli_error(Connection));
						winid = game.GetOtherPlayer().iId;
					}

					await this.SaveChangesAsync(token);

					//store this game in session
					//unset(_SESSION['InkBall']);
					// string msg = "Red wins!";
					//echo(this.CreateXMLInterruptGameResponse(msg));
					break;

				case WinStatusEnum.GREEN_WINS:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);
					// sQuery = "call InkBallGameUpdate({this.GetGameID()}, null, null, null, null, null, null, '{this.GetState()}')";
					// Result = mysqli_query(Connection, sQuery);
					// if(Result != true)	throw new Exception("Query24 failed: " . mysqli_error(Connection));

					//...and update players statistics(highscores)
					if (!game.IsThisPlayerPlayingWithRed())
					{
						game.GetPlayer().SetWinCount(game.GetPlayer().GetWinCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetPlayer().GetPlayerID()}, null, {this.GetPlayer().GetWinCount()}, null, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query25 failed: " . mysqli_error(Connection));

						game.GetOtherPlayer().SetLossCount(game.GetOtherPlayer().GetLossCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetOtherPlayer().GetPlayerID()}, null, null, {this.GetOtherPlayer().GetLossCount()}, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query26 failed: " . mysqli_error(Connection));
						winid = game.GetPlayer().iId;
					}
					else
					{
						game.GetOtherPlayer().SetWinCount(game.GetOtherPlayer().GetWinCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetOtherPlayer().GetPlayerID()}, null, {this.GetOtherPlayer().GetWinCount()}, null, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query27 failed: " . mysqli_error(Connection));

						game.GetPlayer().SetLossCount(game.GetPlayer().GetLossCount() + 1);
						// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetPlayer().GetPlayerID()}, null, null, {this.GetPlayer().GetLossCount()}, null)";
						// Result = mysqli_query(Connection, sQuery);
						// if(Result != true)	throw new Exception("Query28 failed: " . mysqli_error(Connection));
						winid = game.GetOtherPlayer().iId;
					}
					await this.SaveChangesAsync(token);

					//unset(_SESSION['InkBall']);
					//string msg = "Blue wins!";
					//echo(this.CreateXMLInterruptGameResponse(msg));
					break;

				case WinStatusEnum.DRAW_WIN:
					//update game(deactivate)...
					game.SetState(GameStateEnum.FINISHED);
					// sQuery = "call InkBallGameUpdate({this.GetGameID()}, null, null, null, null, null, null, '{this.GetState()}')";
					// Result = mysqli_query(Connection, sQuery);
					// if(Result != true)	throw new Exception("Query29 failed: " . mysqli_error(Connection));

					//...and update players statistics(highscores)
					game.GetPlayer().SetDrawCount(game.GetPlayer().GetDrawCount() + 1);
					// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetPlayer().GetPlayerID()}, null, null, null, {this.GetPlayer().GetDrawCount()})";
					// Result = mysqli_query(Connection, sQuery);
					// if(Result != true)	throw new Exception("Query30 failed: " . mysqli_error(Connection));

					game.GetOtherPlayer().SetDrawCount(game.GetOtherPlayer().GetDrawCount() + 1);
					// sQuery = "call InkBallPlayerUpdate({this.GetGameID()}, {this.GetOtherPlayer().GetPlayerID()}, null, null, null, {this.GetPlayer().GetDrawCount()})";
					// Result = mysqli_query(Connection, sQuery);
					// if(Result != true)	throw new Exception("Query31 failed: " . mysqli_error(Connection));

					await this.SaveChangesAsync(token);

					//unset(_SESSION['InkBall']);
					//string msg = "Draw";
					//echo(this.CreateXMLInterruptGameResponse(msg));
					winid = null;
					break;

				case WinStatusEnum.NO_WIN:
				default:
					winid = null;
					break;
			}
			return winid;
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

			return await query.ToArrayAsync(token);
		}

		private async Task<IEnumerable<InkBallPath>> GetPathsFromDatabaseAsync(int iGameID, IEnumerable<InkBallPoint> points, CancellationToken token = default)
		{
			var query = from pa in InkBallPath.Include(x => x.InkBallPointsInPath)
						where pa.iGameId == iGameID// && pa.iPlayerId == iPlayerID
						select pa;
			var paths_combined = await query.ToArrayAsync(token);
			return paths_combined;
		}

		private async Task<IEnumerable<InkBallPoint>> GetPointsFromDatabaseAsync(int iGameID, CancellationToken token = default)
		{
			var query = from ip in InkBallPoint
						where ip.iGameId == iGameID// && ip.iPlayerId == iPlayerID
						select ip;

			return await query.ToArrayAsync(token);
		}

		public async Task<(IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points)> LoadPointsAndPathsAsync(int iGameID, CancellationToken token = default)
		{
			var points = await GetPointsFromDatabaseAsync(iGameID, token);
			var paths = await GetPathsFromDatabaseAsync(iGameID, points, token);

			return (paths, points);
		}

		#endregion WIP










	}
}
