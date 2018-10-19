using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;

namespace InkBall.Module.Pages
{
	[Authorize(Policy = "InkBallPlayerPolicy")]
	public class HomeModel : PageModel
	{
		public string UserData { get; set; }

		public void OnGet()
		{
			var inkBall_user = User.Claims.FirstOrDefault(x => x.Type == "InkBallClaimType");

			UserData = User.Claims.Select(x => x.Value).Aggregate((a, b) => a.ToString() + " " + b.ToString());
			UserData += inkBall_user != null ? $"InkBallUser ID = {inkBall_user} zoom" : "";
		}
	}
}
