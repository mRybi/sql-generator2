import { AbstractNodeFactory, DiagramEngine } from "storm-react-diagrams";
import { Node } from "../models/Node";
import * as React from "react";
import { CustomLabelWidget } from "../widgets/CustomLabelWidget";

export class CustomLabelFactory extends AbstractNodeFactory<Node> {
	constructor() {
		super("label");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: Node): JSX.Element {
		return React.createElement(CustomLabelWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): Node {
		return new Node(null, "label");
	}
}