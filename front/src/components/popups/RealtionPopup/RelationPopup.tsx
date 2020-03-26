import "./RelationPopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { Link } from "../../../infrastructure/models/Link";
import { Label } from "../../../infrastructure/models/Label";
import { Node } from "../../../infrastructure/models/Node";
import { DiagramModel } from "storm-react-diagrams";

class Props {
  isOpen: boolean;
  link: Link;
  update: () => void;
  diagramModel: DiagramModel;
}
export const RelationPopup = (props: Props) => {
  const [left, setLeft] = useState("0, N");

  const [right, setRight] = useState("0, N");

  const [relationName, setRelationName] = useState("relation name");

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
    props.diagramModel.removeLink(props.link);
    props.update();
  };

  const options = (
    <>
      <option value="1, N">1, N</option>
      <option value="0, N">0, N</option>
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
          onChange={event =>
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
              onChange={event => setRelationName(event.target.value)}
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
          <div className="grid-item" />
          <div className="grid-item">
            <button onClick={remove}>Remove</button>
          </div>
          <div className="grid-item" />
        </div>
      </div>
    </Popup>
  );
};
