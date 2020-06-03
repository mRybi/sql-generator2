import { LoadFilePopup } from "../components/popups/LoadFilePopup/LoadFilePopup";
import React from "react";
import { Application } from "../components/dragAndDrop/Application";
import { DiagramModel } from "storm-react-diagrams";

class Props {
  isOpen: boolean;
  app: Application;
  update: () => void;
  setIsUml: (isUml: boolean) => void;
}

export const LoadFileHandler = (props: Props) => {
  const loadDiagram = (name: string) => {
    let engine = props.app.getDiagramEngine();
    let obj: {diagram: any, isUml: boolean} = JSON.parse(name);
    
    props.setIsUml(obj.isUml);

    let model2 = new DiagramModel();
    model2.deSerializeDiagram(obj.diagram, engine);
    let newLinks: any[] = Object.keys(model2.links).map(x => {
      return model2.links[x];
    });

    newLinks.forEach(link => {
      link.labels.splice(0, 3);
    });
    engine.setDiagramModel(model2);
    engine.repaintCanvas();
    console.log(engine.diagramModel.serializeDiagram());
    props.update();
  };

  return (
    <LoadFilePopup
      update={props.update}
      loadDiagram={name => loadDiagram(name)}
      isOpen={props.isOpen}
    />
  );
};
