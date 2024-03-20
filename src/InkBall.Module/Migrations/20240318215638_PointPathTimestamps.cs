using System;
using InkBall.Module.Model;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InkBall.Module.Migrations
{
	/// <inheritdoc />
	public partial class PointPathTimestamps : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<DateTime>(
				name: "When",
				table: "InkBallPoint",
				type: GamesContext.TimeStampColumnTypeFromProvider(this.ActiveProvider),
				nullable: true,
				defaultValueSql: GamesContext.TimeStampDefaultValueFromProvider(this.ActiveProvider));

			migrationBuilder.AddColumn<DateTime>(
				name: "When",
				table: "InkBallPath",
				type: GamesContext.TimeStampColumnTypeFromProvider(this.ActiveProvider),
				nullable: true,
				defaultValueSql: GamesContext.TimeStampDefaultValueFromProvider(this.ActiveProvider));



			var entity = TargetModel.FindEntityType(typeof(InkBallPoint));
			if (entity != null && entity.Name == typeof(InkBallPoint).FullName)
			{
				migrationBuilder.CreateTimestampTrigger(entity, nameof(InkBallPoint.When),
				[nameof(InkBallPoint.iGameId), nameof(InkBallPoint.iX), nameof(InkBallPoint.iY)]);
			}
			entity = TargetModel.FindEntityType(typeof(InkBallPath));
			if (entity != null && entity.Name == typeof(InkBallPath).FullName)
			{
				migrationBuilder.CreateTimestampTrigger(entity, nameof(InkBallPath.When), nameof(InkBallPath.iId));
			}
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			var entity = TargetModel.FindEntityType(typeof(InkBallPoint));
			if (entity != null && entity.Name == typeof(InkBallPoint).FullName)
			{
				migrationBuilder.DropTimestampTrigger(entity, nameof(InkBallPoint.When));
			}
			entity = TargetModel.FindEntityType(typeof(InkBallPath));
			if (entity != null && entity.Name == typeof(InkBallPath).FullName)
			{
				migrationBuilder.DropTimestampTrigger(entity, nameof(InkBallPath.When));
			}



			migrationBuilder.DropColumn(
				name: "When",
				table: "InkBallPoint");

			migrationBuilder.DropColumn(
				name: "When",
				table: "InkBallPath");
		}
	}
}
