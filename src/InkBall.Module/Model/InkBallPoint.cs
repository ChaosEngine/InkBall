using MessagePack;
using System;
using System.Collections.Generic;

namespace InkBall.Module.Model
{
	public interface IPoint
	{
		int iId { get; set; }

		int iGameId { get; set; }

		int iPlayerId { get; set; }

		int iX { get; set; }

		int iY { get; set; }

		InkBallPoint.StatusEnum Status { get; set; }

		int? iEnclosingPathId { get; set; }
	}

	public abstract class AbstractPoint : IPoint, IEquatable<IPoint>, IEqualityComparer<IPoint>
	{
		public int iId { get; set; }

		public int iGameId { get; set; }

		public int iPlayerId { get; set; }

		public int iX { get; set; }

		public int iY { get; set; }

		public InkBallPoint.StatusEnum Status { get; set; }

		public int? iEnclosingPathId { get; set; }

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

			return this.iGameId == o.iGameId && this.iPlayerId == o.iPlayerId
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
				&& this.iGameId == o.iGameId && this.iPlayerId == o.iPlayerId
				//&& this.Status == o.Status
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

		#endregion Overrides

		public static bool operator ==(AbstractPoint left, AbstractPoint right)
		{
			if (((object)left) == null || ((object)right) == null)
				return Object.Equals(left, right);
			return left.Equals(right);
		}

		public static bool operator !=(AbstractPoint left, AbstractPoint right)
		{
			if (((object)left) == null || ((object)right) == null)
				return !Object.Equals(left, right);
			return !(left.Equals(right));
		}
	}

	public partial class InkBallPoint : AbstractPoint, IPoint
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

		public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }

		public InkBallPoint()
		{
			InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
		}

		// public static bool operator ==(InkBallPoint left, InkBallPoint right)
		// {
		// 	if (((object)left) == null || ((object)right) == null)
		// 		return Object.Equals(left, right);
		// 	return left.Equals(right);
		// }

		// public static bool operator !=(InkBallPoint left, InkBallPoint right)
		// {
		// 	if (((object)left) == null || ((object)right) == null)
		// 		return !Object.Equals(left, right);
		// 	return !(left.Equals(right));
		// }
	}

	//[Serializable]
	[MessagePackObject(true)]
	public class InkBallPointViewModel : AbstractPoint, IPoint
	{
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
		}

		public bool ShouldSerializeiId()
		{
			// don't serialize the iId property if <= 0
			return (iId > 0);
		}

		// public static bool operator ==(InkBallPointViewModel left, InkBallPointViewModel right)
		// {
		// 	if (((object)left) == null || ((object)right) == null)
		// 		return Object.Equals(left, right);
		// 	return left.Equals(right);
		// }

		// public static bool operator !=(InkBallPointViewModel left, InkBallPointViewModel right)
		// {
		// 	if (((object)left) == null || ((object)right) == null)
		// 		return !Object.Equals(left, right);
		// 	return !(left.Equals(right));
		// }
	}
}
