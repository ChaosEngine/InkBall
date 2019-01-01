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

		public void GetPointsAsJavaScriptInitScript(IEnumerable<InkBallPoint> points, string jsMethodCall, string pointPrefix,
			bool isThisPlayerPlayingWithRed, bool isMainPlayerPoints, ref StringBuilder builder)
		{
			foreach (var value in points)
			{
				builder.AppendFormat("{0}({1},{2},", jsMethodCall, value.iX, value.iY);

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
								//builder.Append("-2");
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
							builder/*.Append(pointPrefix)*/.Append((int)value.Status)
#if DEBUG
								.Append("/*theirs*/")
#endif
								;
							break;
					}
				}

				builder.Append(");").AppendLine();
			}
		}

		public void GetPathsAsJavaScriptInitScript(IEnumerable<InkBallPath> paths, string jsMethodCall, bool isThisPlayerPlayingWithRed, bool isMainPlayerPoints,
			ref StringBuilder builder)
		{
			foreach (var path in paths)
			{
				var points = path.InkBallPoint;
				builder.AppendFormat("{0}('", jsMethodCall);

				string sDelimiter = string.Empty;
				foreach (var point in points)
				{
					builder.AppendFormat("{0}{1},{2}", sDelimiter, point.iX, point.iY);
					sDelimiter = " ";
				}

				builder.AppendFormat("',{0},{1});",
					(isThisPlayerPlayingWithRed ? "true" : "false"),
					(isMainPlayerPoints ? "true" : "false")
				).AppendLine();
			}
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

			return Page();
		}

		public async Task<string> GetPointsAndPathsAsInitScriptAsync(string pointJsMethodCall = "badSetPoint", string pathJsMethodCall = "badSetPath",
			string pointJsEnumPrefix = "badGame.")
		{
			var token = HttpContext.RequestAborted;

			var this_points_n_paths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, Player.iId, token);

			var sb = new StringBuilder(600);
			GetPointsAsJavaScriptInitScript(this_points_n_paths.points, pointJsMethodCall, pointJsEnumPrefix, Game.IsThisPlayerPlayingWithRed(), true, ref sb);
			GetPathsAsJavaScriptInitScript(this_points_n_paths.paths, pathJsMethodCall, Game.IsThisPlayerPlayingWithRed(), true, ref sb);
			if (OtherPlayer != null)
			{
				var other_points_n_paths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, OtherPlayer.iId, token);
				GetPointsAsJavaScriptInitScript(other_points_n_paths.points, pointJsMethodCall, pointJsEnumPrefix, Game.IsThisPlayerPlayingWithRed(), false, ref sb);
				GetPathsAsJavaScriptInitScript(other_points_n_paths.paths, pathJsMethodCall, Game.IsThisPlayerPlayingWithRed(), false, ref sb);
			}

			return sb.ToString();
		}
	}
}
