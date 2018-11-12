using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InkBall.Module.Pages
{
	public abstract class BasePageModel : PageModel
	{
		protected readonly GamesContext _dbContext;

		protected readonly ILogger<BasePageModel> _logger;

		public int InkBallUserId { get; protected set; }

		public InkBallUserViewModel GameUser { get; protected set; }

		public InkBallPlayerViewModel Player { get; protected set; }

		public string UserName => base.User.FindFirstValue(ClaimTypes.NameIdentifier);

		public InkBallGameViewModel Game { get; protected set; }

		[TempData]
		public string Message { get; set; }

		public BasePageModel(GamesContext dbContext, ILogger<BasePageModel> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		protected InkBallUserViewModel GetUser()
		{
			InkBallUserViewModel user = null;
			if (int.TryParse(User.FindFirstValue(nameof(InkBallUserId)), out var inkBallUserId) && inkBallUserId > 0)
			{
				InkBallUserId = inkBallUserId;
				user = HttpContext.Session.Get<InkBallUserViewModel>(nameof(InkBallUserViewModel));
				if (user == null)
				{
					InkBallUser dbuser = _dbContext.InkBallUsers.Include(x => x.InkBallPlayer).FirstOrDefault(f => f.iId == InkBallUserId);
					user = new InkBallUserViewModel(dbuser);
					HttpContext.Session.Set<InkBallUserViewModel>(nameof(InkBallUserViewModel), user);
				}
			}
			return user;
		}

		protected async Task<InkBallGameViewModel> GetGame(InkBallPlayerViewModel player, CancellationToken token = default)
		{
			InkBallGameViewModel game = null;
			if (base.HttpContext.Session.IsAvailable &&
				(game = base.HttpContext.Session.Get<InkBallGameViewModel>(nameof(InkBallGameViewModel))) != null)
			{
			}
			else if (player != null)
			{
				var query = from g in _dbContext.InkBallGame.Include(p1 => p1.Player1).Include(p2 => p2.Player2)
							where (g.iPlayer1Id == player.iId || g.iPlayer2Id == player.iId)
							&& (g.GameState == InkBallGame.GameStateEnum.ACTIVE || g.GameState == InkBallGame.GameStateEnum.AWAITING)
							select g;
				var dbGame = await query.FirstOrDefaultAsync(token);
				if (dbGame != null)
				{
					game = new InkBallGameViewModel(dbGame);
					HttpContext.Session.Set<InkBallGameViewModel>(nameof(InkBallGameViewModel), game);
				}
			}

			return game;
		}

		protected async Task<InkBallPlayerViewModel> GetPlayer(InkBallUserViewModel user, CancellationToken token)
		{
			if (user == null)
				return null;

			InkBallPlayer dbPlayer;
			if (user.InkBallPlayer != null)
			{
				return user.InkBallPlayer.FirstOrDefault();
			}

			var query = from p in _dbContext.InkBallPlayer.Include(x => x.User)
						where p.iUserId == user.iId
						select p;
			dbPlayer = await query.FirstOrDefaultAsync(token);

			if (dbPlayer == null)
			{
				dbPlayer = new InkBallPlayer
				{
					// User = user,
					iUserId = user.iId,
					iDrawCount = 0,
					iWinCount = 0,
					iLossCount = 0,
					TimeStamp = DateTime.UtcNow,
				};

				await _dbContext.InkBallPlayer.AddAsync(dbPlayer, token);
				await _dbContext.SaveChangesAsync(token);
			}

			var player = new InkBallPlayerViewModel(dbPlayer);

			//refresh user in session
			user.InkBallPlayer = new[] { player };
			HttpContext.Session.Set<InkBallUserViewModel>(nameof(InkBallUserViewModel), user);

			return player;
		}
	}
}
