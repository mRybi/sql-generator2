import * as _ from "lodash";
import { NodeModel, Toolkit, DiagramEngine } from "storm-react-diagrams";
import { Port } from "./Port";
import { PropertyType } from "./PropertyType";

export class Node extends NodeModel {
	name: string;
	color: string;
	ports: { [s: string]: Port };
	isLabel: boolean;

	constructor(isLabel: boolean, name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("custom");
		this.name = name;
		this.color = color;
		this.ports = {};
		this.isLabel = isLabel;
	}

	addInPort(isNamedPort: boolean, label: string, isPK: boolean, isFK: boolean, isUnique: boolean, isAuto: boolean, isNotNull: boolean, propertyType: PropertyType): Port {
		return this.addPort(new Port(label, isNamedPort, isPK, isFK, isNotNull, isAuto, isUnique, propertyType, Toolkit.UID()));
	}

	addOutPort(isNamedPort: boolean,label: string, isPK: boolean, isFK: boolean, isUnique: boolean, isAuto: boolean, isNotNull: boolean, propertyType: PropertyType): Port {
		return this.addPort(new Port(label, isNamedPort, isPK, isFK, isNotNull, isAuto, isUnique, propertyType, Toolkit.UID()));
	}

	deSerialize(object: any, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.color = object.color;
		this.isLabel = object.isLabel;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color,
			isLabel: this.isLabel
		});
	}

	getInPorts(): Port[] {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts(): Port[] {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}
}