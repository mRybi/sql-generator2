import * as _ from "lodash";
import { Link } from "./Link";
import { Node } from "./Node";
import { PortModel, DiagramEngine, PointModel, NodeModel } from "storm-react-diagrams";
import { PropertyType } from "./PropertyType";
import { Singleton } from "../../context/Singleton";

export class Port extends PortModel {
	in: boolean;
	label: string;
	links: { [id: string]: Link };
	firstTime: boolean = true;
	isPrimaryKey: boolean;
	isForeignKey: boolean;
	isAutoincremented: boolean;
	isNotNull: boolean;
	isUnique: boolean;
	propertyType: PropertyType;
	disabled: boolean;

	diagramEngine: DiagramEngine;
	diagramEngine2: DiagramEngine;


	constructor(diagramEngine: DiagramEngine, diagramEngine2: DiagramEngine, isInput: boolean, name: string, isPrimaryKey?: boolean, isForeignKey?: boolean, isNotNull?: boolean, isAutoincremented?: boolean, isUnique?: boolean, propertyType?: PropertyType, id?: string) {
		super(name, "custom", id);
		this.in = isInput;
		this.label = name;
		this.links = {};

		this.isPrimaryKey = isPrimaryKey;
		this.isForeignKey = isForeignKey;

		this.isNotNull = isNotNull;
		this.isUnique = isUnique;
		this.isAutoincremented = isAutoincremented;

		this.propertyType = propertyType;

		this.diagramEngine = diagramEngine;
		this.diagramEngine2 = diagramEngine2;

		Singleton.getConnectionType();

	}

	deSerialize(object: any, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
	}

	serialize() {
		return _.merge(super.serialize(), {
			in: this.in,
			label: this.label,
			links: this.links,
			isPrimaryKey: this.isPrimaryKey,
			isForeignKey: this.isForeignKey,
			isNotNull: this.isNotNull,
			isUnique: this.isUnique,
			isAutoincremented: this.isAutoincremented,
			propertyType: this.propertyType,
		});
	}

	// link(port: Port, target: Port, node: NodeModel): boolean {
	link(port: Port): boolean {

		if (port.disabled) {
			return true;
		}
		// let node = this.diagramEngine.diagramModel.getNode(port.getParent() as Node);
		let node = port.getParent() as Node;
		let targetPort = node && (node as Node).addInPort((this.getParent() as Node).name + 'Id', false, true, false, false, false, PropertyType.INT);
		
		if (node === this.getParent() as Node) {
			this.diagramEngine.recalculatePortsVisually();
			this.diagramEngine2.recalculatePortsVisually();

			return false;
		} else {
		console.log('QQQQQsdfsdfds');

			let link = this.createLinkModel();
			link.setSourcePort(this);
			link.setTargetPort(targetPort);
			this.diagramEngine.diagramModel.addLink(link);
			this.diagramEngine.recalculatePortsVisually();

			let m2m = new Node(false, this.diagramEngine, this.diagramEngine2, 'XD', "rgb(0,192,255)");
			let fport = m2m.addInPort("1Id", false, true, true, true, false, PropertyType.INT);
			fport.disabled = true;

			let secPort = m2m.addInPort("2Id", false, true, true, true, false, PropertyType.INT);
			secPort.disabled = true;

			
		let node = this.diagramEngine2.diagramModel.getNode(port.getParent() as Node);
let oldPorts = node.ports as {[s: string]: Port};

			m2m.x = node.x - 100;
			m2m.y = node.y - 60;
			this.diagramEngine2.diagramModel.addNode(m2m);

			console.log('qqqqqqqqqqqqwwqwq', this.diagramEngine.diagramModel.getNodes(), this.diagramEngine2.diagramModel.getNodes());
			this.diagramEngine2.diagramModel.removeNode(node);
			
			let node2 = new Node(false, this.diagramEngine, this.diagramEngine2, (node as Node).name, "rgb(0,192,255)");
			node2.x = node.x;
			node2.y = node.y;
			// node2.ports = oldPorts ; // jak zachowac porty z node2 i przekopiowac je do nowego // mamy old ports znamy ten nowy node1Id ktory trezba wywyalic
			let idPort = node2.addInPort("Id", true, false, true, true, false, PropertyType.INT);

			this.diagramEngine2.diagramModel.addNode(node2);
			let flink = this.createLinkModel();
			let seclink = this.createLinkModel();
			flink.setSourcePort(this);//this.diagramEngine2.diagramModel.getNode('3a04f449-2b36-4980-8b10-f245a92a7fdb').getPort('97e09c04-acd5-45a8-94cf-08ac6ed58c4d'));
			flink.setTargetPort(secPort);
			seclink.setSourcePort(idPort);//this.diagramEngine2.diagramModel.getNode('17aeb932-2712-4a3c-84b1-eff4388357e5').getPort('3f058cf9-a7f2-493b-bcef-81dbfba0836b'));
			seclink.setTargetPort(fport);
			this.diagramEngine2.diagramModel.addLink(flink);
			this.diagramEngine2.diagramModel.addLink(seclink);

// nic sie nie rozpierdala jak usune z m2m entityId
			this.diagramEngine2.recalculatePortsVisually();
			return false;
		}
	}

	canLinkToPort(port: Port): boolean {
		console.log('QQQQQ', Singleton.getConnectionType()); //if type costam respown m2m itd.... 
		if (this.firstTime) {
		// 	let node = this.diagramEngine.diagramModel.getNode(port.getParent() as Node);
		// // let node = port.getParent() as Node;
		// let targetPort = node && (node as Node).addInPort((node as Node).name + 'Id', false, true, false, false, false, PropertyType.INT);
			this.firstTime = false;
			// let a = this.link(port, targetPort, node);
			let a = this.link(port);

			// this.diagramEngine2.diagramModel.getNode(node).removePort(port);
			return a;
		} else {
			return true;
		}
	}

	createLinkModel(): Link {
		return new Link('custom');
	}
}