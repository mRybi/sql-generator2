using System.Threading.Tasks;
using Domain;

namespace Services {
	public interface ISqlGeneratorBackgraoundWorker {
		Task<string> GenerateMS (Diagram diagram);
		Task<string> GenerateMy (Diagram diagram);
	}
}