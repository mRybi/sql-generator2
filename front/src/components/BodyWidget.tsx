import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { TrayItemWidget } from "./TrayItemWidget";
import { PointModel } from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import styled from "@emotion/styled";
import { DemoCanvasWidget } from "../helpers/DemoCanvasWidget";
import { Application } from "./Application";
import { AdvancedPortModel } from "../infrastructure/models/ArrowPortModel";
import { TrayItemDiv } from "./TrayItemDiv";
import {
  NodeProperties,
  useForceUpdate,
} from "./NodeProperties/NodeProperties";
import { DefaultLinkModel } from "../infrastructure/models/DefaultLinkModel";
import { GenerationHandler } from "../handlers/GenerationHandler";
import { LoadFileHandler } from "../handlers/LoadFileHandler";
import { SaveToFilePopup } from "./popups/SaveToFilePopup/SaveToFilePopup";
import { SaveToJpegPopup } from "./popups/SaveToJpegPopup/SaveToJpegPopup";
import { RelationPopup } from "./popups/RealtionPopup/RelationPopup";
import { DefaultPortModel } from "../infrastructure/models/DefaultPortModel";
import { DefaultLabelModel } from "../infrastructure/models/DefaultLabelModel";
import { DefaultNodeModel } from "../infrastructure/models/DefaultNodeModel";

