using System.Threading.Tasks;
using Domain;

namespace Services{
    public interface ISqlGeneratorBackgraoundWorker {
        Task<string> Generate(Diagram diagram);
        void GenerateBGW(Diagram diagram);

    }

}