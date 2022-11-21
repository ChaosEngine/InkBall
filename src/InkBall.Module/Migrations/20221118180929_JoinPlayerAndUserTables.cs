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
	public partial class JoinPlayerAndUserTables : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<string>(
				name: "UserName",
				table: "InkBallPlayer",
				nullable: true);

			migrationBuilder.AddColumn<int>(
				name: "iPrivileges",
				table: "InkBallPlayer",
				nullable: false,
				defaultValue: 0);

			migrationBuilder.AddColumn<string>(
				name: "sExternalId",
				table: "InkBallPlayer",
				nullable: true);

			migrationBuilder.DropForeignKey(
				name: "InkBallPlayer_ibfk_1",
				table: "InkBallPlayer");

			migrationBuilder.DropIndex(
				name: "ByUser",
				table: "InkBallPlayer");

			migrationBuilder.DropIndex(
				name: "sExternalId",
				table: "InkBallUsers");

			//Copy new column values from Users to Player
#if INCLUDE_MYSQL
			//for Mysql the quote character is ` and for other "
			char q = migrationBuilder.IsMySql() ? '`' : '\"';
#else
			char q = '\"';
#endif
			migrationBuilder.Sql(
@$"
UPDATE {q}InkBallPlayer{q} SET
{q}iPrivileges{q} = (SELECT	{q}iPrivileges{q}
	FROM {q}InkBallUsers{q} u
	WHERE {q}InkBallPlayer{q}.{q}iUserID{q} = u.{q}iId{q}),
{q}sExternalId{q} = (SELECT {q}sExternalId{q}
	FROM {q}InkBallUsers{q} u
	WHERE {q}InkBallPlayer{q}.{q}iUserID{q} = u.{q}iId{q}),
{q}UserName{q} = (SELECT {q}UserName{q}
	FROM {q}InkBallUsers{q} u
	WHERE {q}InkBallPlayer{q}.{q}iUserID{q} = u.{q}iId{q});
");

			migrationBuilder.Sql(
@$"
UPDATE {q}InkBallPlayer{q} SET
{q}iUserID{q} = null;
");

			migrationBuilder.DropColumn(
				name: "iUserID",
				table: "InkBallPlayer");

			migrationBuilder.CreateIndex(
				name: "sExternalId",
				table: "InkBallPlayer",
				column: "sExternalId",
				unique: true);

			migrationBuilder.DropTable(
				name: "InkBallUsers");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
				name: "InkBallUsers",
				columns: table => new
				{
					iId = table.Column<int>(nullable: false)
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
					,
					iPrivileges = table.Column<int>(nullable: false, defaultValue: 0)
						.Annotation("Sqlite:Autoincrement", true),
					sExternalId = table.Column<string>(nullable: true),
					UserName = table.Column<string>(maxLength: 256, nullable: true),
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_InkBallUsers", x => x.iId);
				});

			migrationBuilder.DropIndex(
				name: "sExternalId",
				table: "InkBallPlayer");
			
			migrationBuilder.AddColumn<int>(
				name: "iUserID",
				table: "InkBallPlayer",
				nullable: true);

			//Copy old column values from Player to Users
#if INCLUDE_MYSQL
			//for Mysql the quote character is ` and for other "
			char q = migrationBuilder.IsMySql() ? '`' : '\"';
#else
			char q = '\"';
#endif
			migrationBuilder.Sql(
@$"
INSERT INTO {q}InkBallUsers{q} ({q}UserName{q}, {q}iPrivileges{q}, {q}sExternalId{q})
SELECT {q}UserName{q}, {q}iPrivileges{q}, {q}sExternalId{q}
FROM {q}InkBallPlayer{q}
");

			migrationBuilder.Sql(
@$"
UPDATE {q}InkBallPlayer{q} SET
{q}iUserID{q} = (SELECT	{q}iId{q}
	FROM {q}InkBallUsers{q} u
	WHERE {q}InkBallPlayer{q}.{q}UserName{q} = u.{q}UserName{q}
	AND {q}InkBallPlayer{q}.{q}iPrivileges{q} = u.{q}iPrivileges{q}
	AND ( {q}InkBallPlayer{q}.{q}sExternalId{q} = u.{q}sExternalId{q} OR {q}InkBallPlayer{q}.{q}iId{q} = -1 )
)
");

			migrationBuilder.DropColumn(
				name: "UserName",
				table: "InkBallPlayer");

			migrationBuilder.DropColumn(
				name: "iPrivileges",
				table: "InkBallPlayer");

			migrationBuilder.DropColumn(
				name: "sExternalId",
				table: "InkBallPlayer");

			migrationBuilder.CreateIndex(
				name: "ByUser",
				table: "InkBallPlayer",
				column: "iUserID");

			migrationBuilder.CreateIndex(
				name: "sExternalId",
				table: "InkBallUsers",
				column: "sExternalId",
				unique: true);

			migrationBuilder.AddForeignKey(
				name: "InkBallPlayer_ibfk_1",
				table: "InkBallPlayer",
				column: "iUserID",
				principalTable: "InkBallUsers",
				principalColumn: "iId");
		}
	}
}
