import { Port } from "../models/Port";
import { BaseWidgetProps, BaseWidget, PortWidget } from "storm-react-diagrams";
import React from "react";
import AppContext from "../../context/appContext/AppContext"
import { PropertyType } from "../models/PropertyType";
import { AppViewType } from "../../AppView";

export interface DefaultPortLabelProps extends BaseWidgetProps {
	model: Port;
}

export interface DefaultPortLabelState {}

export class CustomPortLabelWidget extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	static contextType = AppContext;
	constructor(props: DefaultPortLabelProps) {
		super("srd-default-port", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--in"));
	}

	render() {
		let port: JSX.Element;
		if (!this.props.model.isPrimaryKey) {
		  this.props.model.setLocked();
		  port = <PortWidget node={this.props.model.getParent()} name={this.props.model.name} />;
		} else {
		  port = <PortWidget node={this.props.model.getParent()} name={this.props.model.name} />;
		}
	
		const label: JSX.Element = <div className="name">
		  <div>
			{this.props.model.label} {this.props.model.propertyType !== undefined ? PropertyType[this.props.model.propertyType] : null}
		  </div>
		</div>;
		const isPrimaryKey = this.props.model.isPrimaryKey ? <span className="mi mi-Permissions green" /> : null
		const isForeignKey = this.props.model.isForeignKey ? <span className="mi mi-Permissions red" /> : null
	
		if (this.context.view === AppViewType.ENTITY && isForeignKey) return <div>{port}</div>;
		else
		  return (
			<div {...this.getProps()}>
			  <div>
				{isPrimaryKey}
			  </div>
			  <div>
				{isForeignKey}
			  </div>
			  <div>
				{label}
			  </div>
			  <div>
				{port}
			  </div>
			</div>
		  );
	  }
}