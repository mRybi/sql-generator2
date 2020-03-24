import * as _ from "lodash";
import { Link } from "./Link";
import { Node } from "./Node";
import { PortModel, DiagramEngine } from "storm-react-diagrams";
import { PropertyType } from "./PropertyType";

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

	diagramEngine: DiagramEngine;

	constructor(diagramEngine: DiagramEngine, isInput: boolean, name: string, isPrimaryKey?: boolean, isForeignKey?: boolean, isNotNull?: boolean, isAutoincremented?: boolean, isUnique?: boolean, propertyType?: PropertyType, id?: string) {
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
	}

	deSerialize(object: any, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.in = object.in;
		this.label = object.label;
		// this.links= object.links; //dziwne jak jest odkomm to nie mozna ruszac diagramem 
		//przetestowac czy serialized json jest ok
		this.isPrimaryKey= object.isPrimaryKey;
		this.isForeignKey= object.isForeignKey;
		this.isNotNull= object.isNotNull;
		this.isUnique= object.isUnique;
		this.isAutoincremented= object.isAutoincremented;
		this.propertyType= object.propertyType;
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

	link(port: Port): boolean {
		let node = port.getParent() as Node;
		// let targetPort = node && node.addInPort((this.getParent() as Node).name + 'Id', false, true, false, false, false, PropertyType.INT);
		let link = this.createLinkModel();
		link.setSourcePort(this);
		// link.setTargetPort(targetPort);
		link.setTargetPort(port);

		this.diagramEngine.diagramModel.addLink(link);
		// this.diagramEngine.recalculatePortsVisually();
		return false;
	}

	canLinkToPort(port: Port): boolean {
		// if (this.firstTime) {
			// this.firstTime = false;
			return true ;
			// this.link(port);
		// } else {
		// 	return true;
		// }
	}

	createLinkModel(): Link {
		return new Link('custom');
	}
}