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

		public (IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points) PlayerPointsAndPaths { get; private set; }

		public string GetPointsAsJavaScriptArray(IEnumerable<InkBallPoint> points)
		{
			StringBuilder builder = new StringBuilder("[", 300);

			string comma = string.Empty;
			foreach (var p in points)
			{
#if DEBUG
				builder.AppendFormat("{4}[/*id={5}*/{0}/*x*/,{1}/*y*/,{2}/*val*/,{3}/*playerID*/]", p.iX, p.iY, (int)p.Status, p.iPlayerId, comma, p.iId);
#else
				builder.AppendFormat("{4}[{0},{1},{2},{3}]", p.iX, p.iY, (int)p.Status, p.iPlayerId, comma);
#endif
				comma = ",\r";
			}
			builder.Append(']');

			return builder.ToString();
		}

		public string GetPathsAsJavaScriptArray(IEnumerable<InkBallPath> paths)
		{
			StringBuilder builder = new StringBuilder("[", 300);
			string comma = "";
			foreach (var path in paths)
			{
				var points = path.InkBallPointsInPath;
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
#if DEBUG
					builder.AppendFormat("{2}{0}/*x*/,{1}/*y*//*id={3}*/", point.Point.iX, point.Point.iY, space, point.Point.iId);
#else
					builder.AppendFormat("{2}{0},{1}", point.Point.iX, point.Point.iY, space);
#endif
					space = " ";
				}

				builder.AppendFormat(
#if DEBUG
					"',{0}/*playerID*/]",
#else
					"',{0}]",
#endif
					path.iPlayerId);
				comma = ",\r";
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

			// InkBallPlayer otherPlayer = Game.GetOtherPlayer();
			// OtherPlayer = otherPlayer;

			var token = HttpContext.RequestAborted;

			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token);

			return Page();
		}
	}
}
