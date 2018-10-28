﻿using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace InkBall.Module
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
		public virtual DbSet<InkBallGame> InkBallGame { get; set; }
		public virtual DbSet<InkBallPath> InkBallPath { get; set; }
		public virtual DbSet<InkBallPlayer> InkBallPlayer { get; set; }
		public virtual DbSet<InkBallPoint> InkBallPoint { get; set; }
		public virtual DbSet<InkBallPointsInPath> InkBallPointsInPath { get; set; }
		public virtual DbSet<InkBallUser> InkBallUsers { get; set; }

		public GamesContext(DbContextOptions<GamesContext> options) : base(options)
		{
		}

		internal static string TimeStampInitialValueFromProvider(string activeProvider)
		{
			switch (activeProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
					return "CURRENT_TIMESTAMP";
				case "Microsoft.EntityFrameworkCore.SqlServer":
					return null;
				case "Pomelo.EntityFrameworkCore.MySql":
					return "CURRENT_TIMESTAMP";
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					return "CURRENT_TIMESTAMP";
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
					.ValueGeneratedOnAddOrUpdate();

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
					.HasDefaultValueSql(TimeStampInitialValueFromProvider(Database.ProviderName));

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
	}
}
