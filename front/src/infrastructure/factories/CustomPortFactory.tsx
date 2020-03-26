import { AbstractPortFactory } from "storm-react-diagrams";
import { Port } from "../models/Port";

export class CustomPortFactory extends AbstractPortFactory<Port> {
	constructor() {
		super("custom");
	}

	getNewInstance(initialConfig?: any): Port {
		return new Port(null, true, "custom", false);
	}
}