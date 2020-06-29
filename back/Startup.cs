using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Services;

namespace sql_generator_backend {
	public class Startup {
		public void ConfigureServices (IServiceCollection services) {
			services.AddScoped<ISqlGeneratorBackgraoundWorker, SqlGeneratorBackgraoundWorker> ();

			services.AddMvc ();
			services.AddCors ();
		}

		public void Configure (IApplicationBuilder app, IHostingEnvironment env) {
			app.UseForwardedHeaders (new ForwardedHeadersOptions {
				ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
			});
			
			if (env.IsDevelopment ()) {
				app.UseDeveloperExceptionPage ();
			}

			app.UseHttpsRedirection ();

			app.UseCors (x => x.AllowAnyHeader ().AllowAnyMethod ().AllowAnyOrigin ().AllowCredentials ());
			app.UseMvc ();
		}
	}
}