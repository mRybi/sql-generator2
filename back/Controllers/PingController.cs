using Microsoft.AspNetCore.Mvc;

namespace Controllers {
	[Route ("api/[controller]")]
	public class PingController : Controller {

		[HttpGet]
		public IActionResult Ping () {
			return Ok ("pong");
		}
	}
}