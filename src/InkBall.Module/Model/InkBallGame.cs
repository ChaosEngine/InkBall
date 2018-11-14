using System;
using System.Collections.Generic;

namespace InkBall.Module.Model
{
	public interface IGame<P> where P : IPlayer
	{
		bool bIsPlayer1Active { get; set; }
		DateTime CreateTime { get; set; }
		InkBallGame.GameStateEnum GameState { get; set; }
		InkBallGame.GameTypeEnum GameType { get; set; }
		int iBoardHeight { get; set; }
		int iBoardWidth { get; set; }
		int iGridSize { get; set; }
		int iId { get; set; }
		ICollection<InkBallPath> InkBallPath { get; set; }
		ICollection<InkBallPoint> InkBallPoint { get; set; }
		int iPlayer1Id { get; set; }
		int? iPlayer2Id { get; set; }
		P Player1 { get; set; }
		P Player2 { get; set; }
		DateTime TimeStamp { get; set; }

		// void SurrenderGameFromPlayer();
	}

	public partial class InkBallGame : IGame<InkBallPlayer>
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

		public InkBallGame()
		{
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}
	}

	[Serializable]
	public class InkBallGameViewModel : IGame<InkBallPlayerViewModel>
	{
		public bool bIsPlayer1Active { get; set; }
		public DateTime CreateTime { get; set; }
		public InkBallGame.GameStateEnum GameState { get; set; }
		public InkBallGame.GameTypeEnum GameType { get; set; }
		public int iBoardHeight { get; set; }
		public int iBoardWidth { get; set; }
		public int iGridSize { get; set; }
		public int iId { get; set; }
		public ICollection<InkBallPath> InkBallPath { get; set; }
		public ICollection<InkBallPoint> InkBallPoint { get; set; }
		public int iPlayer1Id { get; set; }
		public int? iPlayer2Id { get; set; }
		public InkBallPlayerViewModel Player1 { get; set; }
		public InkBallPlayerViewModel Player2 { get; set; }
		public DateTime TimeStamp { get; set; }

		public InkBallGameViewModel()
		{
		}

		public InkBallGameViewModel(InkBallGame game)
		{
			bIsPlayer1Active = game.bIsPlayer1Active;
			CreateTime = game.CreateTime;
			GameState = game.GameState;
			GameType = game.GameType;
			iBoardHeight = game.iBoardHeight;
			iBoardWidth = game.iBoardWidth;
			iGridSize = game.iGridSize;
			iId = game.iId;
			InkBallPath = game.InkBallPath;
			InkBallPoint = game.InkBallPoint;
			iPlayer1Id = game.iPlayer1Id;
			iPlayer2Id = game.iPlayer2Id;
			Player1 = new InkBallPlayerViewModel(game.Player1);
			if (game.Player2 != null)
				Player2 = new InkBallPlayerViewModel(game.Player2);
			TimeStamp = game.TimeStamp;
		}

		public InkBallGameViewModel(InkBallGameViewModel game)
		{
			bIsPlayer1Active = game.bIsPlayer1Active;
			CreateTime = game.CreateTime;
			GameState = game.GameState;
			GameType = game.GameType;
			iBoardHeight = game.iBoardHeight;
			iBoardWidth = game.iBoardWidth;
			iGridSize = game.iGridSize;
			iId = game.iId;
			InkBallPath = game.InkBallPath;
			InkBallPoint = game.InkBallPoint;
			iPlayer1Id = game.iPlayer1Id;
			iPlayer2Id = game.iPlayer2Id;
			Player1 = game.Player1;
			Player2 = game.Player2;
			TimeStamp = game.TimeStamp;
		}

		// public void SurrenderGameFromPlayer()
		// {
		// 	//TODO: implement this
		// }
	}
}
