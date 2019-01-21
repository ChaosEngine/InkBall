﻿using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace InkBall.Module.Model
{
	public interface IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		int iId { get; set; }
		int? iUserId { get; set; }
		string sLastMoveCode { get; set; }
		int iWinCount { get; set; }
		int iLossCount { get; set; }
		int iDrawCount { get; set; }
		DateTime TimeStamp { get; set; }

		ICollection<Path> InkBallPath { get; set; }
		ICollection<Point> InkBallPoint { get; set; }

		bool IsLastMoveOverdue();
	}

	public abstract class AbstractPlayer<Point, Path> : IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		public int iId { get; set; }
		public int? iUserId { get; set; }
		public string sLastMoveCode { get; set; }
		public int iWinCount { get; set; }
		public int iLossCount { get; set; }
		public int iDrawCount { get; set; }
		public DateTime TimeStamp { get; set; }

		public abstract ICollection<Path> InkBallPath { get; set; }
		public abstract ICollection<Point> InkBallPoint { get; set; }

		public bool IsLastMoveOverdue()
		{
			TimeSpan last_move = DateTime.Now - this.TimeStamp;
			if (last_move > InkBallGame.GetDeactivationDelayInSeconds())
				return true;
			return false;
		}
	}

	public partial class InkBallPlayer : AbstractPlayer<InkBallPoint, InkBallPath>
	{
		public InkBallUser User { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer1 { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer2 { get; set; }
		public override ICollection<InkBallPath> InkBallPath { get; set; }
		public override ICollection<InkBallPoint> InkBallPoint { get; set; }

		public InkBallPlayer()
		{
			InkBallGameIPlayer1 = new HashSet<InkBallGame>();
			InkBallGameIPlayer2 = new HashSet<InkBallGame>();
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}
	}

	//[Serializable]
	public class InkBallPlayerViewModel : AbstractPlayer<InkBallPointViewModel, InkBallPathViewModel>
	{
		public InkBallUserViewModel User { get; set; }
		public override ICollection<InkBallPathViewModel> InkBallPath { get; set; }
		public override ICollection<InkBallPointViewModel> InkBallPoint { get; set; }

		public InkBallPlayerViewModel()
		{
		}

		public InkBallPlayerViewModel(InkBallPlayer player, bool loadUser = true)
		{
			iId = player.iId;
			iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;

			if (loadUser && player.User != null)
			{
				User = new InkBallUserViewModel(player.User);
			}
			if (player?.InkBallPath?.Count > 0)
			{
				InkBallPath = player.InkBallPath.Select(p => new InkBallPathViewModel(p)).ToArray();
			}
			if (player?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = player.InkBallPoint.Select(p => new InkBallPointViewModel(p)).ToArray();
			}
		}

		public InkBallPlayerViewModel(InkBallPlayerViewModel player)
		{
			iId = player.iId;
			iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;

			if (player.User != null)
			{
				User = player.User;
			}
			if (player?.InkBallPath?.Count > 0)
			{
				InkBallPath = player.InkBallPath;
			}
			if (player?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = player.InkBallPoint;
			}
		}
	}
}
