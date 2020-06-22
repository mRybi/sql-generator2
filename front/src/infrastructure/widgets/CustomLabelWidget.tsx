import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from '../models/DefaultNodeModel';
import styled from '@emotion/styled';

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

export interface DefaultNodeProps {
	node: DefaultNodeModel;
	engine: DiagramEngine;
}

export class CustomLabelWidget extends React.Component<DefaultNodeProps> {
	render() {
		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}>
				<Title>
					<TitleName>{this.props.node.getOptions().name}</TitleName>
				</Title>
			</Node>
		);
	}
}
