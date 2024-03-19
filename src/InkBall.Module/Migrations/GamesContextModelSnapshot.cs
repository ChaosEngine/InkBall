﻿// <auto-generated />
using System;
using InkBall.Module.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
#if INCLUDE_POSTGRES
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
#endif
#if INCLUDE_ORACLE
using Oracle.EntityFrameworkCore.Metadata;
#endif

#nullable disable

namespace InkBall.Module.Migrations
{
    [DbContext(typeof(GamesContext))]
    partial class GamesContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

#if INCLUDE_POSTGRES
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);
#endif

            modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
                {
                    b.Property<int>("iId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iId")
#if INCLUDE_MYSQL
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
						.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
                        .HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_ORACLE
						.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
                        ;

                    b.Property<DateTime>("CreateTime");

                    b.Property<string>("GameState")
						.HasMaxLength(256)
                        .IsRequired();

                    b.Property<string>("GameType")
						.HasMaxLength(256)
                        .IsRequired();

                    b.Property<DateTime>("TimeStamp")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp");

                    b.Property<bool>("bIsPlayer1Active")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("bIsPlayer1Active")
                        .HasDefaultValueSql("1");

                    b.Property<int>("iBoardHeight")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iBoardHeight")
                        .HasDefaultValueSql("'26'");

                    b.Property<int>("iBoardWidth")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iBoardWidth")
                        .HasDefaultValueSql("'20'");

                    b.Property<int>("iGridSize")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iGridSize")
                        .HasDefaultValueSql("'16'");

                    b.Property<int>("iPlayer1Id")
                        .HasColumnName("iPlayer1ID");

                    b.Property<int?>("iPlayer2Id")
                        .HasColumnName("iPlayer2ID");

                    b.HasKey("iId");

                    b.HasIndex("iPlayer1Id")
                        .HasDatabaseName("ByPlayer1");

                    b.HasIndex("iPlayer2Id")
                        .HasDatabaseName("ByPlayer2");

                    b.ToTable("InkBallGame");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPath", b =>
                {
                    b.Property<int>("iId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iId")
#if INCLUDE_MYSQL
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
						.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
                        .HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_ORACLE
						.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
                        ;

                    b.Property<int>("iGameId")
                        .HasColumnName("iGameID");

                    b.Property<int>("iPlayerId")
                        .HasColumnName("iPlayerID");

					b.Property<string>("PointsAsString")
						.HasColumnName("PointsAsString")
						.HasColumnType("varchar(1000)");

                    b.Property<DateTime>("When")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp");

					b.HasKey("iId");

                    b.HasIndex("iGameId")
                        .HasDatabaseName("IDX_InkBallPath_ByGame");

                    b.HasIndex("iPlayerId")
                        .HasDatabaseName("IDX_InkBallPath_ByPlayer");

                    b.ToTable("InkBallPath");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPlayer", b =>
                {
                    b.Property<int>("iId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iId")
#if INCLUDE_MYSQL
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
						.HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
                        .HasAnnotation("Sqlite:Autoincrement", true)
#if INCLUDE_ORACLE
						.HasAnnotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
                        ;

                    b.Property<DateTime>("TimeStamp")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp");

                    b.Property<int>("iDrawCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iDrawCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<int>("iLossCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iLossCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<int>("iPrivileges")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iPrivileges")
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("sExternalId");

                    b.HasIndex("sExternalId")
                        .IsUnique()
                        .HasDatabaseName("sExternalId");

                    b.Property<string>("UserName")
                        .HasColumnName("UserName");

                    b.Property<int>("iWinCount")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("iWinCount")
                        .HasDefaultValueSql("'0'");

                    b.Property<string>("sLastMoveCode")
                        .HasColumnName("sLastMoveCode")
                        .HasColumnType("varchar(1000)");

                    b.HasKey("iId");

                    b.ToTable("InkBallPlayer");
                    
					b.HasData(
                        new
                        {
                            iId = -1,
                            TimeStamp = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            iDrawCount = 0,
                            iLossCount = 0,
                            iWinCount = 0,
							UserName = InkBallPlayer.CPUOponentPlayerName,
                            iPrivileges = 1,
                            sLastMoveCode = "{}"
                        });
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPoint", b =>
                {
                    b.Property<int>("Status")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasDefaultValue((int)InkBallPoint.StatusEnum.POINT_FREE);

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

                    b.Property<DateTime>("When")
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("timestamp");

                    b.HasKey("iGameId", "iX", "iY");

                    b.HasIndex("iEnclosingPathId")
                        .HasDatabaseName("ByEnclosingPath");

                    b.HasIndex("iPlayerId")
                        .HasDatabaseName("IDX_InkBallPoint_ByPlayer");

                    b.ToTable("InkBallPoint");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
                {
                    b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player1")
                        .WithMany("InkBallGameIPlayer1")
                        .HasForeignKey("iPlayer1Id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("InkBallGame_ibfk_1");

                    b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player2")
                        .WithMany("InkBallGameIPlayer2")
                        .HasForeignKey("iPlayer2Id")
                        .HasConstraintName("InkBallGame_ibfk_2");

                    b.Navigation("Player1");

                    b.Navigation("Player2");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPath", b =>
                {
                    b.HasOne("InkBall.Module.Model.InkBallGame", "Game")
                        .WithMany("InkBallPath")
                        .HasForeignKey("iGameId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("InkBallPath_ibfk_1");

                    b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player")
                        .WithMany("InkBallPath")
                        .HasForeignKey("iPlayerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("InkBallPath_ibfk_2");

                    b.Navigation("Game");

                    b.Navigation("Player");
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
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("InkBallPoint_ibfk_3");

                    b.HasOne("InkBall.Module.Model.InkBallPlayer", "Player")
                        .WithMany("InkBallPoint")
                        .HasForeignKey("iPlayerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired()
                        .HasConstraintName("InkBallPoint_ibfk_4");

                    b.Navigation("EnclosingPath");

                    b.Navigation("Game");

                    b.Navigation("Player");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallGame", b =>
                {
                    b.Navigation("InkBallPath");

                    b.Navigation("InkBallPoint");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPath", b =>
                {
                    b.Navigation("InkBallPoint");
                });

            modelBuilder.Entity("InkBall.Module.Model.InkBallPlayer", b =>
                {
                    b.Navigation("InkBallGameIPlayer1");

                    b.Navigation("InkBallGameIPlayer2");

                    b.Navigation("InkBallPath");

                    b.Navigation("InkBallPoint");
                });
#pragma warning restore 612, 618
        }
    }
}
