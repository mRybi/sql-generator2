import * as React from "react";
import { DefaultLabelModel } from "../models/DefaultLabelModel";
import { DefaultLabelWidget } from "../widgets/DefaultLabelWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

export class DefaultLabelFactory extends AbstractReactFactory<
  DefaultLabelModel,
  DiagramEngine
> {
  constructor() {
    super("default");
  }

  generateReactWidget(event): JSX.Element {
    return <DefaultLabelWidget model={event.model} />;
  }

  generateModel(event): DefaultLabelModel {
    return new DefaultLabelModel();
  }
}
