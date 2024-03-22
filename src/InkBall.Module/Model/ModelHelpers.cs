using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq;
using System.Text;

namespace InkBall.Module.Model
{
	internal static class MigrationExtensions
	{
		internal static MigrationBuilder CreateTimestampTrigger(this MigrationBuilder migrationBuilder, IEntityType entityType,
			string timeStampColumnName, params string[] primaryKeys)
		{
			var tableName = entityType.GetTableName();
			//var primaryKey = entityType.FindPrimaryKey();

			StringBuilder prim_keys_where;

			switch (migrationBuilder.ActiveProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
					prim_keys_where = primaryKeys.Aggregate(new StringBuilder(70), (current, next) =>
					current.Append(current.Length == 0 ? "" : "AND").AppendFormat(""" "{0}" = NEW."{1}" """, next, next));
					
					//SQLite: RETURNING clause doesn't work with AFTER triggers #gh-29811
					//https://github.com/dotnet/efcore/issues/29811
					//
					string command = $"""
								CREATE TRIGGER IF NOT EXISTS "{tableName}_update_{timeStampColumnName}_Trigger"
								BEFORE UPDATE ON {tableName}
								BEGIN
									UPDATE {tableName} SET
									"{timeStampColumnName}" = datetime(CURRENT_TIMESTAMP, 'localtime')
									WHERE {prim_keys_where};
								END;
								""";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
					prim_keys_where = primaryKeys.Aggregate(new StringBuilder(70), (current, next) =>
					current.Append(current.Length == 0 ? "" : "AND").AppendFormat(""" t.[{0}] = i.[{1}] """, next, next));
					
					command = $"""
						CREATE OR ALTER TRIGGER [dbo].[{tableName}_update_{timeStampColumnName}_Trigger] ON [dbo].[{tableName}]
							AFTER UPDATE
						AS
						BEGIN
							SET NOCOUNT ON;
							IF ((SELECT TRIGGER_NESTLEVEL()) > 1) RETURN;

							UPDATE {tableName} SET
							[{timeStampColumnName}] = GETDATE()
							FROM [{tableName}] t
							INNER JOIN INSERTED i ON {prim_keys_where}
						END
						""";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Oracle.EntityFrameworkCore":
					command = $"""
						CREATE OR REPLACE TRIGGER "{tableName}_update_{timeStampColumnName}_Trigger"
							BEFORE UPDATE ON "{tableName}"
							FOR EACH ROW
						BEGIN
							:NEW."{timeStampColumnName}" := CURRENT_TIMESTAMP;
						END;
						""";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					command = $"""
					CREATE OR REPLACE FUNCTION "{tableName}_update_{timeStampColumnName}_TrigFunc"() RETURNS trigger AS $$
						BEGIN
							NEW."{timeStampColumnName}" := CURRENT_TIMESTAMP;
							RETURN NEW;
						END;
					$$ LANGUAGE plpgsql;


					CREATE OR REPLACE TRIGGER "{tableName}_update_{timeStampColumnName}_Trigger" BEFORE UPDATE ON "{tableName}"
						FOR EACH ROW EXECUTE FUNCTION "{tableName}_update_{timeStampColumnName}_TrigFunc"();
					""";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Pomelo.EntityFrameworkCore.MySql":
				default:
					break;
			}

			return migrationBuilder;
		}

		internal static MigrationBuilder DropTimestampTrigger(this MigrationBuilder migrationBuilder, IEntityType entityType, string timeStampColumnName)
		{
			var tableName = entityType.GetTableName();

			switch (migrationBuilder.ActiveProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
					string command = $"""DROP TRIGGER IF EXISTS "{tableName}_update_{timeStampColumnName}_Trigger";""";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
					command = $"DROP TRIGGER IF EXISTS [dbo].[{tableName}_update_{timeStampColumnName}_Trigger];";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Oracle.EntityFrameworkCore":
					command = $"""
						DECLARE
							l_count integer;
						BEGIN
							SELECT COUNT(*) INTO l_count FROM user_triggers
							WHERE trigger_name = '{tableName}_update_{timeStampColumnName}_Trigger';

							IF l_count > 0 THEN
								EXECUTE IMMEDIATE 'DROP TRIGGER "{tableName}_update_{timeStampColumnName}_Trigger"';
							END IF;
						END;
						""";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					command = """
						DROP TRIGGER IF EXISTS "{tableName}_update_{timeStampColumnName}_Trigger" ON "{tableName}";
						DROP FUNCTION IF EXISTS "{tableName}_update_{timeStampColumnName}_TrigFunc"
						""";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Pomelo.EntityFrameworkCore.MySql":
				default:
					break;
			}

			return migrationBuilder;
		}
	}

	public sealed class NoGameArgumentNullException : ArgumentNullException
	{
		public NoGameArgumentNullException(string paramName, string message) : base(paramName, message)
		{
		}

		public NoGameArgumentNullException(string message) : base(null, message)
		{
		}
	}
}
