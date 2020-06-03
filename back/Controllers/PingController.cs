using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers {
    [Route ("api/[controller]")]
    public class PingController : Controller {

        [HttpGet]
        public IActionResult Ping () {
            return Ok("pong");
        }
    }
}