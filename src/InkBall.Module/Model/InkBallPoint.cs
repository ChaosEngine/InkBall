using System;
using System.Collections.Generic;

namespace InkBall.Module.Model
{
	[Serializable]
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
		
        public int iId { get; set; }
        public int iGameId { get; set; }
        public int iPlayerId { get; set; }
        public int iX { get; set; }
        public int iY { get; set; }
		//`Status` enum('POINT_FREE','POINT_STARTING','POINT_IN_PATH','POINT_OWNED_BY_RED','POINT_OWNED_BY_BLUE') NOT NULL DEFAULT 'POINT_FREE' COMMENT 'Status of point color and belongings',
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
}
