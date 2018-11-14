using System;
using System.Collections.Generic;

namespace InkBall.Module.Model
{
	[Serializable]
    public partial class InkBallPath
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
}
