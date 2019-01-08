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

	public partial class InkBallPoint : IPoint
	{
		public enum StatusEnum
		{
			POINT_FREE_RED = -3,
			POINT_FREE_BLUE = -2,
			POINT_FREE = -1,
			POINT_STARTING = 0,
			POINT_IN_PATH = 2,
			POINT_OWNED_BY_RED = 3,
			POINT_OWNED_BY_BLUE = 4
		}


		public int iId { get; set; }

		public int iGameId { get; set; }

		public int iPlayerId { get; set; }

		public int iX { get; set; }

		public int iY { get; set; }

		public StatusEnum Status { get; set; }

		public int? iEnclosingPathId { get; set; }


		public InkBallPath EnclosingPath { get; set; }

		public InkBallGame Game { get; set; }

		public InkBallPlayer Player { get; set; }

		public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }

		public InkBallPoint()
		{
			InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
		}
	}

	//[Serializable]
	[MessagePackObject(true)]
	public class InkBallPointViewModel : IPoint
	{
		public int iId { get; set; }

		public int iGameId { get; set; }

		public int iPlayerId { get; set; }

		public int iX { get; set; }

		public int iY { get; set; }

		public InkBallPoint.StatusEnum Status { get; set; }

		public int? iEnclosingPathId { get; set; }

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
	}
}
