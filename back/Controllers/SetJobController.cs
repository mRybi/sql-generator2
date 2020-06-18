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

        // POST api/setjob/mssql
        [HttpPost("mssql")]
        public async Task<IActionResult> Mssql ([FromBody] Diagram diagram) {
            try {
                var resultMS = await _sqlGenerator.GenerateMS (diagram);

                return Ok (resultMS);
            } catch (Exception e) {
                throw e;
            }
        }

        // POST api/setjob/mysql
        [HttpPost("mysql")]
        public async Task<IActionResult> Mysql ([FromBody] Diagram diagram) {
            try {
                var resultMy = await _sqlGenerator.GenerateMy (diagram);

                return Ok (resultMy);
            } catch (Exception e) {
                throw e;
            }
        }
    }
}