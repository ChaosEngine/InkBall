using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace InkBall.Module
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
}
