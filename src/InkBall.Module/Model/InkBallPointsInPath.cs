using System;
using System.Collections.Generic;

namespace InkBall.Module
{
    public partial class InkBallPointsInPath
    {
        public int iId { get; set; }
        public int iPathId { get; set; }
        public int iPointId { get; set; }

        public InkBallPath Path { get; set; }
        public InkBallPoint Point { get; set; }
    }
}
