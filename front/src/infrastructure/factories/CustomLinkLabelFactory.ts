import * as React from "react";
import { AbstractLabelFactory, DiagramEngine } from "storm-react-diagrams";
import { Label } from "../models/Label";
import { CustomLinkLabelWidget } from "../widgets/CustomLinkLabelWidget";

export class CustomLinkLabelFactory extends AbstractLabelFactory<Label> {
  constructor() {
    super("custom");
  }

  generateReactWidget(diagramEngine: DiagramEngine, label: Label): JSX.Element {
    return React.createElement(CustomLinkLabelWidget, {
      model: label
    });
  }

  getNewInstance(initialConfig?: any): Label {
    return new Label("");
  }
}
