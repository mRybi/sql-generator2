import * as SRD from '@projectstorm/react-diagrams';
import { ArrowLinkFactory } from '../infrastructure/factories/ArrowLinkFactory';
import { DefaultNodeFactory } from '../infrastructure/factories/DefaultNodeFactory';
import { DefaultLabelFactory } from '../infrastructure/factories/DefaultLabelFactory';
import { DefaultPortFactory } from '../infrastructure/factories/DefaultPortFactory';
import { DefaultLinkFactory } from '../infrastructure/factories/DefaultLinkFactory';
import { CustomLabelFactory } from '../infrastructure/factories/CustomLabelFactory';
import { DefaultPortModel } from '../infrastructure/models/DefaultPortModel';
import { ArrowLinkModel } from '../infrastructure/models/ArrowLinkModel';
import { AdvancedPortModel } from '../infrastructure/models/ArrowPortModel';
import { DefaultNodeModel } from '../infrastructure/models/DefaultNodeModel';
import { DefaultLabelModel } from '../infrastructure/models/DefaultLabelModel';
import { DefaultLinkModel } from '../infrastructure/models/DefaultLinkModel';
import { Toolkit } from '../infrastructure/Toolkit';
import { DefaultDiagramState } from '@projectstorm/react-diagrams';
import { ArrowPortFactory } from '../infrastructure/factories/ArrowPortFactory';
import { stat } from 'fs';


export class Application {
  protected activeModel!: SRD.DiagramModel;
  protected logicModel!: SRD.DiagramModel;

  protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = SRD.default({registerDefaultZoomCanvasAction: true});
    this.diagramEngine.getNodeFactories().registerFactory(new CustomLabelFactory());

    this.diagramEngine.getNodeFactories().registerFactory(new DefaultNodeFactory());
    this.diagramEngine.getLabelFactories().registerFactory(new DefaultLabelFactory());
    this.diagramEngine.getPortFactories().registerFactory(new DefaultPortFactory());
    this.diagramEngine.getPortFactories().registerFactory(new ArrowPortFactory());


    this.diagramEngine.getLinkFactories().registerFactory(new ArrowLinkFactory());

    this.diagramEngine.getLinkFactories().registerFactory(new DefaultLinkFactory());

    const state = this.diagramEngine.getStateMachine().getCurrentState();

    if (state instanceof DefaultDiagramState) {
        state.dragNewLink.config.allowLooseLinks = false;
      }

