import { AbstractNodeFactory, DiagramEngine } from "storm-react-diagrams";
import React from "react";
import { CustomNodeWidget } from "../widgets/CustomNodeWidget";
import { Node } from '../models/Node';

export class CustomNodeFactory extends AbstractNodeFactory<Node> {
	constructor() {
		super("custom");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: Node): JSX.Element {
		return React.createElement(CustomNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): Node {
		return new Node(false, null, "custom");
	}
}