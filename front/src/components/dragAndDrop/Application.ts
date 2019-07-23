import * as SRD from "storm-react-diagrams";
import { Node } from "../models/Node";
import { PropertyType } from "../models/PropertyType";
import { CustomLabelFactory } from "../factories/CustomLabelFactory";
import { RelationType } from "../../AppView";
import { CustomPortFactory } from "../factories/CustomPortFactory";
import { CustomNodeFactory } from "../factories/CustomNodeFactory";
import { CustomLinkLabelFactory } from "../factories/CustomLinkLabelFactory";
import { CustomLinkFactory } from "../factories/CustomLinkFactory";


export class Application {
	protected activeModel: SRD.DiagramModel;
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
		this.diagramEngine.setDiagramModel(this.activeModel);
		console.log('MODEL JSON', JSON.stringify(this.activeModel.serializeDiagram(), null, 2))
		//3-A) create a default node
		// var node1 = new Node("Node1", "rgb(0,192,255)");
		// let port = node1.addInPort("Id", true, false, false, false, false, PropertyType.INT);
		// let port1 = node1.addInPort("Id11", false, false, false, false, false, PropertyType.INT);

		// // let port1 = node1.addInPort(true, true, true, false, false, "Id1", PropertyType.INT);
		
		// node1.setPosition(100, 100);

		// //3-B) create another default node
		// var node2 = new Node("Node2", "rgb(0,192,255)");
		// let port2 = node2.addInPort("Id", true, false, false, false, false, PropertyType.INT);

		// // var node2 = new Node("table", "Node2", "rgb(0,192,255)");
		// // let port2 = node2.addInPort(true, true, true, true, false,"Id", PropertyType.INT);
		// node2.setPosition(400, 100);
		// let link1 = port.link(port2);
		// // link the ports
		// // let link1 = port.initialLink(node2);

		// this.activeModel.addAll(node1, node2, link1);
		// console.log('MODEL JSON', JSON.stringify(this.activeModel.serializeDiagram(), null, 2))


		// var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
		// let port = node1.addOutPort("Out");
		// node1.setPosition(100, 100);
		// var node2 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
		// let port22 = node1.addOutPort("Out");
		// node1.setPosition(100, 100);
		// //3-B) create another default node
		// var node22 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
		// let port2 = node2.addInPort("In");
		// let port3 = node2.addInPort("In2");

		// node2.setPosition(400, 100);

		// // link the ports
		// let link1 = port.link(port2);

		// this.activeModel.addAll(node1, node22,  node2, link1);
		// this.diagramEngine.recalculatePortsVisually();

	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}