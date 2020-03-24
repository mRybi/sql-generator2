using System;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers {
    [Route ("api/[controller]")]
    public class SetJobController : Controller {
        private ISqlGeneratorBackgraoundWorker _sqlGenerator;
        public SetJobController (ISqlGeneratorBackgraoundWorker sqlGenerator) {
            _sqlGenerator = sqlGenerator;
        }
        // GET api/setjob
        [HttpPost]
        public async Task<IActionResult> Post ([FromBody] Diagram diagram) {
            try {
                var result = await _sqlGenerator.Generate (diagram);
                return Ok (result);
            } catch (Exception e) {
                throw e;
            }
        }
    }
}