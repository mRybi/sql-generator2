import { BaseWidgetProps, DiagramEngine, BaseWidget, DefaultPortLabel } from "storm-react-diagrams";
import { Node } from '../models/Node';
import * as React from "react";
import * as _ from "lodash";

export interface NodeProps extends BaseWidgetProps {
	node: Node;
	diagramEngine: DiagramEngine;
}

export interface DefaultNodeState {}

export class CustomLabelWidget extends BaseWidget<NodeProps, DefaultNodeState> {
	constructor(props: NodeProps) {
		super("srd-default-node", props);
		this.state = {};
	}

	render() {
		return (
		<div {...this.getProps()} style={{ background: this.props.node.color}}>
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
			</div>
		);
	}
}