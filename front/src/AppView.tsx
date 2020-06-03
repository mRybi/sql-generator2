import * as React from "react";

import { DiagramWidget, PointModel, LinkModelListener } from "storm-react-diagrams";
import { TrayItemWidget } from "./components/dragAndDrop/TrayItemWidget";
import { TrayWidget } from "./components/dragAndDrop/TrayWidget";
import { Application } from "./components/dragAndDrop/Application";
import { Node } from "./infrastructure/models/Node";
import { Link } from "./infrastructure/models/Link";
import { PropertyType } from "./infrastructure/models/PropertyType";
import {
  NodeProperties,
  useForceUpdate
} from "./components/nodeProperties/NodeProperties";
import { GenerationHandler } from "./handlers/GenerationHandler";
import { RelationPopup } from "./components/popups/RealtionPopup/RelationPopup";
import { LoadFileHandler } from "./handlers/LoadFileHandler";
import { SaveToFilePopup } from "./components/popups/SaveToFilePopup/SaveToFilePopup";
import { CSSProperties } from "react";
import { SaveToJpegPopup } from "./components/popups/SaveToJpegPopup/SaveToJpegPopup";
import _ from "lodash";
import { Label } from "./infrastructure/models/Label";

require("storm-react-diagrams/dist/style.min.css");
require("react-bootstrap-table-next/dist/react-bootstrap-table2.min.css");

interface Props {
  app: Application;
}

