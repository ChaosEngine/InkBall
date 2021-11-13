using MessagePack;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace InkBall.Module.Model
{
	public interface IBelongingToCPU
	{
		bool BelongsToCPU { get; }
	}

	interface ILastMoveTimestamp
	{
		/// <summary>
		/// Last game move timestamp as UTC ISO-8601 format
		/// </summary>
		DateTime? TimeStamp { get; }
	}

	interface IThinPoint
	{
		int iGameId { get; set; }
		int iX { get; set; }
		int iY { get; set; }
		InkBallPoint.StatusEnum Status { get; set; }
	}

	interface IThisSerializablePoint<T> where T : IThinPoint
	{
		string SerializeThin();
	}

	public interface IPoint : IBelongingToCPU
	{
		int iId { get; set; }

		int iGameId { get; set; }

		int iPlayerId { get; set; }

		int iX { get; set; }

		int iY { get; set; }

		InkBallPoint.StatusEnum Status { get; set; }

		int? iEnclosingPathId { get; set; }
	}

	public abstract class CommonPoint : IPoint, IDtoMsg, IMessagePackSerializationCallbackReceiver,
		IEquatable<IPoint>, IEqualityComparer<IPoint>, IComparable
	{
		public int iId { get; set; }

		public int iGameId { get; set; }

		public int iPlayerId { get; set; }

		public int iX { get; set; }

		public int iY { get; set; }

		public InkBallPoint.StatusEnum Status { get; set; }

		public int? iEnclosingPathId { get; set; }

		[JsonIgnore]
		[IgnoreMember]
		public bool BelongsToCPU => iPlayerId == -1;

		#region Overrides

		// override object.ToString
		public override string ToString()
		{
			return $"{this.iX},{this.iY}";
		}

		// override object.Equals
		public override bool Equals(object obj)
		{
			if (!(obj is IPoint)) return false;

			IPoint o = (IPoint)obj;

			return this.iPlayerId == o.iPlayerId
				//&& this.iGameId == o.iGameId
				&& this.Status == o.Status
				//&& this.iEnclosingPathId == o.iEnclosingPathId
				&& this.iX == o.iX & this.iY == o.iY;
		}

		// override object.GetHashCode
		public override int GetHashCode()
		{
			return this.iX ^ this.iY;
		}

		//interface IEquatable
		public bool Equals(IPoint o)
		{
			return ((object)o) != null
				//&& this.iGameId == o.iGameId
				&& this.iPlayerId == o.iPlayerId
				&& this.Status == o.Status
				//&& this.iEnclosingPathId == o.iEnclosingPathId
				&& this.iX == o.iX && this.iY == o.iY;
		}

		//interface IEqualityComparer
		public bool Equals(IPoint left, IPoint right)
		{
			if (right == null && left == null)
				return true;
			else if (left == null || right == null)
				return false;

			return left.Equals(right);
		}

		//interface IEqualityComparer
		public int GetHashCode(IPoint obj)
		{
			return obj.GetHashCode();
		}

		//interface IComparable
		public int CompareTo(object obj)
		{
			if (obj == null) return 1;

			CommonPoint other_point = obj as CommonPoint;
			if (other_point != null)
			{
				int this_val = ((this.iY << 7) + this.iX);
				int other_val = ((other_point.iY << 7) + other_point.iX);

				return this_val.CompareTo(other_val);
			}
			else
				throw new ArgumentNullException(nameof(other_point), $"Object is not a {nameof(CommonPoint)}");
		}

		public void OnBeforeSerialize()
		{
			iId = Math.Max(0, iId);
		}

		public void OnAfterDeserialize()
		{
		}

		public CommandKindEnum GetKind()
		{
			return CommandKindEnum.POINT;
		}

		#endregion Overrides

		public bool ShouldSerializeiId()
		{
			// don't serialize the iId property if <= 0
			return (iId > 0);
		}

		public static bool operator ==(CommonPoint left, CommonPoint right)
		{
			if (((object)left) == null || ((object)right) == null)
				return Object.Equals(left, right);
			return left.Equals(right);
		}

		public static bool operator !=(CommonPoint left, CommonPoint right)
		{
			if (((object)left) == null || ((object)right) == null)
				return !Object.Equals(left, right);
			return !(left.Equals(right));
		}

		public static string GetPointsAsJavaScriptArrayForPage(IEnumerable<InkBallPoint> points)
		{
			StringBuilder builder = new StringBuilder("[", 300);

			string comma = string.Empty;
			foreach (var p in points)
			{
#if DEBUG
				builder.AppendFormat("{4}[/*id={5}*/{0}/*x*/,{1}/*y*/,{2}/*val*/,{3}/*playerID*/]",
					p.iX, p.iY, DataMinimizerStatus((int)p.Status), DataMinimizerPlayerId(p.iPlayerId), comma, p.iId);
#else
				builder.AppendFormat("{4}[{0},{1},{2},{3}]",
					p.iX, p.iY, DataMinimizerStatus((int)p.Status), DataMinimizerPlayerId(p.iPlayerId), comma);
#endif
				comma = ",\r";
			}
			builder.Append(']');

			return builder.ToString();
		}

		public static string GetPointsAsJavaScriptArrayForSignalR(IEnumerable<CommonPoint> points)
		{
			StringBuilder builder = new StringBuilder("[", 300);
			string comma = string.Empty;
			foreach (var p in points)
			{
				builder.AppendFormat("{4}[{0},{1},{2},{3}]", p.iX, p.iY, DataMinimizerStatus((int)p.Status), DataMinimizerPlayerId(p.iPlayerId),
					comma);
				comma = ",";
			}
			builder.Append(']');

			return builder.ToString();
		}

		/// <summary>
		/// Minimize amount of data transported on the wire through SignalR or on the page: status field
		/// </summary>
		/// <param name="status">int value of status</param>
		/// <returns>minimized integer</returns>
		public static int DataMinimizerStatus(int status) => status + 3;

		/// <summary>
		/// Un-Minimize amount of data transported on the wire through SignalR or on the page: status field
		/// </summary>
		/// <param name="status">int value of status expanded</param>
		/// <returns>expanded integer</returns>
		public static int UnDataMinimizerStatus(int status) => status - 3;

		/// <summary>
		/// Minimize amount of data transported on the wire through SignalR or on the page: player id field
		/// </summary>
		/// <param name="playerId"></param>
		/// <returns>minimized int status</returns>
		public static int DataMinimizerPlayerId(int playerId) => playerId + 1;

		/// <summary>
		/// Un-Minimize amount of data transported on the wire through SignalR or on the page: player id field
		/// </summary>
		/// <param name="playerId">expanded player id</param>
		/// <returns>expanded int status</returns>
		public static int UnDataMinimizerPlayerId(int playerId) => playerId - 1;
	}

	public partial class InkBallPoint : CommonPoint, IPoint
	{
		public enum StatusEnum
		{
			POINT_FREE_RED = -3,
			POINT_FREE_BLUE = -2,
			POINT_FREE = -1,
			POINT_STARTING = 0,
			POINT_IN_PATH = 1,
			POINT_OWNED_BY_RED = 2,
			POINT_OWNED_BY_BLUE = 3
		}

		public InkBallPath EnclosingPath { get; set; }

		public InkBallGame Game { get; set; }

		public InkBallPlayer Player { get; set; }

		public InkBallPoint()
		{
		}
	}

	//[Serializable]
	[MessagePackObject(true)]
	public sealed class InkBallPointViewModel : CommonPoint, IPoint, ILastMoveTimestamp,
		IThinPoint, IThisSerializablePoint<InkBallPointViewModel>
	{
		//static readonly JsonSerializerOptions _ignoreNullJsonSerializerOptions = new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull };

		/// <summary>
		/// Helper for serialization only selected properties
		/// </summary>
		private sealed record ThinSerializedPoint : IThinPoint
		{
			public int iGameId { get; set; }

			public int iX { get; set; }

			public int iY { get; set; }

			public InkBallPoint.StatusEnum Status { get; set; }

			public ThinSerializedPoint(IThinPoint thinPoint)
			=> (iGameId, iX, iY, Status) = (thinPoint.iGameId, thinPoint.iX, thinPoint.iY, thinPoint.Status);
		}

		public DateTime? TimeStamp { get; set; }

		public InkBallPointViewModel()
		{ }

		public InkBallPointViewModel(InkBallPoint point)
		{
			this.iId = point.iId;
			this.iGameId = point.iGameId;
			this.iPlayerId = point.iPlayerId;
			this.iX = point.iX;
			this.iY = point.iY;
			this.Status = point.Status;
			this.iEnclosingPathId = point.iEnclosingPathId;

			Debug.Assert(this.iId >= 0);
		}

		//[JsonConstructor]
		public InkBallPointViewModel(InkBallPointViewModel point)
		{
			this.iId = point.iId;
			this.iGameId = point.iGameId;
			this.iPlayerId = point.iPlayerId;
			this.iX = point.iX;
			this.iY = point.iY;
			this.Status = point.Status;
			this.iEnclosingPathId = point.iEnclosingPathId;

			Debug.Assert(this.iId >= 0);
		}

		public string SerializeThin()
		{
			//string last_move = JsonSerializer.Serialize(this, _ignoreNullJsonSerializerOptions);
			var thin_point = new ThinSerializedPoint(this);
			string last_move = JsonSerializer.Serialize(thin_point);

			return last_move;
		}
	}

	#region Helpers

	sealed class SimpleCoordsPointComparer : IEqualityComparer<IPoint>
	{
		//interface IEqualityComparer
		public bool Equals(IPoint left, IPoint right)
		{
			if (right == null && left == null)
				return true;
			else if (left == null || right == null)
				return false;

			return left.iPlayerId == right.iPlayerId
				//&& left.iGameId == right.iGameId
				//&& left.Status == right.Status
				//&& this.iEnclosingPathId == o.iEnclosingPathId
				&& left.iX == right.iX && left.iY == right.iY;
		}

		//interface IEqualityComparer
		public int GetHashCode(IPoint obj)
		{
			return obj.GetHashCode();
		}
	}

	#endregion Helpers
}
