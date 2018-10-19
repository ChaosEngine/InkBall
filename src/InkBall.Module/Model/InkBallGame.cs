using System;
using System.Collections.Generic;

namespace InkBall.Module
{
	public partial class InkBallGame
	{
		public enum GameTypeEnum
		{
			FIRST_CAPTURE,
			FIRST_5_CAPTURES,
			FIRST_5_PATHS,
			FIRST_5_ADVANTAGE_PATHS
		}

		public enum GameStateEnum
		{
			INACTIVE,
			ACTIVE,
			AWAITING,
			FINISHED
		}

		public InkBallGame()
		{
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}

		public int iId { get; set; }
		public int iPlayer1Id { get; set; }
		public int? iPlayer2Id { get; set; }
		public bool bIsPlayer1Active { get; set; }
		public int iGridSize { get; set; }
		public int iBoardWidth { get; set; }
		public int iBoardHeight { get; set; }
		//`GameType` enum('FIRST_CAPTURE','FIRST_5_CAPTURES','FIRST_5_PATHS','FIRST_5_ADVANTAGE_PATHS') NOT NULL DEFAULT 'FIRST_CAPTURE' COMMENT 'Game win type'
		public GameTypeEnum GameType { get; set; }
		//`GameState` enum('INACTIVE','ACTIVE','AWAITING','FINISHED') NOT NULL DEFAULT 'INACTIVE' COMMENT 'State of this game',
		public GameStateEnum GameState { get; set; }
		public DateTime TimeStamp { get; set; }
		public DateTime CreateTime { get; set; }

		public InkBallPlayer Player1 { get; set; }
		public InkBallPlayer Player2 { get; set; }
		public ICollection<InkBallPath> InkBallPath { get; set; }
		public ICollection<InkBallPoint> InkBallPoint { get; set; }
	}
}
