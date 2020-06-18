import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

export interface TrayItemDivProps {
	color: string;
    name: string;
    onClick: () => void;
    marginTop?: string;
    isSelected?: boolean;
    isDisabled?: boolean;
}

	export const Tray = styled.div<{ color: string, marginTop: string, isSelected: boolean, isDisabled: boolean }>`
		color: white;
		font-family: Helvetica, Arial;
		padding: 5px;
		margin: 0px 10px;
		border: solid 1px ${(p) => p.color};
		border-radius: 5px;
		margin-bottom: 2px;
        cursor: pointer;
        margin-top: ${p => p.marginTop};

        ${props => props.isSelected && css`
            background-color: black;
            border-width: 4px !important
        `}

        ${props => props.isDisabled && css`
            cursor: not-allowed !important;
        `}
	`;

export class TrayItemDiv extends React.Component<TrayItemDivProps> {
	render() {
		return (
			<Tray
                isDisabled={this.props.isDisabled}
                isSelected={this.props.isSelected}
                marginTop={this.props.marginTop}
				color={this.props.color}
				onClick={this.props.onClick}
				className="tray-item">
				{this.props.name}
			</Tray>
		);
	}
}