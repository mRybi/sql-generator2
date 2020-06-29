import React, { useState } from "react";
import Popup from "reactjs-popup";
import { DefaultLinkModel } from "../../../infrastructure/models/DefaultLinkModel";
import { DefaultLabelModel } from "../../../infrastructure/models/DefaultLabelModel";
import { DefaultNodeModel } from "../../../infrastructure/models/DefaultNodeModel";
import { AdvancedPortModel } from "../../../infrastructure/models/ArrowPortModel";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { PropertyTable } from "../../PropertyTable/PropertyTable";
import { DefaultPortModel } from "../../../infrastructure/models/DefaultPortModel";
import { ArrowLinkModel } from "../../../infrastructure/models/ArrowLinkModel";
import { Toolkit } from "../../../infrastructure/Toolkit";
import styled from "@emotion/styled";

namespace S {
  export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
  `;

  export const GridItem = styled.div`
    background-color: rgba(255, 255, 255, 0.274);
    padding: 10px;
    text-align: center;
  `;
}
class Props {
  isOpen: boolean;
  link: DefaultLinkModel;
  update: () => void;
  diagramEngine: DiagramEngine;
  isLogic: boolean;
}
export const RelationPopup = (props: Props) => {
  const [left, setLeft] = useState("1, N");

  const [right, setRight] = useState("1, N");

  const [relationAtributes, setRelationAtributes] = useState("");
  const [relationNameOnly, setRelationNameOnly] = useState("relation name");


  React.useEffect(() => {
    let leftLabel =
      props.link &&
      props.link.getLabels().length > 2 &&
      (props.link.getLabels()[0] as DefaultLabelModel).getOptions().label;
    let relLabel =
      props.link &&
      props.link.getLabels().length > 2 &&
      (props.link.getLabels()[1] as DefaultLabelModel).getOptions().label;
    let rightLabel =
      props.link &&
      props.link.getLabels().length > 2 &&
      (props.link.getLabels()[2] as DefaultLabelModel).getOptions().label;

    setLeft(leftLabel ? leftLabel : "1, N");

    setRight(rightLabel ? rightLabel : "1, N");
  }, [props.link]);

  let update = () => {
    let x = handleRelationNameChenge();
    let labels = props.link.getLabels() as DefaultLabelModel[];
    labels[0].getOptions().label = left;
    labels[2].getOptions().label = right;
    labels[1].getOptions().label = relationNameOnly + x;

    props.link.relName = relationNameOnly;


    let points = props.link.getPoints();
    for (let index = 1; index < points.length - 1; index++) {
      const element = points[index];
      element.remove();
    }

    setRelationAtributes(x);
    props.update();
  };

  const handleRelationNameChenge = () => {
    console.log(props.link.relName);

    let relationAtributes = props.link.properties !== null && props.link.properties.getPorts() as {[s: string]: DefaultPortModel};
    let attString = '';

    if(Object.keys(relationAtributes).length > 0) {
      Object.keys(relationAtributes).map(id => attString += `${relationAtributes[id].label} ${relationAtributes[id].propertyType} \n`);
      
      const newRelName = '\n' + attString;
      return newRelName;
    }
      else {
        return '';
      }


  }

  const sourcePort =
    props.link &&
    props.link.getSourcePort() &&
    (props.link.getSourcePort().getParent() as DefaultNodeModel);
  const targetPort =
    props.link &&
    props.link.getTargetPort() &&
    (props.link.getTargetPort().getParent() as DefaultNodeModel);

  const remove = () => {
    const sourceP = props.link && props.link.getSourcePort();
    const targetP = props.link && props.link.getTargetPort();
    sourceP.removeLink(props.link);
    targetP.removeLink(props.link);

    props.diagramEngine.getModel().removeLink(props.link);

    if (props.isLogic) {
      let thisParent = props.link
        .getTargetPort()
        .getParent() as DefaultNodeModel;
      let portNode = props.link.getSourcePort().getParent() as DefaultNodeModel;

      let portNodePorts = portNode.getPorts() as {
        [s: string]: AdvancedPortModel;
      };
      let thisParentPorts = thisParent.getPorts() as {
        [s: string]: AdvancedPortModel;
      };

      let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(
        (id) => thisParentPorts[id].fkPortId === portNode.getOptions().id
      )[0];
      let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(
        (id) => portNodePorts[id].fkPortId === thisParent.getOptions().id
      )[0];

      if (czyMaPortZPKjakoFk) {
        thisParent.removePort(thisParentPorts[czyMaPortZPKjakoFk]);
      } else {
        portNode.removePort(portNodePorts[czyMaPortZPKjakoFk2]);
      }
    }

    props.update();
  };

  const options = (
    <>
      <option value="0, N">0, N</option>
      <option value="1, N">1, N</option>
      <option value="0, 1">0, 1</option>
      <option value="1, 1">1, 1</option>
      <option value="N, N">N, N</option>
    </>
  );

  const renderOptionPicker = (side: string) => {
    return (
      // <div className="grid-item">
      <S.GridItem>

        <select
          className="darkSelect"
          onChange={(event) =>
            side === "left"
              ? setLeft(event.target.value)
              : setRight(event.target.value)
          }
          value={side === "left" ? left : right}
        >
          {options}
        </select>
      </S.GridItem>
      // </div>
    );
  };

  const reverseLink = () => {
    let thisParent = props.link.getTargetPort().getParent() as DefaultNodeModel;
    let portNode = props.link.getSourcePort().getParent() as DefaultNodeModel;

    let portNodePorts = portNode.getPorts() as {
      [s: string]: DefaultPortModel;
    };
    let thisParentPorts = thisParent.getPorts() as {
      [s: string]: DefaultPortModel;
    };

    // let portNodePorts = portNode.getPorts() as {[s: string]: LogicPort};
    // let thisParentPorts = thisParent.getPorts() as {[s: string]: LogicPort};

    let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(
      (id) => thisParentPorts[id].fkPortId === portNode.getOptions().id
    )[0];
    let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(
      (id) => portNodePorts[id].fkPortId === thisParent.getOptions().id
    )[0];

    if (czyMaPortZPKjakoFk) {
      thisParent.removePort(thisParentPorts[czyMaPortZPKjakoFk]);
      let pk = Object.keys(thisParentPorts).filter(
        (id) => thisParentPorts[id].isPrimaryKey
      )[0];
      portNode.addPort(
        new AdvancedPortModel(
          // true,
          thisParent.getOptions().name + thisParentPorts[pk].getOptions().name,
          false,
          false,
          false,
          true,
          false,
          true,
          true,
          "INT",
          Toolkit.UID(),
          thisParent.getOptions().id
        )
      );
    } else {
      portNode.removePort(portNodePorts[czyMaPortZPKjakoFk2]);

      let pk = Object.keys(portNodePorts).filter(
        (id) => portNodePorts[id].isPrimaryKey
      )[0];
      portNode.addPort(
        new AdvancedPortModel(
          // true,

          portNode.getOptions().name + portNodePorts[pk].getOptions().name,
          false,
          false,
          false,
          true,
          false,
          true,
          true,
          "INT",
          Toolkit.UID(),
          portNode.getOptions().id
        )
      );
    }

    let newSourceP = props.link.getTargetPort();
    let newTargetP = props.link.getSourcePort();
    let model = props.diagramEngine.getModel();

    model.removeLink(props.link);

    let link = new ArrowLinkModel({ type: "arrow" });

    link.setSourcePort(newSourceP);
    link.setTargetPort(newTargetP);
    model.addLink(link);

    props.update();
  };

  if (props.isLogic) {
    return (
      <Popup modal closeOnDocumentClick open={props.isOpen} closeOnEscape>
        <>
          <S.GridItem>
            <button onClick={remove}>Remove</button>
          </S.GridItem>
          <S.GridItem>
            <button onClick={reverseLink}>Reverse</button>
          </S.GridItem>
        </>
      </Popup>
    );
  } else
    return (
      <Popup modal closeOnDocumentClick open={props.isOpen} closeOnEscape onClose={props.update}>
        <>
          <S.GridContainer>
            <S.GridItem>

              <p>{sourcePort && sourcePort.getOptions().name}</p>
            </S.GridItem>

            <S.GridItem>
              <input
                type="text"
                defaultValue={relationNameOnly}
                onChange={(event) => setRelationNameOnly(event.target.value)}
              ></input>
            </S.GridItem>
            <S.GridItem>

              <p>{targetPort && targetPort.getOptions().name}</p>
            </S.GridItem>
            {renderOptionPicker("left")}
            <S.GridItem>

              <button onClick={update}>SAVE</button>
            </S.GridItem>
            {renderOptionPicker("right")}
            <S.GridItem></S.GridItem>
            <S.GridItem>

              <button onClick={remove}>Remove</button>
            </S.GridItem>
            </S.GridContainer>
          {props.link && (
            <div>
              <h3 style={{ margin: 0 }}>Atributes:</h3>
              <PropertyTable
              relationName={relationNameOnly}
                update={update}
                relView={true}
                link={props.link}
                diagramEngine={props.diagramEngine}
                selectedItem={props.link.properties}
                isLogic={props.isLogic}
              />
            </div>
          )}
        </>
      </Popup>
    );
};
