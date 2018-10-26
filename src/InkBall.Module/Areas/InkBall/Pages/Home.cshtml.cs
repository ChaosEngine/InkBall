using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class HomeModel : PageModel
	{
		public IEnumerable<string> UserData { get; set; }
		public string InkBallID { get; private set; }

		public void OnGet()
		{
			var inkBall_user = User.FindFirstValue("InkBallClaimType");

			UserData = User.Claims.Select(x => x.Value).ToArray();
			InkBallID = inkBall_user != null ? $"InkBallUser ID = {inkBall_user}" : "";
		}
	}
}
