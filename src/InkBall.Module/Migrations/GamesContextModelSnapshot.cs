﻿// <auto-generated />
using System;
using InkBall.Module;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace InkBall.Module.Migrations
{
    [DbContext(typeof(GamesContext))]
    partial class GamesContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("InkBall.Module.InkBallGame", b =>
                {
                    b.Property<int>("iId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iId")
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                        .HasAnnotation("Sqlite:Autoincrement", true)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime");

                    b.Property<string>("GameState")
                        .IsRequired();

                    b.Property<string>("GameType")
                        .IsRequired();

                    b.Property<DateTime>("TimeStamp")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<bool>("bIsPlayer1Active")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("bIsPlayer1Active")
                        .HasDefaultValueSql("'1'");

                    b.Property<int>("iBoardHeight")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iBoardHeight")
                        .HasDefaultValueSql("'800'");

                    b.Property<int>("iBoardWidth")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iBoardWidth")
                        .HasDefaultValueSql("'600'");

                    b.Property<int>("iGridSize")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iGridSize")
                        .HasDefaultValueSql("'15'");

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

            modelBuilder.Entity("InkBall.Module.InkBallPath", b =>
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

            modelBuilder.Entity("InkBall.Module.InkBallPlayer", b =>
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
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<int>("iDrawCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iDrawCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<int>("iLossCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iLossCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<int?>("iUserId")
                        .HasColumnName("iUserID");

                    b.Property<int>("iWinCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iWinCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("sLastMoveCode")
                        .HasColumnName("sLastMoveCode")
                        .HasColumnType("varchar(1000)");

                    b.HasKey("iId");

                    b.HasIndex("iUserId")
                        .HasName("ByUser");

                    b.ToTable("InkBallPlayer");
                });

            modelBuilder.Entity("InkBall.Module.InkBallPoint", b =>
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

            modelBuilder.Entity("InkBall.Module.InkBallPointsInPath", b =>
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

            modelBuilder.Entity("InkBall.Module.InkBallUser", b =>
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
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("sExternalId");

                    b.HasKey("iId");

                    b.HasIndex("sExternalId")
                        .IsUnique()
                        .HasName("sExternalId");

                    b.ToTable("InkBallUsers");
                });

            modelBuilder.Entity("InkBall.Module.InkBallGame", b =>
                {
                    b.HasOne("InkBall.Module.InkBallPlayer", "Player1")
                        .WithMany("InkBallGameIPlayer1")
                        .HasForeignKey("iPlayer1Id")
                        .HasConstraintName("InkBallGame_ibfk_1");

                    b.HasOne("InkBall.Module.InkBallPlayer", "Player2")
                        .WithMany("InkBallGameIPlayer2")
                        .HasForeignKey("iPlayer2Id")
                        .HasConstraintName("InkBallGame_ibfk_2");
                });

            modelBuilder.Entity("InkBall.Module.InkBallPath", b =>
                {
                    b.HasOne("InkBall.Module.InkBallGame", "Game")
                        .WithMany("InkBallPath")
                        .HasForeignKey("iGameId")
                        .HasConstraintName("InkBallPath_ibfk_1");

                    b.HasOne("InkBall.Module.InkBallPlayer", "Player")
                        .WithMany("InkBallPath")
                        .HasForeignKey("iPlayerId")
                        .HasConstraintName("InkBallPath_ibfk_2");
                });

            modelBuilder.Entity("InkBall.Module.InkBallPlayer", b =>
                {
                    b.HasOne("InkBall.Module.InkBallUser", "User")
                        .WithMany("InkBallPlayer")
                        .HasForeignKey("iUserId")
                        .HasConstraintName("InkBallPlayer_ibfk_1");
                });

            modelBuilder.Entity("InkBall.Module.InkBallPoint", b =>
                {
                    b.HasOne("InkBall.Module.InkBallPath", "EnclosingPath")
                        .WithMany("InkBallPoint")
                        .HasForeignKey("iEnclosingPathId")
                        .HasConstraintName("InkBallPoint_ibfk_5");

                    b.HasOne("InkBall.Module.InkBallGame", "Game")
                        .WithMany("InkBallPoint")
                        .HasForeignKey("iGameId")
                        .HasConstraintName("InkBallPoint_ibfk_3");

                    b.HasOne("InkBall.Module.InkBallPlayer", "Player")
                        .WithMany("InkBallPoint")
                        .HasForeignKey("iPlayerId")
                        .HasConstraintName("InkBallPoint_ibfk_4");
                });

            modelBuilder.Entity("InkBall.Module.InkBallPointsInPath", b =>
                {
                    b.HasOne("InkBall.Module.InkBallPath", "Path")
                        .WithMany("InkBallPointsInPath")
                        .HasForeignKey("iPathId")
                        .HasConstraintName("InkBallPointsInPath_ibfk_1");

                    b.HasOne("InkBall.Module.InkBallPoint", "Point")
                        .WithMany("InkBallPointsInPath")
                        .HasForeignKey("iPointId")
                        .HasConstraintName("InkBallPointsInPath_ibfk_2");
                });
#pragma warning restore 612, 618
        }
    }
}
