import * as _ from "lodash";
import { Link } from "./Link";
import { Node } from "./Node";
import { PortModel, DiagramEngine, PointModel } from "storm-react-diagrams";
import { PropertyType } from "./PropertyType";

export class Port extends PortModel {
	isNamePort: boolean;

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

	constructor(diagramEngine: DiagramEngine, isInput: boolean, name: string, isNamePort: boolean, isPrimaryKey?: boolean, isForeignKey?: boolean, isNotNull?: boolean, isAutoincremented?: boolean, isUnique?: boolean, propertyType?: PropertyType, id?: string) {
		super(name, "custom", id);
		this.in = isInput;
		this.label = name;
		this.isNamePort = isNamePort;
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
		this.isNamePort = object.isNamePort;

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
			isNamePort: this.isNamePort,
			isPrimaryKey: this.isPrimaryKey,
			isForeignKey: this.isForeignKey,
			isNotNull: this.isNotNull,
			isUnique: this.isUnique,
			isAutoincremented: this.isAutoincremented,
			propertyType: this.propertyType,
		});
	}



	link(port: Port): boolean {
		// if(!this.firstTime) {
		// 	return true;
		// } else {
			
			let node = port.getParent() as Node;
			let nodeCords = {x: node.x-50, y: node.y  -50};
			let nodeCords2 = {x: node.x+ 50, y: node.y  -50};
	
			let link = this.createLinkModel();
	
			link.setSourcePort(port);
			link.setTargetPort(port);
			link.addPoint(new PointModel(link, nodeCords));
			link.addPoint(new PointModel(link, nodeCords2));
			
			link.setLocked(false);
			link.addListener({
				selectionChanged: () => {console.log('asdasdas')}
			});
			
			this.diagramEngine.diagramModel.addLink(link);
			this.diagramEngine.repaintCanvas();
			this.firstTime = false;

			return false;
		// }
	}

	canLinkToPort(port: Port): boolean {
			console.log('tosamo', port=== this, this.firstTime);
		if(port === this) {
			return this.link(port);
		}
		// this.diagramEngine.recalculatePortsVisually();
		return true;
	}

	createLinkModel(): Link {
		return new Link('custom');
	}
}