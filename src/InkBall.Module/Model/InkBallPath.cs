using System;
using System.Collections.Generic;
using System.Linq;
using MessagePack;
using Newtonsoft.Json;

namespace InkBall.Module.Model
{
	public interface IPath<Point>
		where Point : IPoint
	{
		int iId { get; set; }
		int iGameId { get; set; }
		int iPlayerId { get; set; }

		ICollection<Point> InkBallPoint { get; set; }
	}

	public partial class InkBallPath : IPath<InkBallPoint>
	{
		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }

		public InkBallGame Game { get; set; }
		public InkBallPlayer Player { get; set; }
		public ICollection<InkBallPoint> InkBallPoint { get; set; }
		public ICollection<InkBallPointsInPath> InkBallPointsInPath { get; set; }

		public InkBallPath()
		{
			InkBallPoint = new HashSet<InkBallPoint>();

			InkBallPointsInPath = new HashSet<InkBallPointsInPath>();
		}
	}

	[MessagePackObject(true)]
	public class InkBallPathViewModel : IPath<InkBallPointViewModel>
	{
		#region Fields

		private ICollection<InkBallPointViewModel> _inkBallPoint;
		private ICollection<InkBallPointViewModel> _ownedPoints;

		#endregion Fields

		public int iId { get; set; }
		public int iGameId { get; set; }
		public int iPlayerId { get; set; }

		//legacy
		public string sPointsAsString { get; set; }
		//legacy
		public string sOwnedPointsAsString { get; set; }


		///Points creating the path; path points
		[JsonIgnore]
		[IgnoreMember]
		public ICollection<InkBallPointViewModel> InkBallPoint
		{
			get
			{
				if (!(_inkBallPoint?.Count > 0) && !string.IsNullOrEmpty(sPointsAsString))
				{
					_inkBallPoint = StringToPointCollection(sPointsAsString,
						InkBall.Module.Model.InkBallPoint.StatusEnum.POINT_STARTING,
						InkBall.Module.Model.InkBallPoint.StatusEnum.POINT_IN_PATH
					).ToArray();
				}

				return _inkBallPoint;
			}
			set { _inkBallPoint = value; }
		}

		///Oponent points enclosed within this users path
		public ICollection<InkBallPointViewModel> GetOwnedPoints(InkBall.Module.Model.InkBallPoint.StatusEnum ownedStatus)
		{
			if (!(_ownedPoints?.Count > 0) && !string.IsNullOrEmpty(sOwnedPointsAsString))
			{
				_ownedPoints = StringToPointCollection(sOwnedPointsAsString, ownedStatus, ownedStatus).ToArray();
			}
			return _ownedPoints;
		}

		public void SetOwnedPoints(ICollection<InkBallPointViewModel> ownedPoints)
		{
			_ownedPoints = ownedPoints;
		}

		private IEnumerable<InkBallPointViewModel> StringToPointCollection(string pointsAsString, InkBallPoint.StatusEnum firstPointStatus,
			InkBallPoint.StatusEnum subsequentStatuses)
		{
			var tab = pointsAsString.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
			InkBallPoint.StatusEnum status = firstPointStatus;
			foreach (var strP in tab)
			{
				var strXY = strP.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
				if (int.TryParse(strXY[0], out int x) && int.TryParse(strXY[1], out int y))
				{
					yield return new InkBallPointViewModel
					{
						//iId = 0,
						iGameId = this.iGameId,
						iPlayerId = this.iPlayerId,
						iX = x,
						iY = y,
						Status = status,
						iEnclosingPathId = 0
					};
					status = subsequentStatuses;
				}
			}
		}

		public InkBallPathViewModel()
		{ }

		public InkBallPathViewModel(InkBallPath path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
			sPointsAsString = null;
			sOwnedPointsAsString = null;

			if (path?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = path.InkBallPoint.Select(p => new InkBallPointViewModel(p)).ToArray();
			}
		}

		public InkBallPathViewModel(InkBallPathViewModel path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
			sPointsAsString = path.sPointsAsString;
			sOwnedPointsAsString = path.sOwnedPointsAsString;

			if (path?.InkBallPoint?.Count > 0)
			{
				InkBallPoint = path.InkBallPoint;
			}
		}
	}
}
