import { CustomPortLabelWidget } from "./CustomPortLabelWidget";
import React, { CSSProperties } from "react";
import {
  BaseWidget,
  DiagramEngine,
  BaseWidgetProps
} from "storm-react-diagrams";
import { Port } from "../models/Port";
import { Node } from "../models/Node";
import * as _ from "lodash";

export interface DefaultNodeProps extends BaseWidgetProps {
  node: Node;
  diagramEngine: DiagramEngine;
}

export interface DefaultNodeState {}

export class CustomNodeWidget extends BaseWidget<
  DefaultNodeProps,
  DefaultNodeState
> {
  constructor(props: DefaultNodeProps) {
    super("srd-default-node", props);
    this.state = {};
  }

  generatePort(port: Port) {
    return <CustomPortLabelWidget model={port} key={port.id} />;
  }

  render() {
    const namedPortStyles: CSSProperties = {
      marginLeft: "5px"
    };

    let ports = this.props.node.getPorts() as { [s: string]: Port };
    let portsJSX = _.map(ports, this.generatePort.bind(this));
    let namedPort = portsJSX.filter(p => p.props.model.isNamePort);
    let notNamedPort = portsJSX.filter(p => !p.props.model.isNamePort);

    return (
      <div {...this.getProps()} style={{ background: this.props.node.color }}>
        <div className={this.bem("__title")}>
          {namedPort.length !== 0 && (
            <div style={namedPortStyles}>
              {this.generatePort(namedPort[1].props.model)}
            </div>
          )}
          <div className={this.bem("__name")}>{this.props.node.name}</div>
          {namedPort.length !== 0 &&
            this.generatePort(namedPort[0].props.model)}
        </div>
        <div className={this.bem("__ports")}>
          <div className={this.bem("__in")}>{notNamedPort}</div>
        </div>
      </div>
    );
  }
}
