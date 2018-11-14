using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace InkBall.Module.Model
{
	public interface IPlayer
	{
		int iId { get; set; }
		int? iUserId { get; set; }
		string sLastMoveCode { get; set; }
		int iWinCount { get; set; }
		int iLossCount { get; set; }
		int iDrawCount { get; set; }
		DateTime TimeStamp { get; set; }
	}

	public partial class InkBallPlayer : IPlayer
	{
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

		public InkBallPlayer()
		{
			InkBallGameIPlayer1 = new HashSet<InkBallGame>();
			InkBallGameIPlayer2 = new HashSet<InkBallGame>();
			InkBallPath = new HashSet<InkBallPath>();
			InkBallPoint = new HashSet<InkBallPoint>();
		}
	}

	[Serializable]
	public class InkBallPlayerViewModel : IPlayer
	{
		public int iId { get; set; }
		public int? iUserId { get; set; }
		public string sLastMoveCode { get; set; }
		public int iWinCount { get; set; }
		public int iLossCount { get; set; }
		public int iDrawCount { get; set; }
		public DateTime TimeStamp { get; set; }

		public InkBallPlayerViewModel()
		{
		}

		public InkBallPlayerViewModel(InkBallPlayer player)
		{
			iId = player.iId;
			iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;
		}
		
		//[JsonConstructor]
		public InkBallPlayerViewModel(InkBallPlayerViewModel player)
		{
			iId = player.iId;
			iUserId = player.iUserId;
			sLastMoveCode = player.sLastMoveCode;
			iWinCount = player.iWinCount;
			iLossCount = player.iLossCount;
			iDrawCount = player.iDrawCount;
			TimeStamp = player.TimeStamp;
		}
	}
}
