import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

export interface DarkInputProps {
    fontSize?: number
    type: string
    defaultValue: string
    onChange: (event) => void;
}
namespace S {
  export const Input = styled.input<{fontSize?: number}>`
    background-color: #3E3E3E;
    color: #E9F7F7;
    margin-top: 7px;
    width: 150px;
    margin-right: 0px;
    padding-right: 0px;

    ${({fontSize}) => 
    css`
        font-size: ${fontSize}px;
        margin-top: 15px;
        width: 90%;
    `}
  `;
}

export class DarkInput extends React.Component<DarkInputProps> {
  render() {

    return (
      <S.Input
        {...this.props}
      >
        {this.props.children}
      </S.Input>
    );
  }
}
