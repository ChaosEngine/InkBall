﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace InkBall.Module.Model
{
	public interface IGame<Player, Point, Path>
		where Player : IPlayer
		where Point : IPoint
		where Path : IPath
	{
		bool bIsPlayer1Active { get; set; }
		DateTime CreateTime { get; set; }
		InkBallGame.GameStateEnum GameState { get; set; }
		InkBallGame.GameTypeEnum GameType { get; set; }
		int iBoardHeight { get; set; }
		int iBoardWidth { get; set; }
		int iGridSize { get; set; }
		int iId { get; set; }
		ICollection<Path> InkBallPath { get; set; }
		ICollection<Point> InkBallPoint { get; set; }
		int iPlayer1Id { get; set; }
		int? iPlayer2Id { get; set; }
		Player Player1 { get; set; }
		Player Player2 { get; set; }
		DateTime TimeStamp { get; set; }

		bool IsThisPlayer1();

		Player GetOtherPlayer();

		bool IsThisPlayerActive();

		// void SurrenderGameFromPlayer();
	}

	public partial class InkBallGame : IGame<InkBallPlayer, InkBallPoint, InkBallPath>
	{
		protected internal static TimeSpan _deactivationDelayInSeconds = TimeSpan.FromSeconds(120);

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

		//public void SurrenderGameFromPlayer()
		// {
		// 	//TODO: implement this
		// }

		public bool IsThisPlayer1()
		{
			return this.bIsPlayer1Active;
		}

		public InkBallPlayer GetOtherPlayer()
		{
			if (bIsPlayer1Active == false)
				return Player1;
			else
				return Player2;
		}

		public bool IsThisPlayerActive()
		{
			if (bIsPlayer1Active)
			{
				return bIsPlayer1Active ? true : false;
			}
			else
			{
				return bIsPlayer1Active ? false : true;
			}
		}

		public static TimeSpan GetDeactivationDelayInSeconds() => InkBallGame._deactivationDelayInSeconds;

		internal static void DeactivateDeadGamezFromExternalUserID(string sExternalUserID)
		{
			//TODO: implement this
		}

		internal static void WipeAllDeadGamez()
		{
			//TODO: implement this
		}
	}

	[Serializable]
	public class InkBallGameViewModel : IGame<InkBallPlayerViewModel, InkBallPointViewModel, InkBallPathViewModel>
	{
		public bool bIsPlayer1Active { get; set; }
		public DateTime CreateTime { get; set; }
		public InkBallGame.GameStateEnum GameState { get; set; }
		public InkBallGame.GameTypeEnum GameType { get; set; }
		public int iBoardHeight { get; set; }
		public int iBoardWidth { get; set; }
		public int iGridSize { get; set; }
		public int iId { get; set; }
		public ICollection<InkBallPathViewModel> InkBallPath { get; set; }
		public ICollection<InkBallPointViewModel> InkBallPoint { get; set; }
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

			if (game.InkBallPath != null && game.InkBallPath.Count > 0)
			{
				InkBallPath = game.InkBallPath.Select(p => new InkBallPathViewModel(p)).ToArray();
			}
			if (game.InkBallPoint != null && game.InkBallPoint.Count > 0)
			{
				InkBallPoint = game.InkBallPoint.Select(p => new InkBallPointViewModel(p, "")).ToArray();
			}

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

			if (game.InkBallPath != null && game.InkBallPath.Count > 0)
			{
				InkBallPath = game.InkBallPath;
			}
			if (game.InkBallPoint != null && game.InkBallPoint.Count > 0)
			{
				InkBallPoint = game.InkBallPoint;
			}

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

		public bool IsThisPlayer1()
		{
			return this.bIsPlayer1Active;
		}

		public InkBallPlayerViewModel GetOtherPlayer()
		{
			if (bIsPlayer1Active == false)
				return Player1;
			else
				return Player2;
		}

		public bool IsThisPlayerActive()
		{
			if (bIsPlayer1Active)
			{
				return bIsPlayer1Active ? true : false;
			}
			else
			{
				return bIsPlayer1Active ? false : true;
			}
		}
	}
}
