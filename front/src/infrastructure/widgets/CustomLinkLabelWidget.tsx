import * as React from "react";
import { BaseWidgetProps, BaseWidget } from "storm-react-diagrams";
import { Label } from "../models/Label";

export interface DefaultLabelWidgetProps extends BaseWidgetProps {
  model: Label;
}

export class CustomLinkLabelWidget extends BaseWidget<DefaultLabelWidgetProps> {
  constructor(props: DefaultLabelWidgetProps) {
    super("srd-default-label", props);
  }

  render() {
    return <div {...this.getProps()}>{this.props.model.label}</div>;
  }
}
