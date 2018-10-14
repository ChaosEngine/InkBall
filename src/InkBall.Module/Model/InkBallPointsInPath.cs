using System;
using System.Collections.Generic;

namespace InkBall.Module
{
    public partial class InkBallPointsInPath
    {
        public uint iId { get; set; }
        public uint iPathId { get; set; }
        public uint iPointId { get; set; }

        public InkBallPath Path { get; set; }
        public InkBallPoint Point { get; set; }
    }
}
