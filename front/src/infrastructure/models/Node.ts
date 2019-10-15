import * as _ from "lodash";
import { NodeModel, Toolkit, DiagramEngine } from "storm-react-diagrams";
import { Port } from "./Port";
import { PropertyType } from "./PropertyType";

export class Node extends NodeModel {
	name: string;
	color: string;
	ports: { [s: string]: Port };
	engine: DiagramEngine
	engine2: DiagramEngine

	isLabel: boolean;

	constructor(isLabel: boolean, engine: DiagramEngine, engine2: DiagramEngine, name: string = "Untitled", color: string = "rgb(0,192,255)") {
		super("custom");
		this.name = name;
		this.color = color;
		this.ports = {};
		this.engine = engine;
		this.engine2 = engine2;

		this.isLabel = isLabel;
	}

	addInPort(label: string, isPK: boolean, isFK: boolean, isUnique: boolean, isAuto: boolean, isNotNull: boolean, propertyType: PropertyType): Port {
		return this.addPort(new Port(this.engine, this.engine2, true, label, isPK, isFK, isNotNull, isAuto, isUnique, propertyType, Toolkit.UID()));
	}

	addOutPort(label: string, isPK: boolean, isFK: boolean, isUnique: boolean, isAuto: boolean, isNotNull: boolean, propertyType: PropertyType): Port {
		return this.addPort(new Port(this.engine, this.engine2, true, label, isPK, isFK, isNotNull, isAuto, isUnique, propertyType, Toolkit.UID()));
	}

	deSerialize(object: any, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color
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