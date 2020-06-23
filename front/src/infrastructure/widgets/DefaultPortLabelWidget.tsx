import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { DefaultPortModel } from "../models/DefaultPortModel";
import styled from "@emotion/styled";

export interface DefaultPortLabelProps {
  port: DefaultPortModel;
  engine: DiagramEngine;
}

namespace S {
  export const PortLabel = styled.div`
  display: flex;
  margin-top: 1px;
  align-items: center;
`;

  export const Label = styled.div`
  flex-grow: 1;
`;

  export const Port = styled.div`
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgb(192, 255, 0);
  }
  `;

  export const PrimaryKeyIcon = styled.span`
    padding:  3px 5px;
    color: black;
    font-weight: 800;
  `;

  export const PortContainer = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  export const PortItem = styled.div`
    display: inline-block;
    margin-right: 5px;
  `;

  export const HiddenPort = styled(PortItem)`
    display: none;
  `;

  export const NamedPort = styled(PortItem)`
   margin-right: 5px;
  `;
}

export const DefaultPortLabel = (props: DefaultPortLabelProps) => {
  let { port, engine } = props;

  if (!port.isNamePort) {
    port.setLocked();
  }

  let portJSX: JSX.Element = (
    <PortWidget engine={engine} port={port}>
      <S.Port />
    </PortWidget>
  );

  const label: JSX.Element = (
    <S.PortLabel>
      <div>
        {port.label}
        {' '}
        {port.propertyType}
      </div>
    </S.PortLabel>
  );

  const isPrimaryKey = port.isPrimaryKey &&
    <S.PrimaryKeyIcon className="mi mi-Permissions"></S.PrimaryKeyIcon>

  if (port.isNamePort) {
    return <S.NamedPort>{portJSX}</S.NamedPort>;
  } else {
    return (
      <S.PortContainer>
        <S.PortItem>{isPrimaryKey}</S.PortItem>
        <S.PortItem>{label}</S.PortItem>
        <S.HiddenPort>{portJSX}</S.HiddenPort>
      </S.PortContainer>
    );
  }
}
