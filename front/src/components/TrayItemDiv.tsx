import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

export interface TrayItemDivProps {
  color: string;
  name?: string;
  onClick: () => void;
  marginTop?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}
namespace S {
  export const Tray = styled.div<{
    color: string;
    marginTop: string;
    isSelected: boolean;
    isDisabled: boolean;
  }>`
    color: white;
    font-family: Helvetica, Arial;
    padding: 5px;
    margin: 0px 10px;
    border: solid 1px ${({color}) => color};
    border-radius: 5px;
    margin-bottom: 2px;
    cursor: pointer;
    margin-top: ${({marginTop}) => marginTop};

    display: flex;
    justify-content: space-between;
  
    ${({isSelected}) =>
      isSelected &&
      css`
        background-color: black;
        border-width: 4px !important;
      `}
  
    ${({isDisabled}) =>
      isDisabled &&
      css`
        cursor: not-allowed !important;
      `}
  `;
}

export class TrayItemDiv extends React.Component<TrayItemDivProps> {
  render() {
    let { isDisabled,isSelected, marginTop, color, name } = this.props;

    return (
      <S.Tray
        {...this.props}
        isDisabled={isDisabled}
        isSelected={isSelected}
        marginTop={marginTop}
        color={color}
      >
        {this.props.children ?? name}
      </S.Tray>
    );
  }
}
