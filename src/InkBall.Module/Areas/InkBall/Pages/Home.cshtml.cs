using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace InkBall.Module.Pages
{
    [Authorize(Policy = "InkBallPlayer")]
    public class HomeModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
