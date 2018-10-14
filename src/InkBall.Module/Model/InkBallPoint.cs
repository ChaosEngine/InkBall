using System;
using System.Collections.Generic;

namespace InkBall.Module
{
    public partial class InkBallPoint
    {
		public enum StatusEnum
		{
			POINT_FREE,
			POINT_STARTING,
			POINT_IN_PATH,
			POINT_OWNED_BY_RED,
			POINT_OWNED_BY_BLUE
		}

		public InkBallPoint()
        {
            InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
        }

        public uint iId { get; set; }
        public uint iGameId { get; set; }
        public uint iPlayerId { get; set; }
        public uint iX { get; set; }
        public uint iY { get; set; }
		//`Status` enum('POINT_FREE','POINT_STARTING','POINT_IN_PATH','POINT_OWNED_BY_RED','POINT_OWNED_BY_BLUE') NOT NULL DEFAULT 'POINT_FREE' COMMENT 'Status of point color and belongings',
		public StatusEnum Status { get; set; }
		public uint? iEnclosingPathId { get; set; }

        public InkBallPath EnclosingPath { get; set; }
        public InkBallGame Game { get; set; }
        public InkBallPlayer Player { get; set; }
        public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }
    }
}
