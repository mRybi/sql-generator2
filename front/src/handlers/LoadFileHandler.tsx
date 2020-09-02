import React from "react";
import { LoadFilePopup } from "../components/popups/LoadFilePopup/LoadFilePopup";
import { Application } from "../components/Application";
import { DiagramModel } from "@projectstorm/react-diagrams";

class Props {
  isOpen: boolean;
  app: Application;
  update: () => void;
  setIsUml: (isUml: boolean) => void;
  setIsLogic: (isLogic: boolean) => void;
}

export const LoadFileHandler = (props: Props) => {
  const loadDiagram = (name: string) => {
    const engine = props.app.getDiagramEngine();
    try {
      const obj: {
        conceptualDiagram: ReturnType<DiagramModel["serialize"]>;
        logicalDiagram: ReturnType<DiagramModel["serialize"]>;
        isUml: boolean;
      } = JSON.parse(name);
      console.log(obj);

      props.setIsUml(obj.isUml);

      let consceptual = new DiagramModel();
      let logic = new DiagramModel();

      if(obj.conceptualDiagram) {
        consceptual.deserializeModel(obj.conceptualDiagram, engine);
        
        consceptual.getLinks().forEach((link) => {
          link.getLabels().splice(0, 3);
        });

        props.app.loadConceptualModel(consceptual);
        props.setIsLogic(false);
      }

      // if(logic.getNodes().keys.length > 0) {
        if(obj.logicalDiagram) {
          logic.deserializeModel(obj.logicalDiagram, engine);
          
  
        logic.getLinks().forEach((link) => {
          link.getLabels().splice(0, 3);
        });

        props.app.loadLogicModel(logic);
        props.setIsLogic(true);
      }

      engine.repaintCanvas();
      props.update();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LoadFilePopup
      update={props.update}
      loadDiagram={(name) => loadDiagram(name)}
      isOpen={props.isOpen}
    />
  );
};
