using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace InkBall.Module.Migrations
{
    public partial class CpuOponent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CpuOponent",
                table: "InkBallGame",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "InkBallUsers",
                columns: new[] { "iId", "UserName", "iPrivileges", "sExternalId" },
                values: new object[] { -1, "Multi CPU Oponent UserPlayer", 1, null });

            migrationBuilder.InsertData(
                table: "InkBallPlayer",
                columns: new[] { "iId", "iUserID", "sLastMoveCode" },
                values: new object[] { -1, -1, "{}" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CpuOponent",
                table: "InkBallGame");
        }
    }
}
