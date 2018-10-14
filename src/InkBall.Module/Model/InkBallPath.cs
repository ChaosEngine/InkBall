using System;
using System.Collections.Generic;

namespace InkBall.Module
{
    public partial class InkBallPath
    {
        public InkBallPath()
        {
            InkBallPoint = new HashSet<InkBallPoint>();
            InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
        }

        public uint iId { get; set; }
        public uint iGameId { get; set; }
        public uint iPlayerId { get; set; }

        public InkBallGame Game { get; set; }
        public InkBallPlayer Player { get; set; }
        public ICollection<InkBallPoint> InkBallPoint { get; set; }
        public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }
    }
}
