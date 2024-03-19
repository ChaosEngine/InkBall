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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "When",
                table: "InkBallPoint");

            migrationBuilder.DropColumn(
                name: "When",
                table: "InkBallPath");
        }
    }
}
