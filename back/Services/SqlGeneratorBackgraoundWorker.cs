using System;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Hangfire;
using Hangfire.Storage;

namespace Services {
	public class SqlGeneratorBackgraoundWorker : ISqlGeneratorBackgraoundWorker {
		public void GenerateBGW (Diagram diagram) {
			BackgroundJob.Enqueue (() => GenerateMSSQL (diagram));

			// JobData jd = JobStorage.Current.GetConnection().GetJobData(xd);
			// Console.WriteLine("SADASDASDDA", xd);
		}
		public async Task<string> Generate (Diagram diagram) {
			var response = await GenerateMSSQL (diagram);
			return response;
		}

		private int CountPk (Node node) {
			int pkCounter = 0;
			foreach (var port in node.Ports) {
				if (port.IsPrimaryKey) {
					pkCounter++;
				}
			}

			return pkCounter;
		}

		private string PkNames (Node node) {
			var names = "";
			foreach (var port in node.Ports) {
				if (port.IsPrimaryKey) {
					names += port.Label + ", ";
				}
			}

			return names;
		}

		private string GenerationTask(Diagram diagram) {
			if (diagram == null) {
				Console.WriteLine ("Diagram is null");
			}
			var serializedDiagram = SerializedDiagram.FromJson (diagram.SerializedDiagram);

			// STRUCTURE AND PRIMARY KEY CLUSTERS
			string MSSQLCode = $@"USE master 
                            GO
                            CREATE DATABASE {diagram.DatabaseName} COLLATE SQL_Latin1_General_CP1_CI_AS 
                            GO
                            USE {diagram.DatabaseName}
                            GO 
                            ";

			foreach (var node in serializedDiagram.Nodes) {
				string nodePorts = $@"";
				string nodeConstaraints = $@"";
				int pkCounter = CountPk (node);
				var names = PkNames (node);
				bool clusteredPK = true;
				foreach (var port in node.Ports) {

					if (port.IsPrimaryKey) {
						nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL IDENTITY (1,1),";
						if (pkCounter > 1 && clusteredPK) {
							nodeConstaraints += $@"CONSTRAINT [PK_{node.Name}] PRIMARY KEY CLUSTERED
                        (
                            [{names.Substring(0, names.Length - 2)}] ASC
                        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
                        ) ON [PRIMARY]
                        ";
							clusteredPK = false;
						} else if (pkCounter == 1) {
							nodeConstaraints += $@"CONSTRAINT [PK_{node.Name}] PRIMARY KEY CLUSTERED
                        (
                            [{port.Label}] ASC
                        ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
                        ) ON [PRIMARY]
                        ";
							clusteredPK = false;
						}
					} else if (port.IsForeignKey || port.IsNotNull) {
						nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL,";
					} else if (port.IsUnique) {
						nodePorts += $@"[{port.Label}] {port.PropertyType} UNIQUE,";
					} else {
						nodePorts += $@"[{port.Label}] {port.PropertyType},";
					}
				}
				MSSQLCode += $@"CREATE TABLE [dbo].[{node.Name}] (
                {nodePorts}
                {nodeConstaraints}
            GO
            ";
			}

			// INDEXES
			foreach (var node in serializedDiagram.Nodes) {
				var pkPort = node.Ports.FirstOrDefault (port => port.IsPrimaryKey);
				var fkPorts = node.Ports.Where (port => port.IsForeignKey);

				string fkPortsCode = "";
				foreach (var fk in fkPorts) {
					fkPortsCode += $@"GO
                CREATE NONCLUSTERED INDEX [fk_dm_{node.Name}_{fk.Label}_idx] ON [{node.Name}] ([{fk.Label}] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];
            ";
				}

				MSSQLCode += $@"CREATE UNIQUE NONCLUSTERED INDEX [{pkPort.Label}_UNIQUE] ON [{node.Name}] ([id] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];
                {fkPortsCode}
            ";
			}

			// FOREIGN KEYS
			foreach (var node in serializedDiagram.Nodes) {
				var fkPorts = node.Ports.Where (port => port.IsForeignKey);

				foreach (var fk in fkPorts) {
					foreach (var linkID in fk.Links) {
						var linkTarget = serializedDiagram.Links.FirstOrDefault (x => x.Id == linkID).Source;
						var nodeLinked = serializedDiagram.Nodes.FirstOrDefault (x => x.Id == linkTarget);
						if (nodeLinked.Name == node.Name) {

							linkTarget = serializedDiagram.Links.FirstOrDefault (x => x.Id == linkID).Target;
							nodeLinked = serializedDiagram.Nodes.FirstOrDefault (x => x.Id == linkTarget);
						}

						MSSQLCode += $@"ALTER TABLE [{node.Name}] WITH CHECK ADD CONSTRAINT [fk_{node.Name}_{fk.Label}] FOREIGN KEY([{fk.Label}]) REFERENCES [dbo].[{nodeLinked.Name}]([id]);
												GO
												ALTER TABLE [{node.Name}] CHECK CONSTRAINT [fk_{node.Name}_{fk.Label}];";
					}

				}

			}

			return MSSQLCode;
		
		}

		public async Task<string> GenerateMSSQL (Diagram diagram) {
			var x = await Task.Run(() => GenerationTask(diagram));
			return x;
		}
			
	}
}