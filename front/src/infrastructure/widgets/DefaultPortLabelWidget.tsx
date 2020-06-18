import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '../models/DefaultPortModel';
import styled from '@emotion/styled';

export interface DefaultPortLabelProps {
	port: DefaultPortModel;
	engine: DiagramEngine;
}

export const PortLabel = styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
	`;

export const Label = styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`;

export const Port = styled.div`
		width: 15px;
		height: 15px;
		background: rgba(255,255,255,0.1);

		&:hover {
			background: rgb(192, 255, 0);
		}
	`;

const style: React.CSSProperties = {
	paddingLeft: 5,
	paddingRight: 5,
	color: "black",
	fontWeight: 800
};

const containerStyles: React.CSSProperties = {
	display: "flex",
	justifyContent: "flex-end"
};

const itemStyles: React.CSSProperties = {
	display: "inline-block",
	marginRight: "5px"
};

const portStyles: React.CSSProperties = {
	display: "none"
};

const namedPortStyles: React.CSSProperties = {
	marginRight: "5px"
};

export class DefaultPortLabel extends React.Component<DefaultPortLabelProps> {
	render() {
		// const port = (
		// 	<PortWidget engine={this.props.engine} port={this.props.port}>
		// 		<Port />
		// 	</PortWidget>
		// );
		// const label = <Label>{this.props.port.getOptions().label}</Label>;

		let port: JSX.Element;

		if (!this.props.port.isNamePort) {
			this.props.port.setLocked();
			port = (
				<PortWidget engine={this.props.engine} port={this.props.port}>
					<Port />
				</PortWidget>
			);
		} else {
			port = (
				<PortWidget engine={this.props.engine} port={this.props.port}>
					<Port />
				</PortWidget>
			);
		}

		const label: JSX.Element = (
			<div className="name">
				<div>
					{this.props.port.label}{" "}
					{this.props.port.propertyType !== undefined
						? this.props.port.propertyType
						: null}
				</div>
			</div>
		);

		const isPrimaryKey = this.props.port.isPrimaryKey ? (
			<span className="mi mi-Permissions" style={style}></span>
		) : null;

		if (this.props.port.isNamePort) {
			return <div style={namedPortStyles}>{port}</div>;
		} else {
			return (
				<div style={containerStyles}>
					<div style={itemStyles}>{isPrimaryKey}</div>
					<div style={itemStyles}>{label}</div>
					<div style={portStyles}>{port}</div>
				</div>
			);
		}

		// return (
		// 	<PortLabel>
		// 		{this.props.port.getOptions().in ? port : label}
		// 		{this.props.port.getOptions().in ? label : port}
		// 	</PortLabel>
		// );
	}
}
