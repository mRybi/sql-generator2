import "./RelationPopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { DefaultLinkModel } from "../../../infrastructure/models/DefaultLinkModel";
import { DefaultLabelModel } from "../../../infrastructure/models/DefaultLabelModel";
import { DefaultNodeModel } from "../../../infrastructure/models/DefaultNodeModel";
import { PropertyType } from "../../../infrastructure/models/PropertyType";
// import { LogicPort } from "../../../infrastructure/models/LogicPort";
import { AdvancedPortModel } from "../../../infrastructure/models/ArrowPortModel";
import { DiagramModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { PropertyTable } from "../../PropertyTable/PropertyTable";
import { DefaultPortModel } from "../../../infrastructure/models/DefaultPortModel";
import { ArrowLinkModel } from "../../../infrastructure/models/ArrowLinkModel";
import { Toolkit } from "../../../infrastructure/Toolkit";

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

  const [relationName, setRelationName] = useState("relation name");

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
    setRelationName(relLabel ? relLabel : "relation name");
    setRight(rightLabel ? rightLabel : "1, N");
  }, [props.link]);

  let update = () => {
    let labels = props.link.getLabels() as DefaultLabelModel[];
    labels[0].getOptions().label = left;
    labels[2].getOptions().label = right;
    labels[1].getOptions().label = relationName;
    let points = props.link.getPoints();
    for (let index = 1; index < points.length - 1; index++) {
      const element = points[index];
      element.remove();
    }
    props.update();
  };

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


    if(props.isLogic) {
      let thisParent = props.link.getTargetPort().getParent() as DefaultNodeModel;
      let portNode = props.link.getSourcePort().getParent() as DefaultNodeModel;
  
      let portNodePorts = portNode.getPorts() as {[s: string]: AdvancedPortModel};
      let thisParentPorts = thisParent.getPorts() as {[s: string]: AdvancedPortModel};
  
      let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].fkPortId === portNode.getOptions().id)[0];
      let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(id => portNodePorts[id].fkPortId === thisParent.getOptions().id)[0];
      
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
    let thisParent = props.link.getTargetPort().getParent() as DefaultNodeModel;
    let portNode = props.link.getSourcePort().getParent() as DefaultNodeModel;

    let portNodePorts = portNode.getPorts() as {[s: string]: DefaultPortModel};
    let thisParentPorts = thisParent.getPorts() as {[s: string]: DefaultPortModel};

    // let portNodePorts = portNode.getPorts() as {[s: string]: LogicPort};
    // let thisParentPorts = thisParent.getPorts() as {[s: string]: LogicPort};

    let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].fkPortId === portNode.getOptions().id)[0];
    let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(id => portNodePorts[id].fkPortId === thisParent.getOptions().id)[0];
    

    if(czyMaPortZPKjakoFk) {
      thisParent.removePort(thisParentPorts[czyMaPortZPKjakoFk]);
      let pk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].isPrimaryKey)[0];
      portNode.addPort(new AdvancedPortModel(
        // true,
        thisParent.getOptions().name + thisParentPorts[pk].getOptions().name,false,false,false, true, false, true, true, 'INT', Toolkit.UID(), thisParent.getOptions().id));
    
    
      } else {
      portNode.removePort(portNodePorts[czyMaPortZPKjakoFk2]);

      let pk = Object.keys(portNodePorts).filter(id => portNodePorts[id].isPrimaryKey)[0];
      portNode.addPort(new AdvancedPortModel(
        // true,

        portNode.getOptions().name + portNodePorts[pk].getOptions().name,false,false,false, true, false, true, true, 'INT', Toolkit.UID(), portNode.getOptions().id));
    

      }

        let newSourceP = props.link.getTargetPort();
        let newTargetP = props.link.getSourcePort();
        let model = props.diagramEngine.getModel();

        model.removeLink(props.link);

        let link = new ArrowLinkModel({ type: 'arrow' });

        link.setSourcePort(newSourceP);
        link.setTargetPort(newTargetP);
        model.addLink(link);

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
              <p>{sourcePort && sourcePort.getOptions().name}</p>
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
              <p>{targetPort && targetPort.getOptions().name}</p>
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
          {props.link && (
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
