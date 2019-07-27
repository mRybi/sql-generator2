using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<string> Post ([FromBody] Diagram diagram) {
            var result = await _sqlGenerator.Generate (diagram);
            return result;
        }
    }
}