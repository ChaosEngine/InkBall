using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using MessagePack;

namespace InkBall.Module.Model
{
	public interface IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		int iId { get; set; }
		//int? iUserId { get; set; }
		string sLastMoveCode { get; set; }
		int iWinCount { get; set; }
		int iLossCount { get; set; }
		int iDrawCount { get; set; }
		DateTime TimeStamp { get; set; }

		int iPrivileges { get; set; }
		string sExternalId { get; set; }
		string UserName { get; set; }

		ICollection<Path> InkBallPath { get; set; }
		ICollection<Point> InkBallPoint { get; set; }

		int GetWinCount();
		void SetWinCount(int value);
		int GetLossCount();
		void SetLossCount(int value);
		int GetDrawCount();
		void SetDrawCount(int value);
		bool IsLastMoveOverdue();
	}

	public abstract class CommonPlayer<Point, Path> : IPlayer<Point, Path>
		where Point : IPoint
		where Path : IPath<Point>
	{
		public int iId { get; set; }
		//public int? iUserId { get; set; }
		public string sLastMoveCode { get; set; }
		public int iWinCount { get; set; }
		public int iLossCount { get; set; }
		public int iDrawCount { get; set; }

		/// <summary>
		/// Last player move time(stamp)
		/// </summary>
		public DateTime TimeStamp { get; set; }

		public int iPrivileges { get; set; }
		public string sExternalId { get; set; }
		public string UserName { get; set; }

		public abstract ICollection<Path> InkBallPath { get; set; }
		public abstract ICollection<Point> InkBallPoint { get; set; }

		public int GetWinCount() => iWinCount;

		public void SetWinCount(int value)
		{
			iWinCount = value;
		}

		public int GetLossCount() => iLossCount;

		public void SetLossCount(int value)
		{
			iLossCount = value;
		}

		public int GetDrawCount() => iDrawCount;

		public void SetDrawCount(int value)
		{
			iDrawCount = value;
		}

		public bool IsLastMoveOverdue()
		{
			TimeSpan last_move = DateTime.Now - this.TimeStamp;
			if (last_move > InkBallGame.GetDeactivationDelayInSeconds())
				return true;
			return false;
		}

		public bool IsDelayedPathDrawPossible()
		{
			bool last_move_was_point = sLastMoveCode.Contains(nameof(IPoint.iX), StringComparison.InvariantCultureIgnoreCase);
			return last_move_was_point && TimeStamp.AddSeconds(Constants.PathAfterPointDrawAllowanceSecAmount) > DateTime.Now;
		}

		public bool IsCpuPlayer => this.iId == -1;
	}

	public partial class InkBallPlayer : CommonPlayer<InkBallPoint, InkBallPath>
	{
		internal const string CPUOponentPlayerName = "Multi CPU Oponent UserPlayer";

		//public InkBallUser User { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer1 { get; set; }
		public ICollection<InkBallGame> InkBallGameIPlayer2 { get; set; }
		public override ICollection<InkBallPath> InkBallPath { get; set; }
		public override ICollection<InkBallPoint> InkBallPoint { get; set; }

		public InkBallPlayer()
		{
		}
	}

	//[Serializable]
	public class InkBallPlayerViewModel : CommonPlayer<InkBallPointViewModel, InkBallPathViewModel>
	{
		//public InkBallUserViewModel User { get; set; }
		public override ICollection<InkBallPathViewModel> InkBallPath { get; set; }
		public override ICollection<InkBallPointViewModel> InkBallPoint { get; set; }

		public InkBallPlayerViewModel()
		{
		}

		public InkBallPlayerViewModel(InkBallPlayer player/*, bool loadUser = true*/)
		{
			iId = player.iId;
			//iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;

			iPrivileges = player.iPrivileges;
			sExternalId = player.sExternalId;
			UserName = player.UserName;

            //if (loadUser && player.User != null)
            //{
            //	User = new InkBallUserViewModel(player.User);
            //}
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
			//iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;

			iPrivileges = player.iPrivileges;
			sExternalId = player.sExternalId;
			UserName = player.UserName;

			//if (player.User != null)
			//{
			//	User = player.User;
			//}
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
