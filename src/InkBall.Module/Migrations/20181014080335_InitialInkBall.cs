using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace InkBall.Module.Migrations
{
    public partial class InitialInkBall : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    sUserName = table.Column<string>(type: "varchar(50)", nullable: false),
                    sPassword = table.Column<string>(type: "varchar(255)", nullable: false),
                    sPasswordSalt = table.Column<string>(type: "varchar(10)", nullable: false),
                    sName = table.Column<string>(type: "varchar(255)", nullable: true),
                    sSurname = table.Column<string>(type: "varchar(255)", nullable: true),
                    iPrivileges = table.Column<sbyte>(type: "tinyint(4)", nullable: false, defaultValueSql: "'0'")
                        .Annotation("Sqlite:Autoincrement", true),
                    id = table.Column<long>(type: "bigint(4)", nullable: false),
                    ksywa = table.Column<string>(type: "char(15)", nullable: false),
                    poczta = table.Column<string>(type: "varchar(40)", nullable: false),
                    haslo = table.Column<string>(type: "varchar(20)", nullable: false),
                    potwierdzenie = table.Column<int>(type: "int(11)", nullable: false, defaultValueSql: "'0'")
                        .Annotation("Sqlite:Autoincrement", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.iID);
                    table.UniqueConstraint("AK_users_id", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "InkBallPlayer",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    iUserID = table.Column<long>(type: "bigint(10)", nullable: true),
                    sLastMoveCode = table.Column<string>(type: "varchar(1000)", nullable: true),
                    iWinCount = table.Column<int>(type: "int(11)", nullable: false, defaultValueSql: "'0'")
                        .Annotation("Sqlite:Autoincrement", true),
                    iLossCount = table.Column<int>(type: "int(11)", nullable: false, defaultValueSql: "'0'")
                        .Annotation("Sqlite:Autoincrement", true),
                    iDrawCount = table.Column<int>(type: "int(11)", nullable: false, defaultValueSql: "'0'")
                        .Annotation("Sqlite:Autoincrement", true),
                    TimeStamp = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "'CURRENT_TIMESTAMP'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InkBallPlayer", x => x.iID);
                    table.ForeignKey(
                        name: "InkBallPlayer_ibfk_1",
                        column: x => x.iUserID,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InkBallGame",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    iPlayer1ID = table.Column<uint>(nullable: false),
                    iPlayer2ID = table.Column<uint>(nullable: true),
                    bIsPlayer1Active = table.Column<byte>(nullable: false, defaultValueSql: "'1'")
                        .Annotation("Sqlite:Autoincrement", true),
                    iGridSize = table.Column<uint>(nullable: false, defaultValueSql: "'15'")
                        .Annotation("Sqlite:Autoincrement", true),
                    iBoardWidth = table.Column<uint>(nullable: false, defaultValueSql: "'600'")
                        .Annotation("Sqlite:Autoincrement", true),
                    iBoardHeight = table.Column<uint>(nullable: false, defaultValueSql: "'800'")
                        .Annotation("Sqlite:Autoincrement", true),
                    GameType = table.Column<string>(nullable: false),
                    GameState = table.Column<string>(nullable: false),
                    TimeStamp = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "'CURRENT_TIMESTAMP'"),
                    CreateTime = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InkBallGame", x => x.iID);
                    table.ForeignKey(
                        name: "InkBallGame_ibfk_1",
                        column: x => x.iPlayer1ID,
                        principalTable: "InkBallPlayer",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "InkBallGame_ibfk_2",
                        column: x => x.iPlayer2ID,
                        principalTable: "InkBallPlayer",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InkBallPath",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    iGameID = table.Column<uint>(nullable: false),
                    iPlayerID = table.Column<uint>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InkBallPath", x => x.iID);
                    table.ForeignKey(
                        name: "InkBallPath_ibfk_1",
                        column: x => x.iGameID,
                        principalTable: "InkBallGame",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "InkBallPath_ibfk_2",
                        column: x => x.iPlayerID,
                        principalTable: "InkBallPlayer",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InkBallPoint",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    iGameID = table.Column<uint>(nullable: false),
                    iPlayerID = table.Column<uint>(nullable: false),
                    iX = table.Column<uint>(nullable: false),
                    iY = table.Column<uint>(nullable: false),
                    Status = table.Column<string>(nullable: false),
                    iEnclosingPathID = table.Column<uint>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InkBallPoint", x => x.iID);
                    table.ForeignKey(
                        name: "InkBallPoint_ibfk_5",
                        column: x => x.iEnclosingPathID,
                        principalTable: "InkBallPath",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "InkBallPoint_ibfk_3",
                        column: x => x.iGameID,
                        principalTable: "InkBallGame",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "InkBallPoint_ibfk_4",
                        column: x => x.iPlayerID,
                        principalTable: "InkBallPlayer",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InkBallPointsInPath",
                columns: table => new
                {
                    iID = table.Column<uint>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    iPathID = table.Column<uint>(nullable: false),
                    iPointID = table.Column<uint>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InkBallPointsInPath", x => x.iID);
                    table.ForeignKey(
                        name: "InkBallPointsInPath_ibfk_1",
                        column: x => x.iPathID,
                        principalTable: "InkBallPath",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "InkBallPointsInPath_ibfk_2",
                        column: x => x.iPointID,
                        principalTable: "InkBallPoint",
                        principalColumn: "iID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ByPlayer1",
                table: "InkBallGame",
                column: "iPlayer1ID");

            migrationBuilder.CreateIndex(
                name: "ByPlayer2",
                table: "InkBallGame",
                column: "iPlayer2ID");

            migrationBuilder.CreateIndex(
                name: "PathByGame",
                table: "InkBallPath",
                column: "iGameID");

            migrationBuilder.CreateIndex(
                name: "PathByPlayer",
                table: "InkBallPath",
                column: "iPlayerID");

            migrationBuilder.CreateIndex(
                name: "ByUser",
                table: "InkBallPlayer",
                column: "iUserID");

            migrationBuilder.CreateIndex(
                name: "ByEnclosingPath",
                table: "InkBallPoint",
                column: "iEnclosingPathID");

            migrationBuilder.CreateIndex(
                name: "PointByGame",
                table: "InkBallPoint",
                column: "iGameID");

            migrationBuilder.CreateIndex(
                name: "PointByPlayer",
                table: "InkBallPoint",
                column: "iPlayerID");

            migrationBuilder.CreateIndex(
                name: "ByPath",
                table: "InkBallPointsInPath",
                column: "iPathID");

            migrationBuilder.CreateIndex(
                name: "ByPoint",
                table: "InkBallPointsInPath",
                column: "iPointID");

            migrationBuilder.CreateIndex(
                name: "id",
                table: "users",
                column: "id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ByCheckersLoginFields",
                table: "users",
                columns: new[] { "poczta", "haslo", "potwierdzenie" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InkBallPointsInPath");

            migrationBuilder.DropTable(
                name: "InkBallPoint");

            migrationBuilder.DropTable(
                name: "InkBallPath");

            migrationBuilder.DropTable(
                name: "InkBallGame");

            migrationBuilder.DropTable(
                name: "InkBallPlayer");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
