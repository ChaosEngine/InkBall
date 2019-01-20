using System;
using System.Collections.Generic;
using System.Linq;
using MessagePack;
using Microsoft.Extensions.Primitives;
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
		delegate void ActionRef<T1, T2, T3, T4>(ref T1 arg1, ref T2 arg2, ref T3 arg3, ref T4 arg4);

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
						InkBall.Module.Model.InkBallPoint.StatusEnum.POINT_IN_PATH,
						this.iPlayerId, EnsureContinuityOfPointsOnPath
					).ToArray();
				}

				return _inkBallPoint;
			}
			set { _inkBallPoint = value; }
		}

		///Oponent points enclosed within this users path
		public ICollection<InkBallPointViewModel> GetOwnedPoints(InkBall.Module.Model.InkBallPoint.StatusEnum ownedStatus, int otherPlayerID)
		{
			if (!(_ownedPoints?.Count > 0) && !string.IsNullOrEmpty(sOwnedPointsAsString))
			{
				_ownedPoints = StringToPointCollection(sOwnedPointsAsString, ownedStatus, ownedStatus, otherPlayerID).ToArray();
			}
			return _ownedPoints;
		}

		public void SetOwnedPoints(ICollection<InkBallPointViewModel> ownedPoints)
		{
			_ownedPoints = ownedPoints;
		}

		private IEnumerable<InkBallPointViewModel> StringToPointCollection(string pointsAsString, InkBallPoint.StatusEnum firstPointStatus,
			InkBallPoint.StatusEnum subsequentStatuses, int playerID2et, ActionRef<int, int, int, int> validateContinuityOfThePath = null)
		{
			//var tab = pointsAsString.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
			var tokensP = new StringTokenizer(pointsAsString, new char[] { ' ' });
			var comma_sep = new char[] { ',' };
			InkBallPoint.StatusEnum status = firstPointStatus;

			int i = 0, prev_x = -1, prev_y = -1;

			var strP = tokensP.ElementAt(i);
			var tokenXY = strP.Split(comma_sep);
			if (tokenXY.Count() >= 2)
			{
				if (int.TryParse(tokenXY.ElementAt(0).Value, out int x) && int.TryParse(tokenXY.ElementAt(1).Value, out int y))
				{
					prev_x = x; prev_y = y;

					yield return new InkBallPointViewModel
					{
						//iId = 0,
						iGameId = this.iGameId,
						iPlayerId = playerID2et,
						iX = x,
						iY = y,
						Status = status,
						iEnclosingPathId = 0
					};
					status = subsequentStatuses;
				}
			}

			for (i++; i < tokensP.Count(); i++)
			{
				strP = tokensP.ElementAt(i);
				tokenXY = strP.Split(comma_sep);
				if (tokenXY.Count() >= 2)
				{
					if (int.TryParse(tokenXY.ElementAt(0).Value, out int x) && int.TryParse(tokenXY.ElementAt(1).Value, out int y))
					{
						validateContinuityOfThePath?.Invoke(ref prev_x, ref prev_y, ref x, ref y);

						yield return new InkBallPointViewModel
						{
							//iId = 0,
							iGameId = this.iGameId,
							iPlayerId = playerID2et,
							iX = x,
							iY = y,
							Status = status,
							iEnclosingPathId = 0
						};
						status = subsequentStatuses;
					}
				}
			}
		}

		void EnsureContinuityOfPointsOnPath(ref int prevX, ref int prevY, ref int x, ref int y)
		{
			int diff_x = Math.Abs(prevX - x), diff_y = Math.Abs(prevY - y);

			if (diff_x > 1 || diff_y > 1)
				throw new ArgumentOutOfRangeException("points are not stacked one after the other");

			prevX = x; prevY = y;
		}

		public InkBallPathViewModel()
		{ }

		public InkBallPathViewModel(InkBallPath path, string pointsAsString = null, string ownedPointsAsString = null)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
			this.sPointsAsString = pointsAsString;
			this.sOwnedPointsAsString = ownedPointsAsString;

			if (path?.InkBallPoint?.Count > 0)
			{
				this.InkBallPoint = path.InkBallPoint.Select(p => new InkBallPointViewModel(p)).ToArray();
			}
		}

		public InkBallPathViewModel(InkBallPathViewModel path)
		{
			this.iId = path.iId;
			this.iGameId = path.iGameId;
			this.iPlayerId = path.iPlayerId;
			this.sPointsAsString = path.sPointsAsString;
			this.sOwnedPointsAsString = path.sOwnedPointsAsString;

			if (path?.InkBallPoint?.Count > 0)
			{
				this.InkBallPoint = path.InkBallPoint;
			}
		}


		/**
		 * Based on http://www.faqs.org/faqs/graphics/algorithms-faq/
		 * but mainly on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		 * returns != 0 if point is inside path
		 * @param {number} npol points count
		 * @param {number} xp x point coordinates
		 * @param {number} yp y point coordinates
		 * @param {number} x point to check x coordinate
		 * @param {number} y point to check y coordinate
		 * @returns {boolean} if point lies inside the polygon
		 */
		static bool pnpoly(int npol, int[] xp, int[] yp, int x, int y)
		{
			int i, j; bool c = false;

			for (i = 0, j = npol - 1; i < npol; j = i++)
			{
				if ((((yp[i] <= y) && (y < yp[j])) ||
					((yp[j] <= y) && (y < yp[i]))) &&
					(x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i]))

					c = !c;
			}
			return c;
		}

		static bool pnpoly(ICollection<IPoint> path, int x, int y)
		{
			int i, j, npol = path.Count; bool c = false;

			for (i = 0, j = npol - 1; i < npol; j = i++)
			{
				IPoint pi = path.ElementAt(i), pj = path.ElementAt(j);

				if ((((pi.iY <= y) && (y < pj.iY)) ||
					((pj.iY <= y) && (y < pi.iY))) &&
					(x < (pj.iX - pi.iX) * (y - pi.iY) / (pj.iY - pi.iY) + pi.iX))

					c = !c;
			}
			return c;
		}

		public bool IsPointInsidePath(IPoint point)
		{
			var path_points = (ICollection<IPoint>)this.InkBallPoint;

			return pnpoly(path_points, point.iX, point.iY);
		}
	}
}