export const AppView = (props: Props) => {
  const jpegFileTarget: React.RefObject<any> = null;

  const [showDialog, setShowDialog] = React.useState(false);
  const [showRelationDialog, setShowRelationDialog] = React.useState(false);
  const [showLoadFileDialog, setShowLoadFileDialog] = React.useState(false);
  const [showSaveFileDialog, setSaveFileDialog] = React.useState(false);
  const [showSaveJPEGDialog, setSaveJPEGDialog] = React.useState(false);
  const [showSaveOptions, setSaveOptions] = React.useState(false);

  const [selectedNode, setSelectedNode] = React.useState(null);
  const [selectedLink, setSelectedLink] = React.useState(null);

  const [isUml, setIsUml] = React.useState(true);


  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    setSelectedNode(null);
    setSelectedLink(null);
  }, []);

  const changeRelation = () => {
    let links = props.app.getDiagramEngine().getDiagramModel().getLinks();
    Object.keys(links).map(id => {
      let temp = (links[id].labels[0] as Label).label.substring(0,1);
      let temp2 = (links[id].labels[2] as Label).label.substring(0,1);

      (links[id].labels[0] as Label).label = temp2 + (links[id].labels[0] as Label).label.substring(1);
      (links[id].labels[2] as Label).label = temp + (links[id].labels[2] as Label).label.substring(1);
    });
  }

  const refreshPopups = () => {
    setSelectedLink(null);
    setSelectedNode(null);

    setShowDialog(false);
    setSaveFileDialog(false);
    setSaveJPEGDialog(false);
    setSaveOptions(false);
    setShowLoadFileDialog(false);
    setShowRelationDialog(false);


    let links = props.app.getDiagramEngine().getDiagramModel().getLinks();

    Object.keys(links).map(id => {
      links[id].targetPort == null && props.app.getDiagramEngine().getDiagramModel().removeLink(id);
    });

  };

  const containerStyles: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    borderColor: "rgb(255,123,0)"
  };
  const itemStyles: CSSProperties = {
    display: "inline-block",
    paddingTop: 3,
    paddingRight: 5
  };

  return (
    <div className="body">
      <div className="header">
        <div className="title">DB Diagram Scripter</div>
      </div>
      <div className="content" ref={jpegFileTarget}>
        <TrayWidget>
          <TrayItemWidget
            model={{ type: "table" }}
            name="Entity"
            color="rgb(0,192,255)"
          />
          <TrayItemWidget
            model={{ type: "label" }}
            name="Label"
            color="rgb(192,255,0)"
          />

          <div
            style={{ borderColor: "rgb(255,123,0)", marginTop: "100px" }}
            className="tray-item"
            onClick={() => {
              setShowLoadFileDialog(true);
              setSelectedNode(null);
            }}
          >
            Load Diagram
          </div>
          <div
            style={containerStyles}
            className="tray-item"
            onClick={() => {
              setSaveOptions(!showSaveOptions);
              setSelectedNode(null);
            }}
          >
            Save
            <span
              style={itemStyles}
              className={`mi ${
                !showSaveOptions ? "mi-ArrowDown8" : "mi-ArrowUp8"
                }`}
            />
          </div>
          {showSaveOptions && (
            <div
              style={{ borderColor: "rgb(255,123,0)" }}
              className="tray-item"
              onClick={() => {
                setSaveFileDialog(true);
                setSelectedNode(null);
              }}
            >
              File
            </div>
          )}
          {showSaveOptions && (
            <div
              style={{ borderColor: "rgb(255,123,0)" }}
              className="tray-item"
              onClick={() => {
                setSaveJPEGDialog(true);
                setSelectedNode(null);
              }}
            >
              JPEG
            </div>
          )}
          <div
            style={{ borderColor: "rgb(152,50,100)", marginTop: "100px" }}
            className={`tray-item ${isUml ? 'selected' : ''}`}
            onClick={() => {
              if(!isUml) {
                changeRelation();
                setIsUml(true);
              }
            }}
          >
            UML
          </div>
          <div
            style={{ borderColor: "rgb(152,50,100)" }}
            className={`tray-item ${!isUml ? 'selected' : ''}`}
            onClick={() => {
              if(isUml) {
                changeRelation();
                setIsUml(false);
              }
            }}
          >
            Chen
          </div>
          <div
            style={{ borderColor: "rgb(255,0,0)", marginTop: "100px" }}
            className="tray-item"
            onClick={() => {
              setShowDialog(true);
              setSelectedNode(null);
            }}
          >
            Create DB Code
          </div>
        </TrayWidget>

        <div
          id="diagram-layer"
          className="diagram-layer"
          onDrop={event => {
            event.preventDefault();
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );
            var nodesCount = _.keys(
              props.app
                .getDiagramEngine()
                .getDiagramModel()
                .getNodes()
            ).length;

            var node = null;
            if (data.type === "table") {
              node = new Node(
                false,
                `Entity${nodesCount + 1}`,
                "rgb(0,192,255)"
              );
              node.addInPort(
                false,
                "Id",
                true,
                false,
                true,
                true,
                true,
                PropertyType.INT
              );
              node.addInPort(
                true,
                "",
                false,
                false,
                false,
                false,
                false,
                PropertyType.INT
              );
              node.addInPort(
                true,
                "1",
                false,
                false,
                false,
                false,
                false,
                PropertyType.INT
              );

              node.addListener({});
            } else {
              node = new Node(
                true,
                "Label ",
                "rgb(192,255,0)"
              );
            }

            var points = props.app
              .getDiagramEngine()
              .getRelativeMousePoint(event);
            node.x = points.x;
            node.y = points.y;
            props.app
              .getDiagramEngine()
              .getDiagramModel()
              .addNode(node);

            forceUpdate();
          }}
          onDragOver={event => {
            event.preventDefault();
          }}
          onClick={event => {
            event.preventDefault();
            if (event.ctrlKey && props.app
              .getDiagramEngine()
              .getDiagramModel()
              .getSelectedItems()[0] instanceof PointModel) {
              const pointToRemove = props.app
                .getDiagramEngine()
                .getDiagramModel()
                .getSelectedItems()[0] as PointModel;
              const pointLink = props.app
                .getDiagramEngine()
                .getDiagramModel()
                .getSelectedItems()[0].parent as Link;
                
                pointLink && props.app.getDiagramEngine().getDiagramModel().links[pointLink.id].removePoint(pointToRemove);
            }
            refreshPopups();
          }}
          onDoubleClick={event => {
            event.preventDefault();
            if (
              props.app
                .getDiagramEngine()
                .getDiagramModel()
                .getSelectedItems()[0] instanceof PointModel
            ) {
              console.log('zmiana linku');
              setSelectedLink(
                props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getSelectedItems()[0].parent as Link
              );
              setShowRelationDialog(true);
              setSelectedNode(null);
            } else if (
              props.app
                .getDiagramEngine()
                .getDiagramModel()
                .getSelectedItems()[0] instanceof Node
            ) {
              refreshPopups();
              setSelectedNode(
                props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getSelectedItems()[0] as Node
              );
            }
          }}
        >
          <DiagramWidget
            allowLooseLinks={true}
            deleteKeys={[46]}
            className="srd-demo-canvas"
            diagramEngine={props.app.getDiagramEngine()}
          />
        </div>
        {selectedNode != null ? (
          <NodeProperties
            selectedItem={selectedNode}
            diagramEngine={props.app.getDiagramEngine()}
          />
        ) : null}
        <GenerationHandler
          isUml={isUml}
          update={refreshPopups}
          isOpen={showDialog}
          serializeDiagram={props.app.getDiagramEngine().diagramModel.serializeDiagram()}

        />
        <LoadFileHandler
          update={refreshPopups}
          isOpen={showLoadFileDialog}
          app={props.app}
          setIsUml={setIsUml}
        />
        <SaveToFilePopup
          update={refreshPopups}
          diagramModel={props.app.getDiagramEngine().diagramModel}
          isOpen={showSaveFileDialog}
          isUml={isUml}
        />
        <SaveToJpegPopup
          update={refreshPopups}
          diagramModel={props.app.getActiveDiagram()}
          isOpen={showSaveJPEGDialog}
        />

        <RelationPopup
          diagramModel={props.app.getActiveDiagram()}
          diagramEngine={props.app.getDiagramEngine()}

          update={refreshPopups}
          isOpen={showRelationDialog}
          link={selectedLink}
        />
      </div>
    </div>
  );
};
