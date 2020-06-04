import * as SRD from "storm-react-diagrams";
import { CustomLabelFactory } from "../../infrastructure/factories/CustomLabelFactory";
import { CustomPortFactory } from "../../infrastructure/factories/CustomPortFactory";
import { CustomNodeFactory } from "../../infrastructure/factories/CustomNodeFactory";
import { CustomLinkLabelFactory } from "../../infrastructure/factories/CustomLinkLabelFactory";
import { CustomLinkFactory } from "../../infrastructure/factories/CustomLinkFactory";
import { Node } from "../../infrastructure/models/Node";
import { LogicLink } from "../../infrastructure/models/LogicLink";
import { LogicPort } from "../../infrastructure/models/LogicPort";
import { Label } from "../../infrastructure/models/Label";
import { NodeModel } from "storm-react-diagrams";
import { Link } from "../../infrastructure/models/Link";
import { Port } from "../../infrastructure/models/Port";

export class Application {
  protected activeModel: SRD.DiagramModel;
  protected logicModel: SRD.DiagramModel;

  protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.registerNodeFactory(new CustomLabelFactory());
    this.diagramEngine.registerLinkFactory(new CustomLinkFactory());
    this.diagramEngine.registerLabelFactory(new CustomLinkLabelFactory());
    this.diagramEngine.registerNodeFactory(new CustomNodeFactory());
    this.diagramEngine.registerPortFactory(new CustomPortFactory());
    this.diagramEngine.installDefaultFactories();
    this.newModel();
  }

  public newModel() {
    this.activeModel = new SRD.DiagramModel();
    this.logicModel = new SRD.DiagramModel();

    this.diagramEngine.setDiagramModel(this.activeModel);
  }

  public getActiveDiagram(): SRD.DiagramModel {
    return this.diagramEngine.getDiagramModel();
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }

  private clearNodes() {
    let logiNodes = this.logicModel.getNodes();
    Object.keys(logiNodes).map((k) => {
      this.logicModel.removeNode(logiNodes[k]);
    });

  }

  public setLogicModel() {

    let concNodes = this.activeModel.getNodes();
    Object.keys(concNodes).map((k) => {
      console.log('ports: ', concNodes[k].ports);
      let node = concNodes[k].clone(concNodes[k]) as Node;

      let nodePorts = concNodes[k].getPorts();

      Object.keys(nodePorts).map(k => {
        node.addPort(nodePorts[k]);
      })

      console.log('ports new : ', node.ports);

      this.logicModel.addNode(node);
    });

    let concLinks = this.activeModel.getLinks();

    Object.keys(concLinks).map((k) => {
      let logicNodes = this.logicModel.getNodes() as {
        [s: string]: Node;
      };

      let sourceNode = concLinks[k].sourcePort.getParent() as Node;
      let sourceNodeId = Object.keys(logicNodes).filter(
        (k) => (logicNodes[k] as Node).name == sourceNode.name
      )[0];

      let targetNode = concLinks[k].targetPort.getParent() as Node;
      let targetNodeId = Object.keys(logicNodes).filter(
        (k) => (logicNodes[k] as Node).name == targetNode.name
      )[0];

      let sourceLabel = (concLinks[k].labels[0] as Label).label;
      let targetLabel = (concLinks[k].labels[2] as Label).label;

      if (sourceLabel.includes("N") && targetLabel.includes("N")) {
        console.log("dodac rel node", concLinks[k]);
        let relNode = ((concLinks[k] as Link).properties as Node).clone();
        relNode.name = (concLinks[k].labels[1] as Label).label;
        relNode.setPosition(sourceNode.x + 150, sourceNode.y - 100);
        relNode.addInPort(
          true,
          true,
          "",
          false,
          false,
          false,
          false,
          false,
          "INT"
        );
        relNode.addInPort(
          true,
          true,
          "1",
          false,
          false,
          false,
          false,
          false,
          "INT"
        );

        relNode.addInPort(
          true,
          false,
          "Id",
          true,
          false,
          true,
          true,
          true,
          "INT"
        );

        relNode.addInPort(
          true,
          false,
          sourceNode.name + "Id",
          false,
          true,
          false,
          false,
          true,
          "INT"
        );

        relNode.addInPort(
          true,
          false,
          targetNode.name + "Id",
          false,
          true,
          false,
          false,
          true,
          "INT"
        );

        this.logicModel.addNode(relNode);

        //dodaj link
        let node = logicNodes[sourceNodeId];
        let sourceP = node.ports["1"];
        let targetP = relNode.ports[""];

        let link = new LogicLink("custom");
        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);

        //dodaj link
        let node2 = logicNodes[targetNodeId];
        let sourceP2 = relNode.ports["1"];
        let targetP2 = node2.ports[""];

        let link2 = new LogicLink("custom");
        link2.setSourcePort(sourceP2);
        link2.setTargetPort(targetP2);

        this.logicModel.addAll(link, link2);
      } else if (sourceLabel.includes("N")) {
        console.log("sorce label N");

        //dodaj FK
        logicNodes[sourceNodeId].addInPort(
          true,
          false,
          targetNode.name + "Id",
          false,
          true,
          false,
          false,
          true,
          "INT"
        );
        //dodaj link
        let node = logicNodes[sourceNodeId];
        let sourceP = node.ports["1"];
        let targetP = logicNodes[targetNodeId].ports[""];

        let link = new LogicLink("custom");
        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      } else if (targetLabel.includes("N")) {
        console.log("target label N");

        //dodaj FK
        logicNodes[targetNodeId].addInPort(
          true,
          false,
          sourceNode.name + "Id",
          false,
          true,
          false,
          false,
          true,
          "INT"
        );
        //dodaj link
        let node = logicNodes[targetNodeId];
        let sourceP = node.ports["1"];
        let targetP = logicNodes[sourceNodeId].ports[""];

        let link = new LogicLink("custom");
        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      } else {
        console.log("sorce label N");

        //dodaj FK
        logicNodes[sourceNodeId].addInPort(
          true,
          false,
          targetNode.name + "Id",
          false,
          true,
          false,
          false,
          true,
          "INT"
        );
        //dodaj link
        let node = logicNodes[sourceNodeId];
        let sourceP = node.ports["1"];
        let targetP = logicNodes[targetNodeId].ports[""];

        let link = new LogicLink("custom");
        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      }
      console.log('logic: ', logicNodes[sourceNodeId]);
      console.log('conte: ', this.activeModel.getNodes());
    });

    this.diagramEngine.setDiagramModel(this.logicModel);
  }

  public setConceptualModel() {
    this.logicModel = null;
    this.logicModel = new SRD.DiagramModel();

    // this.clearNodes();

    this.diagramEngine.setDiagramModel(this.activeModel);
  }
}
