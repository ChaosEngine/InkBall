using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Newtonsoft.Json;

namespace InkBall.Module.Model
{
	public interface IGame<Player, Point, Path>
		where Player : IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		bool bIsPlayer1Active { get; set; }
		DateTime CreateTime { get; set; }
		InkBallGame.GameStateEnum GameState { get; set; }
		InkBallGame.GameTypeEnum GameType { get; set; }
		int iBoardHeight { get; set; }
		int iBoardWidth { get; set; }
		int LogicalWidth { get; }
		int LogicalHeight { get; }
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
		Player GetPlayer();
		Player GetOtherPlayer();
		bool IsThisPlayerActive();
		bool IsThisPlayerPlayingWithRed();
	}

	public abstract class AbstractGame<Player, Point, Path>
		where Player : IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		protected internal static TimeSpan _deactivationDelayInSeconds = TimeSpan.FromSeconds(120);

		[NotMapped]//Hide it from EF Core
		[JsonProperty]//allow to serialize it
		protected internal bool bIsPlayer1 { get; set; }
		public int iId { get; set; }
		public abstract Player Player1 { get; set; }
		public abstract Player Player2 { get; set; }
		public abstract ICollection<Path> InkBallPath { get; set; }
		public abstract ICollection<Point> InkBallPoint { get; set; }
		public int iPlayer1Id { get; set; }
		public int? iPlayer2Id { get; set; }
		public bool bIsPlayer1Active { get; set; }
		public int iGridSize { get; set; }
		public int iBoardWidth { get; set; }
		public int iBoardHeight { get; set; }
		public int LogicalWidth => (int)(iBoardWidth / iGridSize);
		public int LogicalHeight => (int)(iBoardHeight / iGridSize);
		public InkBallGame.GameTypeEnum GameType { get; set; }
		public InkBallGame.GameStateEnum GameState { get; set; }
		public DateTime TimeStamp { get; set; }
		public DateTime CreateTime { get; set; }

		public static TimeSpan GetDeactivationDelayInSeconds() => InkBallGame._deactivationDelayInSeconds;

		public bool IsThisPlayer1()
		{
			return this.bIsPlayer1;
		}

		public bool IsPlayer1Active()
		{
			return this.bIsPlayer1Active;
		}

		public bool IsThisPlayerActive()
		{
			if (this.bIsPlayer1)
			{
				return this.bIsPlayer1Active ? true : false;
			}
			else
			{
				return this.bIsPlayer1Active ? false : true;
			}
		}

		public bool IsThisPlayerPlayingWithRed()
		{
			return this.bIsPlayer1;
		}

		public Player GetPlayer()
		{
			if (this.bIsPlayer1 == true)
				return this.Player1;
			else
				return this.Player2;
		}

		public Player GetOtherPlayer()
		{
			if (this.bIsPlayer1 == false)
				return this.Player1;
			else
				return this.Player2;
		}

		public Player GetPlayer1()
		{
			return this.Player1;
		}

		public Player GetPlayer2()
		{
			return this.Player2;
		}
	}

	public partial class InkBallGame : AbstractGame<InkBallPlayer, InkBallPoint, InkBallPath>
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

		public override InkBallPlayer Player1 { get; set; }
		public override InkBallPlayer Player2 { get; set; }
		public override ICollection<InkBallPath> InkBallPath { get; set; }
		public override ICollection<InkBallPoint> InkBallPoint { get; set; }

		public InkBallGame()
		{
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}

		internal static void DeactivateDeadGamezFromExternalUserID(string sExternalUserID)
		{
			//TODO: implement this
		}

		internal static void WipeAllDeadGamez()
		{
			//TODO: implement this
		}
	}

	//[Serializable]
	public class InkBallGameViewModel : AbstractGame<InkBallPlayerViewModel, InkBallPointViewModel, InkBallPathViewModel>
	{
		public override ICollection<InkBallPathViewModel> InkBallPath { get; set; }
		public override ICollection<InkBallPointViewModel> InkBallPoint { get; set; }
		public override InkBallPlayerViewModel Player1 { get; set; }
		public override InkBallPlayerViewModel Player2 { get; set; }

		public InkBallGameViewModel()
		{
		}

		public InkBallGameViewModel(InkBallGame game)
		{
			bIsPlayer1Active = game.bIsPlayer1Active;
			bIsPlayer1 = game.bIsPlayer1;
			CreateTime = game.CreateTime;
			GameState = game.GameState;
			GameType = game.GameType;
			iBoardHeight = game.iBoardHeight;
			iBoardWidth = game.iBoardWidth;
			iGridSize = game.iGridSize;
			iId = game.iId;

			if (game?.InkBallPath?.Count > 0)
			{
				InkBallPath = game.InkBallPath.Select(p => new InkBallPathViewModel(p)).ToArray();
			}
			if (game?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = game.InkBallPoint.Select(p => new InkBallPointViewModel(p)).ToArray();
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
			bIsPlayer1 = game.bIsPlayer1;
			CreateTime = game.CreateTime;
			GameState = game.GameState;
			GameType = game.GameType;
			iBoardHeight = game.iBoardHeight;
			iBoardWidth = game.iBoardWidth;
			iGridSize = game.iGridSize;
			iId = game.iId;

			if (game?.InkBallPath?.Count > 0)
			{
				InkBallPath = game.InkBallPath;
			}
			if (game?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = game.InkBallPoint;
			}

			iPlayer1Id = game.iPlayer1Id;
			iPlayer2Id = game.iPlayer2Id;
			Player1 = game.Player1;
			Player2 = game.Player2;
			TimeStamp = game.TimeStamp;
		}
	}
}
