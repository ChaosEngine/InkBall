using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class IndexModel : BasePageModel
	{
		public InkBallPlayer OtherPlayer { get; protected set; }

		public (IEnumerable<InkBallPath> paths, IEnumerable<InkBallPoint> points) ThisPlayerPointsAndPaths { get; private set; }

		public (IEnumerable<InkBallPath> paths, IEnumerable<InkBallPoint> points) OtherPlayerPointsAndPaths { get; private set; }


		public string GetPointsAsJavaScriptArray(IEnumerable<InkBallPoint> points, bool isThisPlayerPlayingWithRed, bool isMainPlayerPoints)
		{
			StringBuilder builder = new StringBuilder(100);

			string comma = "";
			builder.Append('[');
			foreach (var value in points)
			{
				builder.AppendFormat("{0}[{1},{2},", comma, value.iX, value.iY);

				if (isMainPlayerPoints)
				{
					builder.Append((int)value.Status)
#if DEBUG
					.Append("/*mine*/")
#endif
					;
				}
				else
				{
					switch (value.Status)
					{
						case InkBallPoint.StatusEnum.POINT_FREE:
						case InkBallPoint.StatusEnum.POINT_FREE_RED:
						case InkBallPoint.StatusEnum.POINT_FREE_BLUE:
						case InkBallPoint.StatusEnum.POINT_STARTING:
						case InkBallPoint.StatusEnum.POINT_IN_PATH:
							if (isThisPlayerPlayingWithRed)
							{
								builder.Append((int)InkBallPoint.StatusEnum.POINT_FREE_BLUE)
#if DEBUG
									.Append("/*red*/")
#endif
									;
							}
							else
							{
								//builder.Append("-3");
								builder.Append((int)InkBallPoint.StatusEnum.POINT_FREE_RED)
#if DEBUG
									.Append("/*blue*/")
#endif
									;
							}
							break;
						case InkBallPoint.StatusEnum.POINT_OWNED_BY_RED:
						case InkBallPoint.StatusEnum.POINT_OWNED_BY_BLUE:
							builder.Append((int)value.Status)
#if DEBUG
								.Append("/*theirs*/")
#endif
								;
							break;
					}
				}
				builder.Append("]");
				comma = ",";
			}
			builder.Append(']');

			return builder.ToString();
		}

		public string GetPathsAsJavaScriptArray(IEnumerable<InkBallPath> paths, bool isThisPlayerPlayingWithRed, bool isMainPlayerPoints)
		{
			StringBuilder builder = new StringBuilder(100);
			string comma = "";
			builder.Append('[');
			foreach (var path in paths)
			{
				var points = path.InkBallPoint;
				builder.AppendFormat("{0}[{1}'", comma
#if DEBUG
				, $"/*ID={path.iId}*/"
#else
				, ""
#endif
				);

				string space = string.Empty;
				foreach (var point in points)
				{
					builder.AppendFormat("{0}{1},{2}", space, point.iX, point.iY);
					space = " ";
				}

				builder.AppendFormat("',{0},{1}]",
#if DEBUG
					(isThisPlayerPlayingWithRed ? "true/*red*/" : "false/*blue*/"),
					(isMainPlayerPoints ? "true/*player1*/" : "false/*player2*/")
#else
					(isThisPlayerPlayingWithRed ? "true" : "false"),
					(isMainPlayerPoints ? "true" : "false")
#endif
				);
				comma = "\r,";
			}
			builder.Append(']');

			return builder.ToString();
		}

		public IndexModel(GamesContext dbContext, ILogger<BasePageModel> logger) : base(dbContext, logger)
		{ }

		public async Task<IActionResult> OnGet()
		{
			if (!ChatHub.WebSocketAllowedOrigins.Any())
				ChatHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				ChatHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			await base.LoadUserPlayerAndGameAsync();

			if (Game == null)
				return Redirect("Home");

			InkBallPlayer otherPlayer = Game.GetOtherPlayer();
			OtherPlayer = otherPlayer;


			var token = HttpContext.RequestAborted;
			ThisPlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, Player.iId, token);

			if (OtherPlayer != null)
			{
				OtherPlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, OtherPlayer.iId, token);
			}


			return Page();
		}
	}
}
