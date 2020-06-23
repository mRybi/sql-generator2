import * as React from "react";
import { DefaultNodeModel } from "../models/DefaultNodeModel";
import { CustomLabelWidget } from "../widgets/CustomLabelWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

export class CustomLabelFactory extends AbstractReactFactory<
  DefaultNodeModel,
  DiagramEngine
> {
  constructor() {
    super("label");
  }

  generateReactWidget(event): JSX.Element {
    return <CustomLabelWidget engine={this.engine} node={event.model} />;
  }

  generateModel(event): DefaultNodeModel {
    return new DefaultNodeModel(true, "Label", "rgb(192,255,0)");
  }
}
