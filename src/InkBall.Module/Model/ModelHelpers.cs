using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace InkBall.Module.Model
{
	/// <summary>
	///     Converts <see cref="DateTime" /> using <see cref="DateTime.ToBinary" />. This
	///     will preserve the <see cref="DateTimeKind" />.
	/// </summary>
	internal class DateTimeToBytesConverter : ValueConverter<DateTime, byte[]>
	{
		/// <summary>
		///     Creates a new instance of this converter.
		/// </summary>
		/// <param name="mappingHints">
		///     Hints that can be used by the <see cref="ITypeMappingSource" /> to create data types with appropriate
		///     facets for the converted data.
		/// </param>
		public DateTimeToBytesConverter(ConverterMappingHints mappingHints = null)
			: base(
				dt => (dt == null || dt == DateTime.MinValue) ?
					new byte[] { } : BitConverter.GetBytes(dt.ToBinary()),
				bytes => (bytes == null || bytes.Length <= 0) ?
					DateTime.MinValue : DateTime.FromBinary(BitConverter.ToInt64(bytes, 0)),
				mappingHints)
		{
		}

		/// <summary>
		///     A <see cref="ValueConverterInfo" /> for the default use of this converter.
		/// </summary>
		public static ValueConverterInfo DefaultInfo { get; }
			= new ValueConverterInfo(typeof(DateTime), typeof(byte[]), i => new DateTimeToBytesConverter(i.MappingHints));
	}

	internal static class MigrationExtensions
	{
		internal static MigrationBuilder CreateTimestampTrigger(this MigrationBuilder migrationBuilder, IEntityType entityType,
			string timeStampColumnName, string primaryKey)
		{
			switch (migrationBuilder.ActiveProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
					var tableName = entityType.Relational().TableName;
					//var primaryKey = entityType.FindPrimaryKey();

					string command = 
$@"CREATE TRIGGER {tableName}_update_{timeStampColumnName}_Trigger
AFTER UPDATE On {tableName}
BEGIN
   UPDATE {tableName} SET {timeStampColumnName} = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE {primaryKey} = NEW.{primaryKey};
END;";
					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
				case "Pomelo.EntityFrameworkCore.MySql":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
				default:
					break;
			}

			return migrationBuilder;
		}

		internal static MigrationBuilder DropTimestampTrigger(this MigrationBuilder migrationBuilder, IEntityType entityType, string timeStampColumnName)
		{
			switch (migrationBuilder.ActiveProvider)
			{
				case "Microsoft.EntityFrameworkCore.Sqlite":
					var tableName = entityType.Relational().TableName;
					
					string command = $@"DROP TRIGGER {tableName}_update_{timeStampColumnName}_Trigger;";

					//Console.Error.WriteLine($"executing '{command}'");
					migrationBuilder.Sql(command);
					break;

				case "Microsoft.EntityFrameworkCore.SqlServer":
				case "Pomelo.EntityFrameworkCore.MySql":
				case "Npgsql.EntityFrameworkCore.PostgreSQL":
				default:
					break;
			}

			return migrationBuilder;
		}
	}
}
