#define LOAD_POINTS_AND_PATHS_FROM_SIGNALR

using InkBall.Module.Hubs;
using InkBall.Module.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class IndexModel : BasePageModel
	{
		private readonly IOptions<HubOptions> _signalRHubOptions;

		public (IEnumerable<InkBallPath> Paths, IEnumerable<InkBallPoint> Points) PlayerPointsAndPaths { get; protected set; }

		public bool IsReadonly { get; private set; }


		public TimeSpan ClientTimeoutInterval
		{
			get
			{
				return _signalRHubOptions.Value.ClientTimeoutInterval.GetValueOrDefault(TimeSpan.FromSeconds(30));
			}
		}

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
				var points = path.InkBallPointsInPath/*.OrderBy(o => o.Order)*/;
				builder.AppendFormat("{0}[{1}\"", comma
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
					"\",{0}/*playerID*/]",
#else
					"\",{0}]",
#endif
					path.iPlayerId);
				comma = ",\r";
			}
			builder.Append(']');

			return builder.ToString();
		}

		public IndexModel(GamesContext dbContext, ILogger<BasePageModel> logger, IOptions<HubOptions> signalRHubOptions)
			: base(dbContext, logger)
		{
			_signalRHubOptions = signalRHubOptions;
		}

		public async Task<IActionResult> OnGetAsync()
		{
			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			var token = HttpContext.RequestAborted;

			await base.LoadUserPlayerAndGameAsync();

			if (Game == null)
			{
				Message = "No active game for you";

				return Redirect("Home");
			}

			this.IsReadonly = false;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token);
#endif
			return Page();
		}

		public async Task<IActionResult> OnGetViewAsync(GameIdModel model)
		{
			if (!GameHub.WebSocketAllowedOrigins.Any())
				GameHub.WebSocketAllowedOrigins.Add($"{Request.Scheme}://{Request.Host}");
			else
				GameHub.WebSocketAllowedOrigins.AddOrUpdate($"{Request.Scheme}://{Request.Host}");

			if (!ModelState.IsValid)//model.GameID <= 0
			{
				Message = "View only: Bad GameID";

				return Redirect("Home");
			}

			var token = HttpContext.RequestAborted;

			Game = await _dbContext.GetGameFromDatabaseAsync(model.GameID, true, token);

			if (Game == null ||
				!int.TryParse(User.FindFirstValue(nameof(InkBallUserId)), out var inkBallUserId) || inkBallUserId <= 0 ||
				Game?.Player1?.iUserId == inkBallUserId || Game?.Player2?.iUserId == inkBallUserId)
			{
				Message = "View only: It is your game, or bad GameID";

				return Redirect("Home");
			}
			if (Player == null)
				Player = Game.Player1;

			this.IsReadonly = true;

#if !LOAD_POINTS_AND_PATHS_FROM_SIGNALR
			PlayerPointsAndPaths = await _dbContext.LoadPointsAndPathsAsync(Game.iId, token);
#endif
			return Page();
		}
	}
}
