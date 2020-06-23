import * as React from "react";
import { DefaultNodeModel } from "../models/DefaultNodeModel";
import { DefaultNodeWidget } from "../widgets/DefaultNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

export class DefaultNodeFactory extends AbstractReactFactory<
  DefaultNodeModel,
  DiagramEngine
> {
  constructor() {
    super("default");
  }

  generateReactWidget(event): JSX.Element {
    return <DefaultNodeWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event): DefaultNodeModel {
    return new DefaultNodeModel(false, "Entity", "rgb(0,192,255)");
  }
}
