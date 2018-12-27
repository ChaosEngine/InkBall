using System;
using System.Collections.Generic;
using System.Linq;

namespace InkBall.Module.Model
{
	public interface IPath<Point>
		where Point : IPoint
	{
		int iId { get; set; }
		int iGameId { get; set; }
		int iPlayerId { get; set; }

		ICollection<Point> InkBallPoint { get; set; }
	}

	public partial class InkBallPath : IPath<InkBallPoint>
	{
		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }

		public InkBallGame Game { get; set; }
		public InkBallPlayer Player { get; set; }
		public ICollection<InkBallPoint> InkBallPoint { get; set; }
		public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }

		public InkBallPath()
		{
			InkBallPoint = new HashSet<InkBallPoint>();

			InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
		}
	}

	public class InkBallPathViewModel : IPath<InkBallPointViewModel>
	{
		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }

		public ICollection<InkBallPointViewModel> InkBallPoint { get; set; }

		public InkBallPathViewModel()
		{ }

		public InkBallPathViewModel(InkBallPath path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;

			if (path?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = path.InkBallPoint.Select(p => new InkBallPointViewModel(p)).ToArray();
			}
		}

		public InkBallPathViewModel(InkBallPathViewModel path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;

			if (path?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = path.InkBallPoint;
			}
		}
	}
}
