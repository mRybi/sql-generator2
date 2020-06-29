import createEngine, {
  DiagramModel,
  DiagramEngine,
  LinkModel,
  LinkModelGenerics,
} from "@projectstorm/react-diagrams";
import { ArrowLinkFactory } from "../infrastructure/factories/ArrowLinkFactory";
import { DefaultNodeFactory } from "../infrastructure/factories/DefaultNodeFactory";
import { DefaultLabelFactory } from "../infrastructure/factories/DefaultLabelFactory";
import { DefaultPortFactory } from "../infrastructure/factories/DefaultPortFactory";
import { DefaultLinkFactory } from "../infrastructure/factories/DefaultLinkFactory";
import { CustomLabelFactory } from "../infrastructure/factories/CustomLabelFactory";
import { DefaultPortModel } from "../infrastructure/models/DefaultPortModel";
import { ArrowLinkModel } from "../infrastructure/models/ArrowLinkModel";
import { AdvancedPortModel } from "../infrastructure/models/ArrowPortModel";
import { DefaultNodeModel } from "../infrastructure/models/DefaultNodeModel";
import { DefaultLabelModel } from "../infrastructure/models/DefaultLabelModel";
import { DefaultLinkModel } from "../infrastructure/models/DefaultLinkModel";
import { DefaultDiagramState } from "@projectstorm/react-diagrams";
import { ArrowPortFactory } from "../infrastructure/factories/ArrowPortFactory";
import { Toolkit } from "../infrastructure/Toolkit";
import _ from "lodash";

export class Application {
  protected activeModel!: DiagramModel;
  protected logicModel!: DiagramModel;

  protected diagramEngine: DiagramEngine;

  constructor() {
    this.diagramEngine = createEngine();

    this.diagramEngine
      .getNodeFactories()
      .registerFactory(new CustomLabelFactory());
    this.diagramEngine
      .getNodeFactories()
      .registerFactory(new DefaultNodeFactory());

    this.diagramEngine
      .getLabelFactories()
      .registerFactory(new DefaultLabelFactory());

    this.diagramEngine
      .getPortFactories()
      .registerFactory(new DefaultPortFactory());
    this.diagramEngine
      .getPortFactories()
      .registerFactory(new ArrowPortFactory());

    this.diagramEngine
      .getLinkFactories()
      .registerFactory(new ArrowLinkFactory());
    this.diagramEngine
      .getLinkFactories()
      .registerFactory(new DefaultLinkFactory());

    const state = this.diagramEngine.getStateMachine().getCurrentState();

    if (state instanceof DefaultDiagramState) {
      state.dragNewLink.config.allowLooseLinks = false;
    }

    this.newModel();
  }

  public newModel() {
    this.activeModel = new DiagramModel();
    this.logicModel = new DiagramModel();

    this.diagramEngine.setModel(this.activeModel);
  }

  public getActiveDiagram(): DiagramModel {
    return this.activeModel;
  }

  public getDiagramEngine(): DiagramEngine {
    return this.diagramEngine;
  }

