import * as React from "react";
import {
  AbstractLinkFactory,
  DiagramEngine,
  DefaultLinkModel,
  DefaultLinkWidget
} from "storm-react-diagrams";
import { Link } from "../models/Link";
import { CustomLinkWidget } from "../widgets/CustomLinkWidget";


export class CustomLinkFactory extends AbstractLinkFactory<Link> {
  constructor() {
    super("custom");
  }

  generateReactWidget(
    diagramEngine: DiagramEngine,
    link: DefaultLinkModel
  ): JSX.Element {
    return React.createElement(CustomLinkWidget, {
      link: link,
      diagramEngine: diagramEngine
    });
  }

  getNewInstance(initialConfig?: any): Link {
    return new Link("custom");
  }

  generateLinkSegment(
    model: Link,
    widget: CustomLinkWidget,
    selected: boolean,
    path: string
  ) {
    return (
      <path
        className={selected ? widget.bem("--path-selected") : ""}
        strokeWidth={model.width}
        stroke={model.color}
        d={path}
      />
    );
  }
}