    this.newModel();
  }

  public newModel() {
    this.activeModel = new SRD.DiagramModel();
    this.logicModel = new SRD.DiagramModel();

    console.log(this.activeModel.getOffsetX(), this.activeModel.getOffsetX());



    this.diagramEngine.setModel(this.activeModel);
  }

  public getActiveDiagram(): SRD.DiagramModel {
    return this.activeModel;
  }

  public getDiagramEngine(): SRD.DiagramEngine {
    return this.diagramEngine;
  }

  public setLogicModel() {

    let concNodes = this.activeModel.getNodes();

    Object.keys(concNodes).map((k) => {
      let node = concNodes[k].clone() as DefaultNodeModel;

      let nodePorts = concNodes[k].getPorts();

      Object.keys(nodePorts).map(k => {
        let port = nodePorts[k] as DefaultPortModel;
        let logicPort = new AdvancedPortModel(port.getOptions().name, port.isNamePort, port.isPrimaryKey, port.isForeignKey, port.isNotNull, port.isAutoincremented, port.isUnique, port.propertyType);
        //let logicPort = new ArrowPortModel(port.getOptions().name, port.isNamePort, port.isPrimaryKey, port.isForeignKey, port.isNotNull, port.isAutoincremented, port.isUnique, port.propertyType);
        node.addPort(logicPort);
      })


      this.logicModel.addNode(node);
    });

    let concLinks = this.activeModel.getLinks();

    Object.keys(concLinks).map((k) => {
      let logicNodes = this.logicModel.getNodes() as DefaultNodeModel[];

      let sourceNode = concLinks[k].sourcePort.getParent() as DefaultNodeModel;
      let sourceNodeId = logicNodes.filter(
        node => (node as DefaultNodeModel).getOptions().name == sourceNode.getOptions().name
      )[0].getOptions().id;

      let targetNode = concLinks[k].targetPort.getParent() as DefaultNodeModel;
      let targetNodeId = logicNodes.filter(
        node => (node as DefaultNodeModel).getOptions().name == targetNode.getOptions().name
      )[0].getOptions().id;

      let sourceLabel = (concLinks[k].labels[0] as DefaultLabelModel).getOptions().label;
      let targetLabel = (concLinks[k].labels[2] as DefaultLabelModel).getOptions().label;

      if (sourceLabel.includes("N") && targetLabel.includes("N")) {
        let relNode = ((concLinks[k] as DefaultLinkModel).properties as DefaultNodeModel).clone() as DefaultNodeModel;
        relNode.getOptions().name = (concLinks[k].labels[1] as DefaultLabelModel).getOptions().label;
        relNode.setPosition(sourceNode.getPosition().x + 150, sourceNode.getPosition().y - 100);

        relNode.addPort(new AdvancedPortModel('Id', false, true, false, true, true, true, 'INT'));
        relNode.addPort(new AdvancedPortModel('', true, false, false, false, false, false, 'INT'));
        relNode.addPort(new AdvancedPortModel('1', true, false, false, false, false, false, 'INT'));


        relNode.addPort(new AdvancedPortModel(sourceNode.getOptions().name + "Id", false, false, true, true, false, false, 'INT', Toolkit.UID(), sourceNodeId));
        relNode.addPort(new AdvancedPortModel(targetNode.getOptions().name + "Id", false, false, true, true, false, false, 'INT', Toolkit.UID(), targetNodeId));

        this.logicModel.addNode(relNode);

        //dodaj link
        let node = logicNodes.filter(n => n.getOptions().id === sourceNodeId)[0];
        let sourceP = node.getPorts()["1"];
        let targetP = relNode.getPorts()[""];

        let link = new ArrowLinkModel({ type: 'arrow' });

        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);

        //dodaj link
        let node2 = logicNodes.filter(n => n.getOptions().id === targetNodeId)[0];
        let targetP2 = relNode.getPorts()["1"];
        let sourceP2 = node2.getPorts()[""];

        let link2 = new ArrowLinkModel({ type: 'arrow' });

        link2.setSourcePort(sourceP2);
        link2.setTargetPort(targetP2);

        this.logicModel.addAll(link, link2);
      } else if (sourceLabel.includes("N")) {
        //dodaj FK
        let node = logicNodes.filter(n => n.getOptions().id === sourceNodeId)[0];

        node.addPort(new AdvancedPortModel(targetNode.getOptions().name + "Id", false, false, true, true, false, false, 'INT', Toolkit.UID(), targetNodeId));

        //dodaj link
        let tNode = logicNodes.filter(n => n.getOptions().id === targetNodeId)[0];

        let targetP = node.getPorts()["1"];
        let sourceP = tNode.getPorts()[""];

        let link = new ArrowLinkModel({ type: 'arrow' });

        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      } else if (targetLabel.includes("N")) {
        //dodaj FK
        let node = logicNodes.filter(n => n.getOptions().id === targetNodeId)[0];

        node.addPort(new AdvancedPortModel(sourceNode.getOptions().name + "Id", false, false, true, true, false, false, 'INT', Toolkit.UID(), sourceNodeId));

        //dodaj link
        let tNode = logicNodes.filter(n => n.getOptions().id === sourceNodeId)[0];

        let targetP = node.getPorts()[""];
        let sourceP = tNode.getPorts()["1"];

        let link = new ArrowLinkModel({ type: 'arrow' });

        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      } else {
        //dodaj FK
        let node = logicNodes.filter(n => n.getOptions().id === targetNodeId)[0];

        node.addPort(new AdvancedPortModel(sourceNode.getOptions().name + "Id", false, false, true, true, false, false, 'INT', Toolkit.UID(), sourceNodeId));

        //dodaj link
        let tNode = logicNodes.filter(n => n.getOptions().id === sourceNodeId)[0];

        let targetP = node.getPorts()[""];
        let sourceP = tNode.getPorts()["1"];

        let link = new ArrowLinkModel({ type: 'arrow' });

        link.setSourcePort(sourceP);
        link.setTargetPort(targetP);
        this.logicModel.addLink(link);
      }
    });

    this.diagramEngine.setModel(this.logicModel);
  }

  public setConceptualModel() {
    this.logicModel = null;
    this.logicModel = new SRD.DiagramModel();

    let activeModelCopy = new SRD.DiagramModel();

    let nodes = this.activeModel.getNodes();

    Object.keys(nodes).map(k => {
      activeModelCopy.addNode(nodes[k]);
    })

    let links = this.activeModel.getLinks();

    Object.keys(links).map(k => {
      activeModelCopy.addLink(links[k]);
    })

    this.activeModel = activeModelCopy;

    this.diagramEngine.setModel(this.activeModel);
  }

  public loadConceptualModel(model: SRD.DiagramModel) {
    this.activeModel = model;

    this.diagramEngine.setModel(this.activeModel);
  }

  public loadLogicModel(model: SRD.DiagramModel) {
    this.logicModel = model;
      this.diagramEngine.setModel(this.logicModel);
    }
}

