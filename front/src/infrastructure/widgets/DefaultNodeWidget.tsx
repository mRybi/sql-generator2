import * as React from "react";
import * as _ from "lodash";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { DefaultNodeModel } from "../models/DefaultNodeModel";
import { DefaultPortLabel } from "../widgets/DefaultPortLabelWidget";
import styled from "@emotion/styled";
import { DefaultPortModel } from "../models/DefaultPortModel";


namespace S {
  export const Node = styled.div<{ background: string; selected: boolean }>`
    background-color: ${(p) => p.background};
    border-radius: 5px;
    font-family: sans-serif;
    color: white;
    border: solid 2px black;
    overflow: visible;
    font-size: 11px;
    border: solid 2px ${(p) => (p.selected ? "rgb(0,192,255)" : "black")};
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

  export const NamedPortLeft = styled.div`
    margin-top: 5px;
    margin-left: 5px
  `;

  export const NamedPortRight = styled.div`
    margin-top: 5px
  `;
}


export interface DefaultNodeProps {
  node: DefaultNodeModel;
  engine: DiagramEngine;
}

export const DefaultNodeWidget = (props: DefaultNodeProps) => {
  const generatePort = (port) => {
    return (
      <DefaultPortLabel
        engine={props.engine}
        port={port}
        key={port.options.id}
      />
    );
  };

    let { node } = props;
    let ports = node.getPorts() as { [s: string]: DefaultPortModel };
    let portsJSX = _.map(ports, generatePort);
    let namedPortsJSX = portsJSX.filter((p) => p.props.port.isNamePort);
    let notNamedPortsJSX = portsJSX.filter((p) => !p.props.port.isNamePort);

    return (
      <S.Node
        data-default-node-name={node.getOptions().name}
        selected={node.isSelected()}
        background={node.getOptions().color}
      >
        <S.Title>
          {namedPortsJSX.length !== 0 && (
            <S.NamedPortLeft>
              {generatePort(namedPortsJSX[1].props.port)}
            </S.NamedPortLeft>
          )}

          <S.TitleName>{node.getOptions().name}</S.TitleName>

          {namedPortsJSX.length !== 0 && (
            <S.NamedPortRight>
              {generatePort(namedPortsJSX[0].props.port)}
            </S.NamedPortRight>
          )}
        </S.Title>
        <S.Ports>
          <S.PortsContainer>{notNamedPortsJSX}</S.PortsContainer>
        </S.Ports>
      </S.Node>
    );
}
