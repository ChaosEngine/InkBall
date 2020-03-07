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
    [Migration("20200301221546_CpuOponent")]
    partial class CpuOponent
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.2");

			modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<DateTime>("CreateTime");

				b.Property<string>("GameState")
					.HasMaxLength(256)
					.IsRequired();

				b.Property<string>("GameType")
					.HasMaxLength(256)
					.IsRequired();

				b.Property<DateTime>("TimeStamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasColumnType(GamesContext.TimeStampColumnTypeFromProvider(this.ActiveProvider))
					.HasDefaultValueSql(GamesContext.TimeStampDefaultValueFromProvider(this.ActiveProvider));

				b.Property<bool>("bIsPlayer1Active")
					.ValueGeneratedOnAdd()
					.HasColumnName("bIsPlayer1Active")
					.HasDefaultValue(1);

				b.Property<int>("iBoardHeight")
					.ValueGeneratedOnAdd()
					.HasColumnName("iBoardHeight")
					.HasDefaultValue(26);

				b.Property<int>("iBoardWidth")
					.ValueGeneratedOnAdd()
					.HasColumnName("iBoardWidth")
					.HasDefaultValue(20);

				b.Property<int>("iGridSize")
					.ValueGeneratedOnAdd()
					.HasColumnName("iGridSize")
					.HasDefaultValue(16);

				b.Property<int>("iPlayer1Id")
					.HasColumnName("iPlayer1ID");

				b.Property<int?>("iPlayer2Id")
					.HasColumnName("iPlayer2ID");

				// b.Property<bool>("CpuOponent")
				// 	.ValueGeneratedOnAdd()
				// 	.HasColumnName("CpuOponent")
				// 	.HasDefaultValue(0);

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
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<int>("iGameId")
					.HasColumnName("iGameID");

				b.Property<int>("iPlayerId")
					.HasColumnName("iPlayerID");

				b.Property<string>("PointsAsString")
					.HasColumnName("PointsAsString")
					.HasColumnType(GamesContext.JsonColumnTypeFromProvider(this.ActiveProvider));

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
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
					.HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

				b.Property<DateTime>("TimeStamp")
					.ValueGeneratedOnAddOrUpdate()
					.HasColumnType(GamesContext.TimeStampColumnTypeFromProvider(this.ActiveProvider))
					.HasDefaultValueSql(GamesContext.TimeStampDefaultValueFromProvider(this.ActiveProvider));

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
					.HasColumnType(GamesContext.JsonColumnTypeFromProvider(this.ActiveProvider));

				b.HasKey("iId");

				b.HasIndex("iUserId")
					.HasName("ByUser");

				b.ToTable("InkBallPlayer");

                b.HasData(
                    new
                    {
                        iId = -1,
                        TimeStamp = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                        iDrawCount = 0,
                        iLossCount = 0,
                        iUserId = -1,
                        iWinCount = 0,
                        sLastMoveCode = "{}"
                    });
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

			modelBuilder.Entity("InkBall.Module.Model.InkBallUser", b =>
			{
				b.Property<int>("iId")
					.ValueGeneratedOnAdd()
					.HasColumnName("iId")
					.HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
					.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
					.HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_ORACLE
					.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
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

                b.HasData(
                    new
                    {
                        iId = -1,
                        UserName = "Multi CPU Oponent UserPlayer",
                        iPrivileges = 1
                    });
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

#pragma warning restore 612, 618
        }
    }
}
