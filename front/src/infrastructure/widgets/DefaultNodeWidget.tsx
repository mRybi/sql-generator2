import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from '../models/DefaultNodeModel';
import { DefaultPortLabel } from '../widgets/DefaultPortLabelWidget';
import styled from '@emotion/styled';
import { DefaultPortModel } from '../models/DefaultPortModel';

export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${(p) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};

	`;

export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;

		justify-items: center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export interface DefaultNodeProps {
	node: DefaultNodeModel;
	engine: DiagramEngine;
}

export class DefaultNodeWidget extends React.Component<DefaultNodeProps> {
	generatePort = (port) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.options.id} />;
	};

	render() {
		const namedPortStyles: React.CSSProperties = {
			margin: "3px"
		};

		const namedLEftPortStyles: React.CSSProperties = {
			marginTop: "3px"
		};

		let ports = this.props.node.getPorts() as { [s: string]: DefaultPortModel };
		let portsJSX = _.map(ports, this.generatePort.bind(this));
		let namedPort = portsJSX.filter(p => p.props.port.isNamePort);
		let notNamedPort = portsJSX.filter(p => !p.props.port.isNamePort);

		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}>
				<Title>
					{namedPort.length !== 0 && (
						<div style={namedPortStyles}>
							{this.generatePort(namedPort[1].props.port)}
						</div>
					)}
					{this.props.node.isLabel ? 
					<TitleName>{this.props.node.getOptions().name}</TitleName>
					: <TitleName>{this.props.node.getOptions().name}</TitleName>}
					{namedPort.length !== 0 &&
						<div style={namedLEftPortStyles}>
							{this.generatePort(namedPort[0].props.port)}
						</div>}
				</Title>
				<Ports>
					<PortsContainer>{notNamedPort}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}