  public setLogicModel() {
    let concNodes = this.activeModel.getNodes();

    Object.keys(concNodes).forEach((k) => {
      let node = concNodes[k].clone() as DefaultNodeModel;

      let nodePorts = concNodes[k].getPorts();

      Object.keys(nodePorts).filter(id => nodePorts[id].isNamePort).forEach((k) => {
        let port = nodePorts[k] as DefaultPortModel;
        let logicPort = new AdvancedPortModel(
          port.label,
          port.isNamePort,
          port.isPrimaryKey,
          port.isForeignKey,
          port.isPartialKey,
          port.isNotNull,
          port.isAutoincremented,
          port.isUnique,
          port.propertyType
        );
        node.addPort(logicPort);
      });

      this.logicModel.addNode(node);
    });

    let nodes = this.logicModel.getNodes();

    let nodesWithoutPK: DefaultNodeModel[] = [];
    nodes.map(n => {
      let ports = n.getPorts() as { [s: string]: DefaultPortModel; }

      let portsWithPK = _.values(ports).filter(port => port.isPrimaryKey);

      if (portsWithPK.length === 0) {
        nodesWithoutPK.push(n as DefaultNodeModel);
      }
    })


    let links = this.activeModel.getLinks();

    let priorityLinks = [];

    links.filter(link => {
      let sourceNode = link.getSourcePort().getParent() as DefaultNodeModel
      let targetNode = link.getTargetPort().getParent() as DefaultNodeModel

      if (nodesWithoutPK.map(node => node.getOptions().name).includes(sourceNode.getOptions().name) || nodesWithoutPK.map(node => node.getOptions().name).includes(targetNode.getOptions().name)) {
        priorityLinks.push(link);
      }
    })

    console.log('priorityLinks ', priorityLinks)

    let priom2mLinks = priorityLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return sourceLabel.includes('N') && targetLabel.includes('N')
    })

    let priosourceLinks = priorityLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return sourceLabel.includes('N') && !targetLabel.includes('N')
    })

    let priotargetLinks = priorityLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return !sourceLabel.includes('N') && targetLabel.includes('N')
    })

    let priooneToOneLinks = priorityLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return !sourceLabel.includes('N') && !targetLabel.includes('N')
    })


    // targetLinks
    this.convertTargetPorts(priotargetLinks);

    // sourceLinks
    this.convertSourceLinks(priosourceLinks);

    // M2M LINKS
    this.convertM2MLink(priom2mLinks);

    this.convertSourceLinks(priooneToOneLinks);

    let concLinks = this.activeModel.getLinks().filter(link => !priorityLinks.includes(link));


    let m2mLinks = concLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return sourceLabel.includes('N') && targetLabel.includes('N')
    })

    let sourceLinks = concLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return sourceLabel.includes('N') && !targetLabel.includes('N')
    })

    let targetLinks = concLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return !sourceLabel.includes('N') && targetLabel.includes('N')
    })

    let oneToOneLinks = concLinks.filter(link => {
      let sourceLabel = (link
        .getLabels()[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (link
        .getLabels()[2] as DefaultLabelModel).getOptions().label;

      return !sourceLabel.includes('N') && !targetLabel.includes('N')
    })



    // targetLinks
    this.convertTargetPorts(targetLinks);

    // sourceLinks
    this.convertSourceLinks(sourceLinks);

    // M2M LINKS
    this.convertM2MLink(m2mLinks);

    this.convertSourceLinks(oneToOneLinks);


    this.diagramEngine.setModel(this.logicModel);
  }

  public setConceptualModel() {
    this.logicModel = null;
    this.logicModel = new DiagramModel();

    let activeModelCopy = new DiagramModel();

    let nodes = this.activeModel.getNodes();

    Object.keys(nodes).forEach((k) => {
      activeModelCopy.addNode(nodes[k]);
    });

    let links = this.activeModel.getLinks();

    Object.keys(links).forEach((k) => {
      activeModelCopy.addLink(links[k]);
    });

    this.activeModel = activeModelCopy;

    this.diagramEngine.setModel(this.activeModel);
  }

  public loadConceptualModel(model: DiagramModel) {
    this.activeModel = model;

    this.diagramEngine.setModel(this.activeModel);
  }

  public loadLogicModel(model: DiagramModel) {
    this.logicModel = model;
    this.diagramEngine.setModel(this.logicModel);
  }

  public convertM2MLink(m2mLinks: LinkModel<LinkModelGenerics>[]) {
    Object.keys(m2mLinks).forEach((k) => {
      let logicNodes = this.logicModel.getNodes() as DefaultNodeModel[];

      let sourceNode = m2mLinks[k].sourcePort.getParent() as DefaultNodeModel;
      let sourceNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            sourceNode.getOptions().name
        )[0]
        .getOptions().id;

      let targetNode = m2mLinks[k].targetPort.getParent() as DefaultNodeModel;
      let targetNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            targetNode.getOptions().name
        )[0]
        .getOptions().id;

      let relNode = ((m2mLinks[k] as DefaultLinkModel)
        .properties as DefaultNodeModel).clone() as DefaultNodeModel;

      relNode.getOptions().name = relNode.getOptions().name = m2mLinks[k].relName;

      relNode.setPosition(
        sourceNode.getPosition().x + 150,
        sourceNode.getPosition().y - 100
      );

      relNode.addPort(
        new AdvancedPortModel(
          "Id",
          false,
          true,
          false,
          false,
          true,
          true,
          true,
          "INT"
        )
      );
      relNode.addPort(
        new AdvancedPortModel(
          "",
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          "INT"
        )
      );
      relNode.addPort(
        new AdvancedPortModel(
          "1",
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          "INT"
        )
      );

      let sourceNodeLogic = logicNodes.filter(
        (n) => n.getOptions().id === sourceNodeId
      )[0];
      let sourceNodePorts = sourceNodeLogic.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let sourceNodePKPort = _.keys(sourceNodePorts).filter(key => sourceNodePorts[key].isPrimaryKey || sourceNodePorts[key].isPartialKey).map(key => sourceNodePorts[key]);

      let targetNodeLogic = logicNodes.filter(
        (n) => n.getOptions().id === targetNodeId
      )[0];
      let targetNodePorts = targetNodeLogic.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let targetNodePKPort = _.keys(targetNodePorts).filter(key => targetNodePorts[key].isPrimaryKey || targetNodePorts[key].isPartialKey).map(key => targetNodePorts[key]);

      let targetNodePrimaryKeysPorts = _.keys(targetNodePorts).filter(key => targetNodePorts[key].isPrimaryKey).map(key => targetNodePorts[key]);
      let sourceNodePrimaryKeysPorts = _.keys(sourceNodePorts).filter(key => sourceNodePorts[key].isPrimaryKey).map(key => sourceNodePorts[key]);

      let x = 1
      sourceNodePKPort.forEach(port => {
        relNode.addPort(
          new AdvancedPortModel(
            sourceNode.getOptions().name + port.label + `${sourceNode === targetNode ? x : ''}`,
            false,
            sourceNodePrimaryKeysPorts.length > 0 ? false : true,
            sourceNodePrimaryKeysPorts.length > 0 ? true : false,
            false, // partial
            true,
            false,
            false,
            "INT",
            Toolkit.UID(),
            sourceNodeId
          )
        )
        x++;
      }
      );


      targetNodePKPort.forEach(port => {
        relNode.addPort(
          new AdvancedPortModel(
            targetNode.getOptions().name + port.label,
            false,
            targetNodePrimaryKeysPorts.length > 0 ? false : true,
            targetNodePrimaryKeysPorts.length > 0 ? true : false,
            false,// partial
            true,
            false,
            false,
            "INT",
            Toolkit.UID(),
            targetNodeId
          )
        );
      });

      this.logicModel.addNode(relNode);

      let node = logicNodes.filter(
        (n) => n.getOptions().id === sourceNodeId
      )[0];
      let sourceP = node.getPorts()["1"];
      let targetP = relNode.getPorts()[""];

      let link = new ArrowLinkModel({ type: "arrow" });

      link.setSourcePort(sourceP);
      link.setTargetPort(targetP);

      let node2 = logicNodes.filter(
        (n) => n.getOptions().id === targetNodeId
      )[0];
      let targetP2 = relNode.getPorts()["1"];
      let sourceP2 = node2.getPorts()[""];

      let link2 = new ArrowLinkModel({ type: "arrow" });

      link2.setSourcePort(sourceP2);
      link2.setTargetPort(targetP2);

      this.logicModel.addAll(link, link2);

    });
  }

  public convertSourceLinks(sourceLinks: LinkModel<LinkModelGenerics>[]) {
    Object.keys(sourceLinks).forEach((k) => {
      let logicNodes = this.logicModel.getNodes() as DefaultNodeModel[];

      let sourceNode = sourceLinks[k].sourcePort.getParent() as DefaultNodeModel;
      let sourceNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            sourceNode.getOptions().name
        )[0]
        .getOptions().id;

      let targetNode = sourceLinks[k].targetPort.getParent() as DefaultNodeModel;
      let targetNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            targetNode.getOptions().name
        )[0]
        .getOptions().id;


      /// source
      let sourceNodeLogic = logicNodes.filter(
        (n) => n.getOptions().id === targetNodeId
      )[0];
      let sourceNodePorts = sourceNodeLogic.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let sourceNodePKPort = _.keys(sourceNodePorts).filter(key => sourceNodePorts[key].isPrimaryKey || sourceNodePorts[key].isPartialKey).map(key => sourceNodePorts[key]);
      ///

      /// target
      let node = logicNodes.filter(
        (n) => n.getOptions().id === sourceNodeId
      )[0];

      let targetNodePorts = node.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let targetNodePrimaryKeysPorts = _.keys(targetNodePorts).filter(key => targetNodePorts[key].isPrimaryKey).map(key => targetNodePorts[key]);
      ///
      sourceNodePKPort.forEach(port => {
        node.addPort(
          new AdvancedPortModel(
            targetNode.getOptions().name + port.label,
            false,
            targetNodePrimaryKeysPorts.length > 0 ? false : true,
            targetNodePrimaryKeysPorts.length > 0 ? true : false,
            false,//PARTIAL
            true,
            false,
            false,
            "INT",
            Toolkit.UID(),
            targetNodeId
          )
        );
      })
      let nodePorts = node.getPorts() as { [s: string]: DefaultPortModel; }
      let newPKPorts = _.keys(nodePorts).filter(key => nodePorts[key].isPartialKey).map(key => nodePorts[key]);

      newPKPorts.map(port => port.isPrimaryKey = true);

      let relNode = ((sourceLinks[k] as DefaultLinkModel)
      .properties as DefaultNodeModel).clone() as DefaultNodeModel;

      let relPorts = relNode.getPorts() as { [s: string]: DefaultPortModel; }

      _.values(relPorts).map(port => {
        let logicPort = new AdvancedPortModel(
          port.label,
          port.isNamePort,
          port.isPrimaryKey,
          port.isForeignKey,
          port.isPartialKey,
          port.isNotNull,
          port.isAutoincremented,
          port.isUnique,
          port.propertyType
        );
        node.addPort(logicPort);
      })

      let tNode = logicNodes.filter(
        (n) => n.getOptions().id === targetNodeId
      )[0];

      let targetP = node.getPorts()["1"];
      let sourceP = tNode.getPorts()[""];

      let link = new ArrowLinkModel({ type: "arrow" });

      link.setSourcePort(sourceP);
      link.setTargetPort(targetP);
      this.logicModel.addLink(link);
    });
  }

  public convertTargetPorts(targetLinks: LinkModel<LinkModelGenerics>[]) {
    Object.keys(targetLinks).forEach((k) => {
      let logicNodes = this.logicModel.getNodes() as DefaultNodeModel[];

      let sourceNode = targetLinks[k].sourcePort.getParent() as DefaultNodeModel;
      let sourceNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            sourceNode.getOptions().name
        )[0]
        .getOptions().id;

      let targetNode = targetLinks[k].targetPort.getParent() as DefaultNodeModel;
      let targetNodeId = logicNodes
        .filter(
          (node) =>
            (node as DefaultNodeModel).getOptions().name ===
            targetNode.getOptions().name
        )[0]
        .getOptions().id;



      /// source
      let sourceNodeLogic = logicNodes.filter(
        (n) => n.getOptions().id === sourceNodeId
      )[0];
      let sourceNodePorts = sourceNodeLogic.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let sourceNodePKPort = _.keys(sourceNodePorts).filter(key => sourceNodePorts[key].isPrimaryKey || sourceNodePorts[key].isPartialKey).map(key => sourceNodePorts[key]);

      /// target
      let node = logicNodes.filter(
        (n) => n.getOptions().id === targetNodeId
      )[0];

      let targetNodePorts = node.getPorts() as {
        [s: string]: DefaultPortModel;
      }
      let targetNodePrimaryKeysPorts = _.keys(targetNodePorts).filter(key => targetNodePorts[key].isPrimaryKey).map(key => targetNodePorts[key]);
      ///

      sourceNodePKPort.forEach(port => {
        node.addPort(
          new AdvancedPortModel(
            sourceNode.getOptions().name + port.label,
            false,
            targetNodePrimaryKeysPorts.length > 0 ? false : true,
            targetNodePrimaryKeysPorts.length > 0 ? true : false,
            false,//PARTIAL
            true,
            false,
            false,
            "INT",
            Toolkit.UID(),
            sourceNodeId
          )
        );
      })

      let nodePorts = node.getPorts() as { [s: string]: DefaultPortModel; }
      let newPKPorts = _.keys(nodePorts).filter(key => nodePorts[key].isPartialKey).map(key => nodePorts[key]);

      newPKPorts.map(port => port.isPrimaryKey = true);

      let relNode = ((targetLinks[k] as DefaultLinkModel)
      .properties as DefaultNodeModel).clone() as DefaultNodeModel;

      let relPorts = relNode.getPorts() as { [s: string]: DefaultPortModel; }

      _.values(relPorts).map(port => {
        let logicPort = new AdvancedPortModel(
          port.label,
          port.isNamePort,
          port.isPrimaryKey,
          port.isForeignKey,
          port.isPartialKey,
          port.isNotNull,
          port.isAutoincremented,
          port.isUnique,
          port.propertyType
        );
        node.addPort(logicPort);
      })

      let tNode = logicNodes.filter(
        (n) => n.getOptions().id === sourceNodeId
      )[0];

      let targetP = node.getPorts()[""];
      let sourceP = tNode.getPorts()["1"];

      let link = new ArrowLinkModel({ type: "arrow" });

      link.setSourcePort(sourceP);
      link.setTargetPort(targetP);
      this.logicModel.addLink(link);
    });
  }
}
