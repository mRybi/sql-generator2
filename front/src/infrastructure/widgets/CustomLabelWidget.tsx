import * as React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { DefaultNodeModel } from "../models/DefaultNodeModel";
import styled from "@emotion/styled";

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
}

export interface DefaultNodeProps {
  node: DefaultNodeModel;
  engine: DiagramEngine;
}

export const CustomLabelWidget = (props: DefaultNodeProps) => {
  let { node } = props;
  
  return (
    <S.Node
      data-default-node-name={node.getOptions().name}
      selected={node.isSelected()}
      background={node.getOptions().color}
    >
      <S.Title>
        <S.TitleName>{node.getOptions().name}</S.TitleName>
      </S.Title>
    </S.Node>
  );
}
