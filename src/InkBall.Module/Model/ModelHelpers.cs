using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq;

namespace InkBall.Module.Model
{
	#region Old code

	/*
	/// <summary>
	///     Converts <see cref="DateTime" /> using <see cref="DateTime.ToBinary" />. This
	///     will preserve the <see cref="DateTimeKind" />.
	/// </summary>
	internal class DateTimeToBytesConverter : ValueConverter<DateTime, byte[]>
	{
		/// <summary>
		///     A <see cref="ValueConverterInfo" /> for the default use of this converter.
		/// </summary>
		public static ValueConverterInfo DefaultInfo { get; }
			= new ValueConverterInfo(typeof(DateTime), typeof(byte[]), i => new DateTimeToBytesConverter(i.MappingHints));

		static double DateTimeToUnixTimestamp(DateTime dateTime)
		{
			return (TimeZoneInfo.ConvertTimeToUtc(dateTime) - DateTime.UnixEpoch).TotalSeconds;
		}

		/// <summary>
		///     Creates a new instance of this converter.
		/// </summary>
		/// <param name="mappingHints">
		///     Hints that can be used by the <see cref="ITypeMappingSource" /> to create data types with appropriate
		///     facets for the converted data.
		/// </param>
		public DateTimeToBytesConverter(ConverterMappingHints mappingHints = null)
			: base(
				dt => FromType2Db(dt),
				bytes => FromDb2Type(bytes),
				mappingHints)
		{
		}

		static DateTime FromDb2Type(byte[] bytes)
		{
			try
			{
				//return (bytes == null || bytes.Length <= 0) ?
				//	DateTime.MinValue : DateTime.FromBinary(BitConverter.ToInt64(bytes, 0));

				if (bytes == null || bytes.Length <= 0)
					return DateTime.MinValue;

				bytes.AsSpan().Reverse();
				var num = BitConverter.ToInt64(bytes, 0);
				var res = DateTime.MinValue + TimeSpan.FromTicks(num);

				return res;
			}
			catch (Exception)
			{
				return DateTime.MinValue;
			}
		}

		static byte[] FromType2Db(DateTime dt)
		{
			try
			{
				if (dt <= DateTime.MinValue)
					return Array.Empty<byte>();

				TimeSpan ts = dt - DateTime.MinValue;
				var res = BitConverter.GetBytes(ts.Ticks);
				res.Reverse();

				return res;
			}
			catch (Exception)
			{
				return new byte[] { };
			}
		}
	}
	*/

	#endregion Old code

	internal static class MigrationExtensions
	{
		internal static MigrationBuilder CreateTimestampTrigger(this MigrationBuilder migrationBuilder, IEntityType entityType,
			string timeStampColumnName, string primaryKey)
		{
			var tableName = entityType.GetTableName();
			//var primaryKey = entityType.FindPrimaryKey();

			switch (migrationBuilder.ActiveProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
                    //SQLite: RETURNING clause doesn't work with AFTER triggers #gh-29811
                    //https://github.com/dotnet/efcore/issues/29811
                    //
                    string command =
$@"CREATE TRIGGER IF NOT EXISTS {tableName}_update_{timeStampColumnName}_Trigger
BEFORE UPDATE ON {tableName}
BEGIN
	UPDATE {tableName} SET {timeStampColumnName} = datetime(CURRENT_TIMESTAMP, 'localtime') WHERE {primaryKey} = NEW.{primaryKey};
END;";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
					command =
$@"CREATE OR ALTER TRIGGER [dbo].[{tableName}_update_{timeStampColumnName}_Trigger] ON [dbo].[{tableName}]
	AFTER UPDATE
AS
BEGIN
	SET NOCOUNT ON;
	IF ((SELECT TRIGGER_NESTLEVEL()) > 1) RETURN;

	UPDATE {tableName}
	SET {timeStampColumnName} = GETDATE()
	FROM {tableName} t
	INNER JOIN INSERTED i ON i.{primaryKey} = t.{primaryKey}
	WHERE t.{primaryKey} = i.{primaryKey}
END";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Oracle.EntityFrameworkCore":
					command =
$@"CREATE OR REPLACE TRIGGER ""{tableName}_update_{timeStampColumnName}_Trigger""
	BEFORE UPDATE ON ""{tableName}""
	FOR EACH ROW
BEGIN
	:NEW.""{timeStampColumnName}"" := SYSTIMESTAMP;
END;";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					command =
$@"CREATE OR REPLACE FUNCTION ""{tableName}_update_{timeStampColumnName}_TrigFunc""() RETURNS trigger AS $$
    BEGIN
        NEW.""{timeStampColumnName}"" := CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ""{tableName}_update_{timeStampColumnName}_Trigger"" BEFORE UPDATE ON ""{tableName}""
    FOR EACH ROW EXECUTE FUNCTION ""{tableName}_update_{timeStampColumnName}_TrigFunc""();
";
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
					string command = $@"DROP TRIGGER IF EXISTS {tableName}_update_{timeStampColumnName}_Trigger;";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
					command = $@"DROP TRIGGER IF EXISTS [dbo].[{tableName}_update_{timeStampColumnName}_Trigger];";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Oracle.EntityFrameworkCore":
					command = $@"
DECLARE
  l_count integer;
BEGIN
  SELECT COUNT(*) INTO l_count FROM user_triggers
  WHERE trigger_name = '{tableName}_update_{timeStampColumnName}_Trigger';

  IF l_count > 0 THEN
     EXECUTE IMMEDIATE 'DROP TRIGGER ""{tableName}_update_{timeStampColumnName}_Trigger""';
  END IF;
END;";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Npgsql.EntityFrameworkCore.PostgreSQL":
					command = $@"DROP TRIGGER IF EXISTS ""{tableName}_update_{timeStampColumnName}_Trigger"" ON ""{tableName}"";";

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
