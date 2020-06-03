using System;
using System.Collections.Generic;
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
                    names += "["+port.Label + "], ";
                }
            }

            return names.Substring(0, names.Length -2);
        }

        private string PkNamesMy (Node node) {
            var names = "";
            foreach (var port in node.Ports) {
                if (port.IsPrimaryKey || port.IsPartialKey) {
                    names += $"`{port.Label}`,";
                }
            }

            return names.Substring(0, names.Length -1);
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

        private void PrepareForeignKeys (SerializedModel serializedDiagram) {
            foreach (var link in serializedDiagram.Links) {
                Node source = null, target = null;

                string left = link.Labels[0].LabelLabel;
                string right = link.Labels[2].LabelLabel;

                if (right.Contains ('N') && left.Contains ('N')) {

                    source = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Source);
                    target = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Target);
                    // relation node
                    Node relationNode = new Node ($"rl_{source.Name}_{link.Labels[1].LabelLabel}_{target.Name}");
                    var nodes = serializedDiagram.Nodes.Append (relationNode);
                    serializedDiagram.Nodes = nodes.ToArray ();
                    // id
                    Port newPortPK = new Port (false, "Id", "INT", source.Id, true, false, true, true, true);

                    Port[] relAtributes = new Port[link.Properties.Length];
                    var counter = 0;
                    foreach (var property in link.Properties) {
                        Port a = new Port (false, property.Label, property.propertyType, source.Id, property.IsPrimaryKey, false, property.IsAutoincremented, property.IsNotNull, property.IsUnique);
                        relAtributes[counter] = a;
                        counter++;
                    };

                    // target
                    Port newFKTarget1, newFKSource1;

                    if (target.Name == source.Name) {
                        // target
                        newFKTarget1 = new Port (false, target.Name + "Id1", "INT", source.Id, false, true, false, true);
                        // source 
                        newFKSource1 = new Port (false, source.Name + "Id2", "INT", source.Id, false, true, false, true);

                    } else {
                        // target
                        newFKTarget1 = new Port (false, target.Name + "Id", "INT", source.Id, false, true, false, true);
                        // source 
                        newFKSource1 = new Port (false, source.Name + "Id", "INT", source.Id, false, true, false, true);

                    }

                    Link linkSource = new Link (relationNode.Id, newFKSource1.Id, source.Id, source.Ports[0].Id, null);
                    newFKSource1.Links = new Guid[] { linkSource.Id };
                    var links = serializedDiagram.Links.Append (linkSource);

                    Link linkTarget = new Link (relationNode.Id, newFKTarget1.Id, target.Id, target.Ports[0].Id, null);
                    links = serializedDiagram.Links.Append (linkTarget);

                    newFKTarget1.Links = new Guid[] { linkTarget.Id };
                    serializedDiagram.Links = links.ToArray ();

                    List<Port> newPorts = new List<Port> ();
                    newPorts.Add (newPortPK);
                    newPorts.Add (newFKSource1);
                    newPorts.Add (newFKTarget1);
                    newPorts.AddRange (relAtributes);

                    relationNode.Ports = newPorts.ToArray ();

                } else if (left.Contains ('N')) {
                    var isNotNull = right[0] == '1';


                    source = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Source);
                    target = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Target);
                    AddForeignPort (target, source, link, isNotNull);

                } else if (right.Contains ('N')) {
                    var isNotNull = left[0] == '1';

                    source = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Target);
                    target = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Source);
                    AddForeignPort (target, source, link, isNotNull);

                } else {
                    var isNotNull = right[0] == '1';

                    source = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Source);
                    target = serializedDiagram.Nodes.FirstOrDefault (n => n.Id == link.Target);
                    AddForeignPort (target, source, link, isNotNull);
                }

            }
        }

        private void AddForeignPort (Node target, Node source, Link link, bool notnull) {
            Port newFKPort = new Port (false, target.Name + "Id", "INT", source.Id, false, true, false, notnull, false, new Guid[] { link.Id });
            var newPorts = source.Ports.Append (newFKPort);
            source.Ports = newPorts.ToArray ();
        }

        private string GenerationTaskMySQL (Diagram diagram) {
            SerializedModel serializedDiagram = SerializedModel.FromJson (diagram.SerializedModel);

            if (diagram.RelationType == "CHEN") {
                serializedDiagram = ConvertToUml (SerializedModel.FromJson (diagram.SerializedModel));
            }

            if (serializedDiagram.Nodes.Length == 0) {
                throw new Exception ("Diagram is empty");
            } else {
                this.PrepareForeignKeys (serializedDiagram);
                // STRUCTURE AND PRIMARY KEY CLUSTERS
                string mySQLCode =
                    $@"SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
                    SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
                    SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
              
              CREATE SCHEMA IF NOT EXISTS `{diagram.DatabaseName}` DEFAULT CHARACTER SET utf8 ; 
              USE `{diagram.DatabaseName}`;";

                var nodes = serializedDiagram.Nodes.Where (node => !node.IsLabel).ToArray ();

                foreach (var node in nodes) {
                    string nodePorts = $@"";
                    string nodeConstaraints = $@"";
                    int pkCounter = CountPk (node);

                    string names = PkNamesMy (node);

                    var ports = node.Ports.Where (x => x.IsNamePort == false);

                    // bool clusteredPK = true;

                    foreach (var port in ports) {
                        if (port.IsPrimaryKey || port.IsAutoincremented) {

                               if(port.IsPartialKey) {
                                nodePorts += $@"`{port.Label}` {port.PropertyType} NOT NULL,";
                            } else {
                                nodePorts += $@"`{port.Label}` {port.PropertyType} NOT NULL AUTO_INCREMENT,";
                            }

                            nodeConstaraints += $@"
                            PRIMARY KEY ({names}),";
                            if(port.IsPrimaryKey) {

                            nodeConstaraints += $@"UNIQUE INDEX `{port.Label}_UNIQUE` (`{port.Label}` ASC),";
                            }
                            
                        
                        // clusteredPK = false;
                        } else {
                            nodePorts += $@"`{port.Label}` {port.PropertyType}";
                            if (port.IsNotNull) {
                                nodePorts += $@" NOT NULL,";
                            }
                            if (!port.IsNotNull) {
                                nodePorts += $@" NULL,";
                            }
                              if(port.IsUnique) {
                                 nodeConstaraints += $@" UNIQUE INDEX `{port.Label}_UNIQUE` (`{port.Label}` ASC),";
                             }
                            nodePorts += $@" ";
                        }

                    }
                    mySQLCode += $@"CREATE TABLE IF NOT EXISTS `{diagram.DatabaseName}`.`{node.Name}` (
                {nodePorts}
                {nodeConstaraints.Substring(0,nodeConstaraints.Length - 1)})
                ENGINE = InnoDB;
            ";
                }

                // FOREIGN KEYS 

                foreach (var node in serializedDiagram.Nodes) {
                    var fkPorts = node.Ports.Where (port => port.IsForeignKey);
                    foreach (var fk in fkPorts) {
                        foreach (var linkID in fk.Links) {
                            var linkTarget = serializedDiagram.Links.FirstOrDefault (x => x.Id == linkID).Source;
                            var nodeLinked = serializedDiagram.Nodes.FirstOrDefault (x => x.Id == linkTarget);
                            var linkedPKport = nodeLinked.Ports.Where(p => p.IsPrimaryKey).ToArray();
             
                            if (nodeLinked.Name == node.Name) {

                                linkTarget = serializedDiagram.Links.FirstOrDefault (x => x.Id == linkID).Target;
                                nodeLinked = serializedDiagram.Nodes.FirstOrDefault (x => x.Id == linkTarget);
                                linkedPKport = nodeLinked.Ports.Where(p => p.IsPrimaryKey).ToArray();
                            }

                            if(linkedPKport.Length > 0)
                            {
                            mySQLCode += $@"ALTER TABLE `{diagram.DatabaseName}`.`{node.Name}`
                             ADD CONSTRAINT `fk_{node.Name}_{fk.Label}` 
                             FOREIGN KEY(`{fk.Label}`) 
                             REFERENCES `{diagram.DatabaseName}`.`{nodeLinked.Name}`(`{linkedPKport[0].Label}`)
                             ON DELETE NO ACTION ON UPDATE NO ACTION;
												
                                                
                              CREATE INDEX `fk_{node.Name}_{fk.Label}_idx` ON `{diagram.DatabaseName}`.`{node.Name}` (`{linkedPKport[0].Label}` ASC);                  
                                                
                                                ";

                            }

                        }

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
                this.PrepareForeignKeys (serializedDiagram);
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

                    string nodePorts = $@"";
                    string nodeConstaraints = $@"";
                    int pkCounter = CountPk (node);

                    string names = PkNamesMS (node);

                    bool clusteredPK = true;
                    var ports = node.Ports.Where (x => x.IsNamePort == false);

                    foreach (var port in ports) {
                        if (port.IsPrimaryKey || port.IsPartialKey) {

                            if(port.IsPartialKey) {
                                nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL, ";
                            } else {
                                nodePorts += $@"[{port.Label}] {port.PropertyType} NOT NULL IDENTITY (1,1), ";
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
                        } 
                        
                        else {
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
                    if(pkPort != null) {
                        MSSQLCode += $@"CREATE UNIQUE NONCLUSTERED INDEX [{pkPort.Label}_UNIQUE] ON [{node.Name}] ([id] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY];";
                    }
                MSSQLCode += $@"    
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
                            var linkedPKport = nodeLinked.Ports.Where(p => p.IsPrimaryKey).ToArray();
                            
                            if (nodeLinked.Name == node.Name) {

                                linkTarget = serializedDiagram.Links.FirstOrDefault (x => x.Id == linkID).Target;
                                nodeLinked = serializedDiagram.Nodes.FirstOrDefault (x => x.Id == linkTarget);
                                linkedPKport = nodeLinked.Ports.Where(p => p.IsPrimaryKey).ToArray();
                            }

                            if(linkedPKport.Length > 0) {
                                MSSQLCode += $@"ALTER TABLE [{node.Name}] WITH CHECK ADD CONSTRAINT [fk_{node.Name}_{fk.Label}] FOREIGN KEY([{fk.Label}]) REFERENCES [dbo].[{nodeLinked.Name}]([{linkedPKport[0].Label}]);
												GO
												ALTER TABLE [{node.Name}] CHECK CONSTRAINT [fk_{node.Name}_{fk.Label}];";
                            }
                        }

                    }

                }

                return MSSQLCode;
            }
        }
    }
}