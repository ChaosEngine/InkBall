﻿// <auto-generated />
using System;
using InkBall.Module.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace InkBall.Module.Migrations
{
    [DbContext(typeof(GamesContext))]
    [Migration("20181213141620_SqliteTriggers")]
    partial class SqliteTriggers
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687");

			modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<DateTime>("CreateTime");

				b.Property<string>("GameState")
					.IsRequired();

				b.Property<string>("GameType")
					.IsRequired();

				b.Property<DateTime>("TimeStamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasColumnType("timestamp")
					.HasDefaultValueSql(GamesContext.TimeStampInitialValueFromProvider(this.ActiveProvider));

				b.Property<bool>("bIsPlayer1Active")
					.ValueGeneratedOnAdd()
					.HasColumnName("bIsPlayer1Active")
					.HasDefaultValue(1);

				b.Property<int>("iBoardHeight")
					.ValueGeneratedOnAdd()
					.HasColumnName("iBoardHeight")
					.HasDefaultValue(800);

				b.Property<int>("iBoardWidth")
					.ValueGeneratedOnAdd()
					.HasColumnName("iBoardWidth")
					.HasDefaultValue(600);

				b.Property<int>("iGridSize")
					.ValueGeneratedOnAdd()
					.HasColumnName("iGridSize")
					.HasDefaultValue(15);

				b.Property<int>("iPlayer1Id")
					.HasColumnName("iPlayer1ID");

				b.Property<int?>("iPlayer2Id")
					.HasColumnName("iPlayer2ID");

				b.HasKey("iId");

				b.HasIndex("iPlayer1Id")
					.HasName("ByPlayer1");

				b.HasIndex("iPlayer2Id")
					.HasName("ByPlayer2");

				b.ToTable("InkBallGame");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPath", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<int>("iGameId")
					.HasColumnName("iGameID");

				b.Property<int>("iPlayerId")
					.HasColumnName("iPlayerID");

				b.HasKey("iId");

				b.HasIndex("iGameId")
					.HasName("IDX_InkBallPath_ByGame");

				b.HasIndex("iPlayerId")
					.HasName("IDX_InkBallPath_ByPlayer");

				b.ToTable("InkBallPath");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPlayer", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<DateTime>("TimeStamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasColumnType("timestamp")
					.HasDefaultValueSql(GamesContext.TimeStampInitialValueFromProvider(this.ActiveProvider));

				b.Property<int>("iDrawCount")
					.ValueGeneratedOnAdd()
					.HasColumnName("iDrawCount")
					.HasDefaultValue(0);

				b.Property<int>("iLossCount")
					.ValueGeneratedOnAdd()
					.HasColumnName("iLossCount")
					.HasDefaultValue(0);

				b.Property<int?>("iUserId")
					.HasColumnName("iUserID");

				b.Property<int>("iWinCount")
					.ValueGeneratedOnAdd()
					.HasColumnName("iWinCount")
					.HasDefaultValue(0);

				b.Property<string>("sLastMoveCode")
					.HasColumnName("sLastMoveCode")
					.HasColumnType("varchar(1000)");

				b.HasKey("iId");

				b.HasIndex("iUserId")
					.HasName("ByUser");

				b.ToTable("InkBallPlayer");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPoint", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId");

				b.Property<string>("Status")
					.IsRequired();

				b.Property<int?>("iEnclosingPathId")
					.HasColumnName("iEnclosingPathId");

				b.Property<int>("iGameId")
					.HasColumnName("iGameID");

				b.Property<int>("iPlayerId")
					.HasColumnName("iPlayerID");

				b.Property<int>("iX")
					.HasColumnName("iX");

				b.Property<int>("iY")
					.HasColumnName("iY");

				b.HasKey("iId");

				b.HasIndex("iEnclosingPathId")
					.HasName("ByEnclosingPath");

				b.HasIndex("iGameId")
					.HasName("IDX_InkBallPoint_ByGame");

				b.HasIndex("iPlayerId")
					.HasName("IDX_InkBallPoint_ByPlayer");

				b.ToTable("InkBallPoint");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPointsInPath", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<int>("iPathId")
					.HasColumnName("iPathId");

				b.Property<int>("iPointId")
					.HasColumnName("iPointId");

				b.HasKey("iId");

				b.HasIndex("iPathId")
					.HasName("ByPath");

				b.HasIndex("iPointId")
					.HasName("ByPoint");

				b.ToTable("InkBallPointsInPath");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallUser", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<int>("iPrivileges")
					.ValueGeneratedOnAdd()
					.HasColumnName("iPrivileges")
					.HasDefaultValue(0);

				b.Property<string>("sExternalId");

				b.HasKey("iId");

				b.HasIndex("sExternalId")
					.IsUnique()
					.HasName("sExternalId");

				b.Property<string>("UserName")
					.HasColumnName("UserName");

				b.ToTable("InkBallUsers");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
			{
				b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player1")
					.WithMany("InkBallGameIPlayer1")
					.HasForeignKey("iPlayer1Id")
					.HasConstraintName("InkBallGame_ibfk_1");

				b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player2")
					.WithMany("InkBallGameIPlayer2")
					.HasForeignKey("iPlayer2Id")
					.HasConstraintName("InkBallGame_ibfk_2");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPath", b =>
			{
				b.HasOne("InkBall.Module.Model.InkBallGame", "Game")
					.WithMany("InkBallPath")
					.HasForeignKey("iGameId")
					.HasConstraintName("InkBallPath_ibfk_1");

				b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player")
					.WithMany("InkBallPath")
					.HasForeignKey("iPlayerId")
					.HasConstraintName("InkBallPath_ibfk_2");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPlayer", b =>
			{
				b.HasOne("InkBall.Module.Model.InkBallUser", "User")
					.WithMany("InkBallPlayer")
					.HasForeignKey("iUserId")
					.HasConstraintName("InkBallPlayer_ibfk_1");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPoint", b =>
			{
				b.HasOne("InkBall.Module.Model.InkBallPath", "EnclosingPath")
					.WithMany("InkBallPoint")
					.HasForeignKey("iEnclosingPathId")
					.HasConstraintName("InkBallPoint_ibfk_5");

				b.HasOne("InkBall.Module.Model.InkBallGame", "Game")
					.WithMany("InkBallPoint")
					.HasForeignKey("iGameId")
					.HasConstraintName("InkBallPoint_ibfk_3");

				b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player")
					.WithMany("InkBallPoint")
					.HasForeignKey("iPlayerId")
					.HasConstraintName("InkBallPoint_ibfk_4");
			});

			modelBuilder.Entity("InkBall.Module.Model.InkBallPointsInPath", b =>
			{
				b.HasOne("InkBall.Module.Model.InkBallPath", "Path")
					.WithMany("InkBallPointsInPath")
					.HasForeignKey("iPathId")
					.HasConstraintName("InkBallPointsInPath_ibfk_1");

				b.HasOne("InkBall.Module.Model.InkBallPoint", "Point")
					.WithMany("InkBallPointsInPath")
					.HasForeignKey("iPointId")
					.HasConstraintName("InkBallPointsInPath_ibfk_2");
			});
#pragma warning restore 612, 618
		}
    }
}