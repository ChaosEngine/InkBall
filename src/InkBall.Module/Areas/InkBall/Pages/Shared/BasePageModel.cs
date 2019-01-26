using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using InkBall.Module.Model;

namespace InkBall.Module.Pages
{
	public abstract class BasePageModel : PageModel
	{
		protected readonly GamesContext _dbContext;

		protected readonly ILogger<BasePageModel> _logger;

		public int InkBallUserId { get; protected set; }

		public InkBallUser GameUser { get; protected set; }

		public InkBallPlayer Player { get; protected set; }

		public virtual string UserName => GameUser.UserName;

		public InkBallGame Game { get; protected set; }

		[TempData]
		public string Message { get; set; }

		public BasePageModel(GamesContext dbContext, ILogger<BasePageModel> logger)
		{
			_dbContext = dbContext;
			_logger = logger;
		}

		protected virtual async Task<InkBallUser> GetUserAsync(CancellationToken token = default)
		{
			InkBallUser user = null;
			if (int.TryParse(User.FindFirstValue(nameof(InkBallUserId)), out var inkBallUserId) && inkBallUserId > 0)
			{
				InkBallUserId = inkBallUserId;
				//user = HttpContext.Session.Get<InkBallUserViewModel>(nameof(InkBallUserViewModel));
				if (user == null)
				{
					InkBallUser dbuser = await _dbContext.InkBallUsers.Include(x => x.InkBallPlayer)
						.FirstOrDefaultAsync(f => f.iId == InkBallUserId, token);
					user = dbuser;
					//HttpContext.Session.Set<InkBallUserViewModel>(nameof(InkBallUserViewModel), user);
				}
			}
			return user;
		}

		protected virtual async Task<InkBallGame> GetGameAsync(InkBallPlayer player, CancellationToken token = default)
		{
			InkBallGame game = null;// base.HttpContext.Session.Get<InkBallGameViewModel>(nameof(InkBallGameViewModel));
			if (game != null)
			{
			}
			else if (player != null)
			{
				var query = from g in _dbContext.InkBallGame
								.Include(p1 => p1.Player1).ThenInclude(x => x.User)
								.Include(p2 => p2.Player2).ThenInclude(x => x.User)
							where (g.iPlayer1Id == player.iId || g.iPlayer2Id == player.iId)
							&& (g.GameState == InkBallGame.GameStateEnum.ACTIVE || g.GameState == InkBallGame.GameStateEnum.AWAITING)
							select g;
				var dbGame = await query.FirstOrDefaultAsync(token);
				if (dbGame != null)
				{
					bool bIsPlayer1;
					if (player.iId == dbGame.iPlayer1Id)
						bIsPlayer1 = true;
					else if (player.iId == dbGame.iPlayer2Id)
						bIsPlayer1 = false;
					else
						throw new NotSupportedException("player not found");
					dbGame.bIsPlayer1 = bIsPlayer1;

					game = dbGame;
					//HttpContext.Session.Set<InkBallGameViewModel>(nameof(InkBallGameViewModel), game);
				}
			}

			return game;
		}

		protected virtual async Task<InkBallPlayer> GetPlayerAsync(InkBallUser user, CancellationToken token)
		{
			if (user == null)
				return null;

			if (user.InkBallPlayer?.Count > 0)
			{
				return user.InkBallPlayer.FirstOrDefault();
			}

			var query = from p in _dbContext.InkBallPlayer.Include(x => x.User)
						where p.iUserId == user.iId
						select p;
			InkBallPlayer dbPlayer = await query.FirstOrDefaultAsync(token);

			if (dbPlayer == null)
			{
				dbPlayer = new InkBallPlayer
				{
					// User = user,
					iUserId = user.iId,
					iDrawCount = 0,
					iWinCount = 0,
					iLossCount = 0,
					//TimeStamp = DateTime.Now,
				};

				await _dbContext.InkBallPlayer.AddAsync(dbPlayer, token);
				await _dbContext.SaveChangesAsync(token);
			}

			var player = dbPlayer;

			//refresh user in session
			user.InkBallPlayer = new[] { player };
			//HttpContext.Session.Set<InkBallUserViewModel>(nameof(InkBallUserViewModel), user);

			return player;
		}

		public virtual async Task LoadUserPlayerAndGameAsync()
		{
			InkBallUser user = await GetUserAsync();
			GameUser = user;

			var token = HttpContext.RequestAborted;

			InkBallPlayer player = await GetPlayerAsync(user, token);
			Player = player;

			InkBallGame game = await GetGameAsync(player, token);
			Game = game;
		}
	}
}
