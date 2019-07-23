import { CustomPortLabelWidget } from "./CustomPortLabelWidget";
import React from "react";
import { BaseWidget, DiagramEngine, BaseWidgetProps } from "storm-react-diagrams";
import { Port } from "../models/Port";
import { Node } from "../models/Node";
import * as _ from "lodash";

export interface DefaultNodeProps extends BaseWidgetProps {
	node: Node;
	diagramEngine: DiagramEngine;
}

export interface DefaultNodeState {}

/**
 * @author Dylan Vorster
 */
export class CustomNodeWidget extends BaseWidget<DefaultNodeProps, DefaultNodeState> {
	constructor(props: DefaultNodeProps) {
		super("srd-default-node", props);
		this.state = {};
	}

	generatePort(port: Port) {
		return <CustomPortLabelWidget model={port} key={port.id} />;
	}

	render() {
		let ports = this.props.node.getPorts() as { [s: string]: Port };
		Object.keys(ports).map(p => {
			return ports[p].isPrimaryKey || ports[p].isForeignKey && ports[p];
		})
		return (
			<div {...this.getProps()} style={{ background: this.props.node.color }}>
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>
						{_.map(this.props.node.getPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}