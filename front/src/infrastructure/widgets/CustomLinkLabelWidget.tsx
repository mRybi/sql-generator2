import * as React from "react";
import { BaseWidgetProps, BaseWidget } from "storm-react-diagrams";
import { Label } from "../models/Label";
import AppContext from "../../context/appContext/AppContext";

export interface DefaultLabelWidgetProps extends BaseWidgetProps {
	model: Label;
}

export class CustomLinkLabelWidget extends BaseWidget<DefaultLabelWidgetProps> {
	static contextType = AppContext;
	constructor(props: DefaultLabelWidgetProps) {
		super("srd-default-label", props);
	}

	render() {
		if(this.context.view === 0) {
			return <div {...this.getProps()}>{this.props.model.label}</div>;
		} else {
			return null;
		}
	}
}
