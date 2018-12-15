using System;
using System.Collections.Generic;

namespace InkBall.Module.Model
{
	public interface IPath
	{
		int iId { get; set; }

		int iGameId { get; set; }

		int iPlayerId { get; set; }
	}

	public partial class InkBallPath : IPath
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

	public class InkBallPathViewModel : IPath
	{
		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }

		public InkBallPathViewModel()
		{
		}

		public InkBallPathViewModel(InkBallPath path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
		}

		public InkBallPathViewModel(InkBallPathViewModel path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
		}
	}
}
