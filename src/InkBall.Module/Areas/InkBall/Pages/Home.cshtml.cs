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
	[Authorize(Policy = "InkBallPlayerRole")]
	public class HomeModel : PageModel
	{
		public string UserData { get; set; }

		public void OnGet(
			// [FromServices]UserManager<IdentityUser> userManager
			)
		{
			//var userManager = serviceProvider.GetService(typeof(UserManager<IdentityUser>));

			UserData = User.Claims.Select(x => x.Value).Aggregate((a, b) => a.ToString() + " " + b.ToString());
		}
	}
}
