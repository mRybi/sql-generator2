import { LoadFilePopup } from "../components/popups/LoadFilePopup/LoadFilePopup";
import React from "react";
import { Application } from "../components/dragAndDrop/Application";
import { DiagramModel } from "storm-react-diagrams";

class Props {
  isOpen: boolean;
  app: Application;
  update: () => void;
  setIsUml: (isUml: boolean) => void;
  setIsLogic: (isLogic: boolean) => void;
}

export const LoadFileHandler = (props: Props) => {
  const loadDiagram = (name: string) => {
    let engine = props.app.getDiagramEngine();
    try {
      let obj: {diagram: any, isUml: boolean, isLogic: boolean} = JSON.parse(name);
    
      props.setIsUml(obj.isUml);
      obj.isLogic ? props.setIsLogic(obj.isLogic) : props.setIsLogic(false);

  
      let model2 = new DiagramModel();
      model2.deSerializeDiagram(obj.diagram, engine);
      let newLinks: any[] = Object.keys(model2.links).map(x => {
        return model2.links[x];
      });
  
      newLinks.forEach(link => {
        link.labels.splice(0, 3);
      });

      if(obj.isLogic) {
        props.app.loadLogicModel(model2);
      } else {
        props.app.loadConceptualModel(model2);
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
      loadDiagram={name => loadDiagram(name)}
      isOpen={props.isOpen}
    />
  );
};
