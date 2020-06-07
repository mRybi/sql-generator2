using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace sql_generator_backend {
    public class Program {
        public static void Main (string[] args) {
            CreateWebHostBuilder (args).Build ().Run ();
        }

        public static IWebHostBuilder CreateWebHostBuilder (string[] args) =>
            WebHost.CreateDefaultBuilder (args)
            .UseUrls("localhost:5001")
            .UseStartup<Startup> ();
    }
}