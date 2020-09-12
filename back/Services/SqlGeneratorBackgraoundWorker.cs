using System;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Services {
	public class SqlGeneratorBackgraoundWorker : ISqlGeneratorBackgraoundWorker {

		public async Task<string> GenerateMS (Diagram diagram) {
			return await GenerateMSSQL (diagram);
		}

		public async Task<string> GenerateMy (Diagram diagram) {
			return await GenerateMySQL (diagram);
		}

		public async Task<string> GenerateMSSQL (Diagram diagram) {
			return await Task.Run (() => GenerationTaskMSSQL (diagram));
		}

		public async Task<string> GenerateMySQL (Diagram diagram) {
			return await Task.Run (() => GenerationTaskMySQL (diagram));
		}

		private int CountPk (Node node) {
			int pkCounter = 0;
			foreach (var port in node.Ports) {
				if (port.IsPrimaryKey || port.IsPartialKey) {
					pkCounter++;
				}
			}

			return pkCounter;
		}

		private string PkNamesMS (Node node) {
			var names = "";
			foreach (var port in node.Ports) {
				if (port.IsPrimaryKey || port.IsPartialKey) {
					names += "[" + port.Label + "], ";
				}
			}

			return names.Substring (0, names.Length - 2);
		}

		private string PkNamesMy (Node node) {
			var names = "";
			foreach (var port in node.Ports) {
				if (port.IsPrimaryKey || port.IsPartialKey) {
					names += $"`{port.Label}`,";
				}
			}

			return names.Substring (0, names.Length - 1);
		}

		private SerializedModel ConvertToUml (SerializedModel diagram) {
			foreach (var link in diagram.Links) {
				var temp = link.Labels[0].LabelLabel.Substring (0, 1);
				var temp2 = link.Labels[2].LabelLabel.Substring (0, 1);

				link.Labels[0].LabelLabel = temp2 + link.Labels[0].LabelLabel.Substring (1);
				link.Labels[2].LabelLabel = temp + link.Labels[2].LabelLabel.Substring (1);
			}

			return diagram;
		}

		private string GenerationTaskMySQL (Diagram diagram) {
			SerializedModel serializedDiagram = SerializedModel.FromJson (diagram.SerializedModel);

			if (diagram.RelationType == "CHEN") {
				serializedDiagram = ConvertToUml (SerializedModel.FromJson (diagram.SerializedModel));
			}

			if (serializedDiagram.Nodes.Length == 0) {
				throw new Exception ("Diagram is empty");
			} else {
				// STRUCTURE AND PRIMARY KEY CLUSTERS
				string mySQLCode =
					$@"SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
					SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
					SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
					
					CREATE SCHEMA IF NOT EXISTS `{diagram.DatabaseName}` DEFAULT CHARACTER SET utf8mb4 ; 
					USE `{diagram.DatabaseName}`;";

				var nodes = serializedDiagram.Nodes.Where (node => !node.IsLabel).ToArray ();

				foreach (var node in nodes) {
					string[] primaryKeysTypes = {"INT", "BIGINT", "SMALLINT", "TINYINT"};
					string nodePorts = $@"";
					string nodeConstaraints = $@"";
					int pkCounter = CountPk (node);

					string names = PkNamesMy (node);

					var ports = node.Ports.Where (x => x.IsNamePort == false);

					nodeConstaraints += $@"
                    					PRIMARY KEY ({names}),";

					foreach (var port in ports) {
						if (port.IsPrimaryKey || port.IsAutoincremented) {
							if (ports.Where (p => p.IsPartialKey).ToArray ().Length > 0) {
								nodePorts += $@"`{port.Label}` {port.PropertyType} NOT NULL,";
							} else {
								if (port.IsPrimaryKey && primaryKeysTypes.Contains(port.PropertyType)) {
									nodePorts += $@"`{port.Label}` {port.PropertyType} NOT NULL AUTO_INCREMENT,";
								}
								else {
									nodePorts += $@"`{port.Label}` {port.PropertyType} NOT NULL,";
								}
							}

							if (port.IsPrimaryKey) {
								nodeConstaraints += $@"UNIQUE INDEX `{port.Label}_UNIQUE` (`{port.Label}` ASC),";
							}

						} else {
							nodePorts += $@"`{port.Label}` {port.PropertyType}";
							if (port.IsNotNull) {
								nodePorts += $@" NOT NULL,";
							}
							if (!port.IsNotNull) {
								nodePorts += $@" NULL,";
							}
							if (port.IsUnique) {
								nodeConstaraints += $@" UNIQUE INDEX `{port.Label}_UNIQUE` (`{port.Label}` ASC),";
							}
							nodePorts += $@" ";
						}

					}
					var constraints = nodeConstaraints.Length > 1 ? nodeConstaraints.Substring (0, nodeConstaraints.Length - 1) : nodeConstaraints;
					mySQLCode += $@"CREATE TABLE IF NOT EXISTS `{diagram.DatabaseName}`.`{node.Name}` (
											{nodePorts}
											{constraints})
											ENGINE = InnoDB;
									";
				}

				// FOREIGN KEYS 

				foreach (var node in serializedDiagram.Nodes) {
					var fkPorts = node.Ports.Where (port => port.IsForeignKey);
					foreach (var fk in fkPorts) {
						var fkNode = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == fk.FkNodeId);
						var linkedPKport = fkNode.Ports.Where (p => p.IsPrimaryKey || p.IsPartialKey).ToArray ();

						mySQLCode += $@"ALTER TABLE `{diagram.DatabaseName}`.`{node.Name}`
									ADD CONSTRAINT `fk_{node.Name}_{fk.Label}` 
									FOREIGN KEY(`{fk.Label}`) 
									REFERENCES `{diagram.DatabaseName}`.`{fkNode.Name}`(`{linkedPKport[0].Label}`)
									ON DELETE NO ACTION ON UPDATE NO ACTION;
									CREATE INDEX `fk_{node.Name}_{fk.Label}_idx` ON `{diagram.DatabaseName}`.`{node.Name}` (`{linkedPKport[0].Label}` ASC);                  
                          			";
					}

				}

				mySQLCode += $@"SET SQL_MODE=@OLD_SQL_MODE;
								SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
								SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;";
				return mySQLCode;
			}

		}

		private string GenerationTaskMSSQL (Diagram diagram) {
			SerializedModel serializedDiagram = SerializedModel.FromJson (diagram.SerializedModel);

			if (diagram.RelationType == "CHEN") {
				serializedDiagram = ConvertToUml (SerializedModel.FromJson (diagram.SerializedModel));
			}

			if (serializedDiagram.Nodes.Length == 0) {
				throw new Exception ("Diagram is empty");
			} else {
				// STRUCTURE AND PRIMARY KEY CLUSTERS
				string MSSQLCode =
					$@"USE master 
						GO
						CREATE DATABASE {diagram.DatabaseName} COLLATE SQL_Latin1_General_CP1_CI_AS 
						GO
						USE {diagram.DatabaseName}
						GO 
						";

				var nodes = serializedDiagram.Nodes.Where (node => !node.IsLabel).ToArray ();

				foreach (var node in nodes) {
					string[] primaryKeysTypes = {"INT", "BIGINT", "SMALLINT", "TINYINT"};

					string nodePorts = $@"";
					string nodeConstaraints = $@"";
					int pkCounter = CountPk (node);

					string names = PkNamesMS (node);

					bool clusteredPK = true;
					var ports = node.Ports.Where (x => x.IsNamePort == false);
					var pkPorts = node.Ports.Where (x => x.IsPrimaryKey);

					foreach (var port in ports) {
						if (port.IsPrimaryKey || port.IsPartialKey) {
							if (ports.Where (p => p.IsPartialKey).ToArray ().Length > 0) {
								nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL, ";
							} else {
								if (port.IsPrimaryKey && (primaryKeysTypes.Contains(port.PropertyType) || ((port.PropertyType.Contains("DECIMAL") && port.PropertyType.Contains(",0)")) || (port.PropertyType.Contains("NUMERIC") && port.PropertyType.Contains(",0)"))))) {
									nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL IDENTITY (1,1), ";

								}
								else {
									nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL, ";
								}
							}

							if (pkCounter > 1 && clusteredPK) {
								nodeConstaraints += $@"CONSTRAINT [PK_{node.Name}] PRIMARY KEY CLUSTERED
								(
								{names} ASC
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
						} else {
							nodePorts += $@"[{port.Label}] {port.PropertyType}";
							if (port.IsNotNull) {
								nodePorts += $@" NOT NULL";
							}
							if (port.IsUnique) {
								nodePorts += $@" UNIQUE";
							}
							nodePorts += $@", ";
						}

					}
					MSSQLCode += $@"CREATE TABLE [dbo].[{node.Name}] (
                {nodePorts}
                {nodeConstaraints}
            GO
            ";
				}

				// INDEXES
				foreach (var node in nodes) {
					var pkPort = node.Ports.FirstOrDefault (port => port.IsPrimaryKey);
					var fkPorts = node.Ports.Where (port => port.IsForeignKey);

					string fkPortsCode = "";
					foreach (var fk in fkPorts) {
						fkPortsCode += $@"GO
                					CREATE NONCLUSTERED INDEX [fk_dm_{node.Name}_{fk.Label}_idx] ON [{node.Name}] ([{fk.Label}] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];
            ";
					}
					if (pkPort != null) {
						MSSQLCode += $@"CREATE UNIQUE NONCLUSTERED INDEX [{pkPort.Label}_UNIQUE] ON [{node.Name}] ([{pkPort.Label}] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];";
					}
					MSSQLCode += $@"    
                {fkPortsCode}
            ";
				}

				// FOREIGN KEYS 
				foreach (var node in serializedDiagram.Nodes) {
					var fkPorts = node.Ports.Where (port => port.IsForeignKey);
					foreach (var fk in fkPorts) {
						var fkNode = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == fk.FkNodeId);
						var linkedPKport = fkNode.Ports.Where (p => p.IsPrimaryKey || p.IsPartialKey).ToArray ();

						MSSQLCode += $@"ALTER TABLE [{node.Name}] WITH CHECK ADD CONSTRAINT [fk_{node.Name}_{fk.Label}] FOREIGN KEY([{fk.Label}]) REFERENCES [dbo].[{fkNode.Name}]([{linkedPKport[0].Label}]);
									GO
									ALTER TABLE [{node.Name}] CHECK CONSTRAINT [fk_{node.Name}_{fk.Label}];";
					}
				}

				return MSSQLCode;
			}
		}
	}
}