export interface BodyWidgetProps {
  app: Application;
}
namespace S {
  export const Body = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  `;

  export const Header = styled.div`
    display: flex;
    background: rgb(30, 30, 30);
    flex-grow: 0;
    flex-shrink: 0;
    color: white;
    font-family: Helvetica, Arial, sans-serif;
    padding: 12px;
    align-items: center;
  `;

  export const Content = styled.div`
    display: flex;
    flex-grow: 1;
  `;

  export const Layer = styled.div`
    position: relative;
    flex-grow: 1;
  `;

  export const DropdownIcon = styled.span`
    display: inline-block;
    padding-top: 3px;
    padding-right: 5px;
  `;
}

export const BodyWidget = (props: BodyWidgetProps) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [showRelationDialog, setShowRelationDialog] = React.useState(false);
  const [showLoadFileDialog, setShowLoadFileDialog] = React.useState(false);
  const [showSaveFileDialog, setSaveFileDialog] = React.useState(false);
  const [showSaveJPEGDialog, setSaveJPEGDialog] = React.useState(false);
  const [showSaveOptions, setSaveOptions] = React.useState(false);

  const [selectedNode, setSelectedNode] = React.useState(null);
  const [selectedLink, setSelectedLink] = React.useState(null);

  const [isUml, setIsUml] = React.useState(true);

  const [isLogicModel, setIsLogicModel] = React.useState(false);

  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    setSelectedNode(null);
    setSelectedLink(null);
  }, []);

  const changeRelation = () => {
    let links = props.app.getDiagramEngine().getModel().getLinks();
    links.forEach((link) => {
      let temp = (link.getLabels()[0] as DefaultLabelModel)
        .getOptions()
        .label.substring(0, 1);
      let temp2 = (link.getLabels()[2] as DefaultLabelModel)
        .getOptions()
        .label.substring(0, 1);

      (link.getLabels()[0] as DefaultLabelModel).getOptions().label =
        temp2 +
        (link.getLabels()[0] as DefaultLabelModel)
          .getOptions()
          .label.substring(1);
      (link.getLabels()[2] as DefaultLabelModel).getOptions().label =
        temp +
        (link.getLabels()[2] as DefaultLabelModel)
          .getOptions()
          .label.substring(1);
    });
  };

  const refreshPopups = () => {
    setSelectedLink(null);
    setSelectedNode(null);

    setShowDialog(false);
    setSaveFileDialog(false);
    setSaveJPEGDialog(false);
    setSaveOptions(false);
    setShowLoadFileDialog(false);
    setShowRelationDialog(false);
  };

  return (
    <S.Body>
      <S.Header>DB Diagram Scripter</S.Header>
      <S.Content>
        <TrayWidget>
          <TrayItemWidget
            model={{ type: "default" }}
            name={isLogicModel ? "Relation" : "Entity"}
            color="rgb(0,192,255)"
          />
          <TrayItemWidget
            model={{ type: "label" }}
            name="Label"
            color="rgb(192,255,0)"
          />

          <TrayItemDiv
            name="Load Diagram"
            color="rgb(255,123,0)"
            marginTop="75px"
            onClick={() => {
              setShowLoadFileDialog(true);
              setSelectedNode(null);
            }}
          />

          <TrayItemDiv
            color="rgb(255,123,0)"
            onClick={() => {
              setSaveOptions(!showSaveOptions);
              setSelectedNode(null);
            }}
          >
            <>
              Save
              <S.DropdownIcon
                className={`mi ${
                  !showSaveOptions ? "mi-ArrowDown8" : "mi-ArrowUp8"
                }`}
              />
            </>
          </TrayItemDiv>

          {showSaveOptions && (
            <TrayItemDiv
              name="File"
              color="rgb(255,123,0)"
              onClick={() => {
                setSaveFileDialog(true);
                setSelectedNode(null);
              }}
            />
          )}
          {showSaveOptions && (
            <TrayItemDiv
              name="JPEG"
              color="rgb(255,123,0)"
              onClick={() => {
                setSaveJPEGDialog(true);
                setSelectedNode(null);
              }}
            />
          )}

          <TrayItemDiv
            isSelected={!isLogicModel}
            name="Conceptual View"
            color="rgb(0,50,100)"
            marginTop="75px"
            onClick={() => {
              if (isLogicModel) {
                props.app.setConceptualModel();
                setIsLogicModel(false);
              }
            }}
          />

          <TrayItemDiv
            isSelected={isLogicModel}
            name="Logical View"
            color="rgb(0,50,100)"
            onClick={() => {
              if (!isLogicModel) {
                props.app.setLogicModel();
                setIsLogicModel(true);
              }
            }}
          />

          <TrayItemDiv
            isDisabled={isLogicModel}
            isSelected={isUml}
            name="UML"
            color="rgb(152,50,100)"
            marginTop="75px"
            onClick={() => {
              if (!isLogicModel && !isUml) {
                changeRelation();
                setIsUml(true);
              }
            }}
          />

          <TrayItemDiv
            isDisabled={isLogicModel}
            isSelected={!isUml}
            name="Chen"
            color="rgb(152,50,100)"
            onClick={() => {
              if (!isLogicModel && isUml) {
                changeRelation();
                setIsUml(false);
              }
            }}
          />

          <TrayItemDiv
            name="Create DB Code"
            color="rgb(255,0,0)"
            marginTop="60px"
            onClick={() => {
              setShowDialog(true);
              setSelectedNode(null);
            }}
          />
        </TrayWidget>
        <S.Layer
          id="diagram-layer"
          onDrop={(event) => {
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );

            let allNodes = props.app
              .getDiagramEngine()
              .getModel()
              .getNodes() as DefaultNodeModel[];

            let names = allNodes.map((node) =>
              node.getOptions().name.toLowerCase().trim()
            );

            var nodesCount = _.keys(
              props.app.getDiagramEngine().getModel().getNodes()
            ).length;

            let newNodeName = names.includes(
              `Entity${nodesCount + 1}`.toLowerCase().trim()
            )
              ? `Entity${nodesCount + 1}_${nodesCount + 1}`
              : `Entity${nodesCount + 1}`;

            var node: DefaultNodeModel;
            if (data.type === "default") {
              node = new DefaultNodeModel(false, newNodeName, "rgb(0,192,255)");

              if (isLogicModel) {
                node.addPort(
                  new AdvancedPortModel(
                    "Id",
                    false,
                    true,
                    false,
                    false,
                    true,
                    true,
                    true,
                    "INT"
                  )
                );
                node.addPort(
                  new AdvancedPortModel(
                    "",
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    "INT"
                  )
                );
                node.addPort(
                  new AdvancedPortModel(
                    "1",
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    "INT"
                  )
                );
              } else {
                node.addPort(
                  new DefaultPortModel(
                    isLogicModel,
                    "Id",
                    false,
                    true,
                    false,
                    false,
                    true,
                    true,
                    true,
                    "INT"
                  )
                );
                node.addPort(
                  new DefaultPortModel(
                    isLogicModel,
                    "",
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    "INT"
                  )
                );
                node.addPort(
                  new DefaultPortModel(
                    isLogicModel,
                    "1",
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    "INT"
                  )
                );
              }
            } else {
              node = new DefaultNodeModel(true, "Label ", "rgb(192,255,0)");
            }

            var point = props.app
              .getDiagramEngine()
              .getRelativeMousePoint(event);
            node.setPosition(point);
            props.app.getDiagramEngine().getModel().addNode(node);

            forceUpdate();
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onClick={(event) => {
            event.preventDefault();
            if (
              event.ctrlKey &&
              props.app
                .getDiagramEngine()
                .getModel()
                .getSelectedEntities()[0] instanceof PointModel
            ) {
              const pointToRemove = props.app
                .getDiagramEngine()
                .getModel()
                .getSelectedEntities()[0] as PointModel;

              pointToRemove.remove();
            }
            refreshPopups();
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            if (
              props.app
                .getDiagramEngine()
                .getModel()
                .getSelectedEntities()[0] instanceof PointModel
            ) {
              setSelectedLink(
                props.app
                  .getDiagramEngine()
                  .getModel()
                  .getSelectedEntities()[0]
                  .getParent() as DefaultLinkModel
              );
              setShowRelationDialog(true);
              setSelectedNode(null);
            } else if (
              props.app
                .getDiagramEngine()
                .getModel()
                .getSelectedEntities()[0] instanceof DefaultNodeModel
            ) {
              refreshPopups();
              let selectedNode = props.app
                .getDiagramEngine()
                .getModel()
                .getSelectedEntities()[0] as DefaultNodeModel;

              setSelectedNode(selectedNode);
            }
          }}
        >
          <DemoCanvasWidget>
            <CanvasWidget
              className="srd-demo-canvas"
              engine={props.app.getDiagramEngine()}
            />
          </DemoCanvasWidget>
        </S.Layer>
        {selectedNode != null ? (
          <NodeProperties
            isLogic={isLogicModel}
            selectedItem={selectedNode}
            diagramEngine={props.app.getDiagramEngine()}
          />
        ) : null}
        <GenerationHandler
          isUml={isUml}
          isLogic={isLogicModel}
          update={refreshPopups}
          isOpen={showDialog}
          serializeDiagram={props.app.getDiagramEngine().getModel().serialize()}
        />
        <LoadFileHandler
          update={refreshPopups}
          isOpen={showLoadFileDialog}
          app={props.app}
          setIsUml={setIsUml}
          setIsLogic={setIsLogicModel}
        />
        <SaveToFilePopup
          isLogic={isLogicModel}
          update={refreshPopups}
          diagramModel={props.app.getDiagramEngine().getModel()}
          isOpen={showSaveFileDialog}
          isUml={isUml}
        />
        <SaveToJpegPopup
          update={refreshPopups}
          diagramModel={props.app.getActiveDiagram()}
          isOpen={showSaveJPEGDialog}
        />

        <RelationPopup
          diagramEngine={props.app.getDiagramEngine()}
          update={refreshPopups}
          isOpen={showRelationDialog}
          link={selectedLink}
          isLogic={isLogicModel}
        />
      </S.Content>
    </S.Body>
  );
};
