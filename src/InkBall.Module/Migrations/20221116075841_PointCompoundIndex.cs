using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
#if INCLUDE_POSTGRES
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
#endif
#if INCLUDE_ORACLE
using Oracle.EntityFrameworkCore.Metadata;
#endif

#nullable disable

namespace InkBall.Module.Migrations
{
    /// <inheritdoc />
    public partial class PointCompoundIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_InkBallPoint",
                table: "InkBallPoint");

            migrationBuilder.DropColumn(
                name: "iId",
                table: "InkBallPoint");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InkBallPoint",
                table: "InkBallPoint",
                columns: new[] { "iGameID", "iX", "iY" });

            migrationBuilder.DropIndex(
                name: "IDX_InkBallPoint_ByGame",
                table: "InkBallPoint");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IDX_InkBallPoint_ByGame",
                table: "InkBallPoint",
                column: "iGameID");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InkBallPoint",
                table: "InkBallPoint");

            var is_sqlite = migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite";
#if INCLUDE_MYSQL
            if(migrationBuilder.IsMySql())
            {
                migrationBuilder.Sql(
                    $"ALTER TABLE `InkBallPoint` ADD `iId` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`iId`)"
                );
            }
            else
            {
                NormalPrimaryKeyCreationForIdColumn(migrationBuilder, is_sqlite);
            }
#else
            NormalPrimaryKeyCreationForIdColumn(migrationBuilder, is_sqlite);
#endif
        }

		void NormalPrimaryKeyCreationForIdColumn(MigrationBuilder migrationBuilder, bool isSqlite)
		{
            migrationBuilder.AddColumn<int>(
                name: "iId",
                table: "InkBallPoint",
                nullable: isSqlite//if sqlite must be true
                )
                .Annotation("Sqlite:Autoincrement", true)
#if INCLUDE_MYSQL
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_SQLSERVER
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_ORACLE
                .Annotation("Oracle:ValueGenerationStrategy", OracleValueGenerationStrategy.IdentityColumn)
#endif
#if INCLUDE_POSTGRES
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
#endif
            ;

            migrationBuilder.AddPrimaryKey(
                name: "PK_InkBallPoint",
                table: "InkBallPoint",
                column: "iId");
        }
	}
}
