using System;
using InkBall.Module.Model;
using Microsoft.EntityFrameworkCore.Migrations;

namespace InkBall.Module.Migrations
{
	public partial class CpuOponent : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.InsertData(
				table: nameof(GamesContext.InkBallUsers),
				columns: new[] { nameof(InkBallUser.iId), nameof(InkBallUser.UserName), nameof(InkBallUser.iPrivileges),
					nameof(InkBallUser.sExternalId) },
				values: new object[] { -1, InkBallPlayer.CPUOponentPlayerName, 1, null });

			migrationBuilder.InsertData(
				table: nameof(GamesContext.InkBallPlayer),
				columns: new[] { nameof(InkBallPlayer.iId), "iUserID", nameof(InkBallPlayer.sLastMoveCode) },
				values: new object[] { -1, -1, "{}" });
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DeleteData(
				table: nameof(GamesContext.InkBallPlayer),
				keyColumn: nameof(InkBallPlayer.iId),
				keyValue: -1
			);

			migrationBuilder.DeleteData(
				table: nameof(GamesContext.InkBallUsers),
				keyColumn: nameof(InkBallUser.iId),
				keyValue: -1
			);
		}
	}
}
