import { Port } from "../models/Port";
import { BaseWidgetProps, BaseWidget, PortWidget } from "storm-react-diagrams";
import React, { CSSProperties } from "react";
import AppContext from "../../context/appContext/AppContext"
import { PropertyType } from "../models/PropertyType";

export interface DefaultPortLabelProps extends BaseWidgetProps {
	model: Port;
}

export interface DefaultPortLabelState {}

export class CustomPortLabelWidget extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	static contextType = AppContext;
	constructor(props: DefaultPortLabelProps) {
		super("custom", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--in"));
	}

	render() {
		console.log('QQQQQrenderport')
		let port: JSX.Element;
		const style: CSSProperties = {
			paddingLeft: 5, paddingRight: 5, color:'black', fontWeight: 800
		}
		const containerStyles: CSSProperties = {
			display: 'flex',
			justifyContent: 'flex-end'
			
		}
		const itemStyles : CSSProperties = {
			display: 'inline-block'
		}
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
		const isPrimaryKey = this.props.model.isPrimaryKey ? <span className="mi mi-Permissions" style={style}></span> : null;//<span className="mi mi-Permissions green" /> : null
		const isForeignKey = this.props.model.isForeignKey ? <span className="mi mi-Permissions red" /> : null
		console.log('QQQQQrenderportisPrimaryKey',this.props, this.props.model.isPrimaryKey)
	
		if (isForeignKey) return <div>{port}</div>;
		else
		  return (
			<div style={containerStyles} {...this.getProps()}>
			  <div style={itemStyles}>
				{isPrimaryKey}
			  </div>
			  {/* <div>
				{isForeignKey}
			  </div> */}
			  <div style={itemStyles}>
				{label}
			  </div>
			  <div style={itemStyles}>
				{port}
			  </div>
			</div>
		  );
	  }
}