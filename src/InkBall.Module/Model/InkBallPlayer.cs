using System;
using System.Collections.Generic;

namespace InkBall.Module
{
	public partial class InkBallPlayer
	{
		public InkBallPlayer()
		{
			InkBallGameIPlayer1 = new HashSet<InkBallGame>();
			InkBallGameIPlayer2 = new HashSet<InkBallGame>();
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}

		public int iId { get; set; }
		public int? iUserId { get; set; }
		public string sLastMoveCode { get; set; }
		public int iWinCount { get; set; }
		public int iLossCount { get; set; }
		public int iDrawCount { get; set; }
		public DateTime TimeStamp { get; set; }

		public InkBallUser User { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer1 { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer2 { get; set; }
		public ICollection<InkBallPath> InkBallPath { get; set; }
		public ICollection<InkBallPoint> InkBallPoint { get; set; }
	}
}
