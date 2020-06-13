import "./RelationPopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { Link } from "../../../infrastructure/models/Link";
import { Label } from "../../../infrastructure/models/Label";
import { Node } from "../../../infrastructure/models/Node";
import { DiagramModel, DiagramEngine } from "storm-react-diagrams";
import { Port } from "../../../infrastructure/models/Port";
import { PropertyType } from "../../../infrastructure/models/PropertyType";
import { PropertyTable } from "../../../components/propertyTable/PropertyTable";
import { LogicPort } from "../../../infrastructure/models/LogicPort";

class Props {
  isOpen: boolean;
  link: Link;
  update: () => void;
  diagramModel: DiagramModel;
  diagramEngine: DiagramEngine;
  isLogic: boolean;
}
export const RelationPopup = (props: Props) => {
  const [left, setLeft] = useState("1, N");

  const [right, setRight] = useState("1, N");

  const [relationName, setRelationName] = useState("relation name");

  React.useEffect(() => {
    let leftLabel =
      props.link &&
      props.link.labels.length > 2 &&
      (props.link.labels[0] as Label).label;
    let relLabel =
      props.link &&
      props.link.labels.length > 2 &&
      (props.link.labels[1] as Label).label;
    let rightLabel =
      props.link &&
      props.link.labels.length > 2 &&
      (props.link.labels[2] as Label).label;

    setLeft(leftLabel ? leftLabel : "1, N");
    setRelationName(relLabel ? relLabel : "relation name");
    setRight(rightLabel ? rightLabel : "1, N");
  }, [props.link]);

  let update = () => {
    let labels = props.link.labels as Label[];
    labels[0].label = left;
    labels[2].label = right;
    labels[1].label = relationName;
    let points = props.link.points;
    for (let index = 1; index < points.length - 1; index++) {
      const element = points[index];
      element.remove();
    }
    props.update();
  };

  const sourcePort =
    props.link &&
    props.link.sourcePort &&
    (props.link.sourcePort.parent as Node);
  const targetPort =
    props.link &&
    props.link.targetPort &&
    (props.link.targetPort.parent as Node);

  const remove = () => {
    const sourceP = props.link && props.link.sourcePort;
    const targetP = props.link && props.link.targetPort;
    sourceP.removeLink(props.link);
    targetP.removeLink(props.link);

    props.diagramModel.removeLink(props.link);

    if(props.isLogic) {
      let thisParent = props.link.targetPort.getParent() as Node;
      let portNode = props.link.sourcePort.getParent() as Node;
  
      let portNodePorts = portNode.getPorts() as {[s: string]: LogicPort};
      let thisParentPorts = thisParent.getPorts() as {[s: string]: LogicPort};
  
      let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].fkPortId === portNode.id)[0];
      let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(id => portNodePorts[id].fkPortId === thisParent.id)[0];
      
      if(czyMaPortZPKjakoFk) {
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
      <div className="grid-item">
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
      </div>
    );
  };

  const reverseLink = () => {
    let thisParent = props.link.targetPort.getParent() as Node;
    let portNode = props.link.sourcePort.getParent() as Node;

    let portNodePorts = portNode.getPorts() as {[s: string]: LogicPort};
    let thisParentPorts = thisParent.getPorts() as {[s: string]: LogicPort};

    let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].fkPortId === portNode.id)[0];
    let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(id => portNodePorts[id].fkPortId === thisParent.id)[0];
    

    if(czyMaPortZPKjakoFk) {
      let labels = props.link.labels as Label[];
      labels[0].label = '1';
      labels[1].label = 'N';

      thisParent.removePort(thisParentPorts[czyMaPortZPKjakoFk]);

      let pk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].isPrimaryKey)[0];
      portNode.addInPort(true,false,thisParent.name + thisParentPorts[pk].name, false, true, false,false,true,'INT', thisParent.id)
    } else {
      let labels = props.link.labels as Label[];
      labels[0].label = 'N';
      labels[1].label = '1';

      portNode.removePort(portNodePorts[czyMaPortZPKjakoFk2]);

      let pk = Object.keys(portNodePorts).filter(id => portNodePorts[id].isPrimaryKey)[0];
      thisParent.addInPort(true,false,portNode.name + portNodePorts[pk].name, false, true, false,false,true,'INT', thisParent.id)
    }
    
    props.update();
  }

  if (props.isLogic) {
    return (
      <Popup modal closeOnDocumentClick open={props.isOpen} closeOnEscape>
        <div className="SQLResultDialog">
          <div className="grid-item">
            <button onClick={remove}>Remove</button>
          </div>
          <div className="grid-item">
            <button onClick={reverseLink}>Reverse</button>
          </div>
        </div>
      </Popup>
    );
  } else
    return (
      <Popup modal closeOnDocumentClick open={props.isOpen} closeOnEscape>
        <div className="SQLResultDialog">
          <div className="grid-container">
            <div className="grid-item">
              <p>{sourcePort && sourcePort.name}</p>
            </div>
            <div className="grid-item">
              <input
                className="darkInput"
                type="text"
                defaultValue={relationName}
                onChange={(event) => setRelationName(event.target.value)}
              ></input>
            </div>
            <div className="grid-item">
              <p>{targetPort && targetPort.name}</p>
            </div>
            {renderOptionPicker("left")}
            <div className="grid-item">
              <button onClick={update}>SAVE</button>
            </div>
            {renderOptionPicker("right")}
            {/* <div className="grid-item" /> */}
            <div className="grid-item"></div>
            <div className="grid-item">
              <button onClick={remove}>Remove</button>
            </div>
            {/* <div className="grid-item" /> */}
          </div>
          {props.link && left.includes("N") && right.includes("N") && (
            <div>
              <h3 style={{ margin: 0 }}>Atributes:</h3>
              <PropertyTable
                relView={true}
                diagramEngine={props.diagramEngine}
                selectedItem={props.link.properties}
                isLogic={props.isLogic}
              />
            </div>
          )}
        </div>
      </Popup>
    );
};
