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
			POINT_FREE,
			POINT_STARTING,
			POINT_IN_PATH,
			POINT_OWNED_BY_RED,
			POINT_OWNED_BY_BLUE
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

	[Serializable]
	public class InkBallPointViewModel : IPoint
	{
		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }
		public int iX { get; set; }
		public int iY { get; set; }

		public InkBallPoint.StatusEnum Status { get; set; }
		public int? iEnclosingPathId { get; set; }
		public string Message { get; set; }

		public InkBallPointViewModel()
		{
		}

		public InkBallPointViewModel(InkBallPoint point, string message)
		{
			this.iId = point.iId;
			this.iGameId = point.iGameId;
			this.iPlayerId = point.iPlayerId;
			this.iX = point.iX;
			this.iY = point.iY;

			this.Status = point.Status;
			this.iEnclosingPathId = point.iEnclosingPathId;
			this.Message = message;
		}

		//[JsonConstructor]
		public InkBallPointViewModel(InkBallPointViewModel point, string message)
		{
			this.iId = point.iId;
			this.iGameId = point.iGameId;
			this.iPlayerId = point.iPlayerId;
			this.iX = point.iX;
			this.iY = point.iY;

			this.Status = point.Status;
			this.iEnclosingPathId = point.iEnclosingPathId;
			this.Message = message;
		}
	}
}
