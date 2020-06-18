import "./SaveToFilePopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import FileSaver from "file-saver";
import { DiagramModel } from "@projectstorm/react-diagrams";

class Props {
  isUml: boolean;
  isLogic: boolean;

  isOpen: boolean;
  diagramModel: DiagramModel;
  update: () => void;
}

export const SaveToFilePopup = (props: Props) => {
  const [fileName, setFileName] = useState("diagram");

  const download = () => {
    const diagramJson = JSON.stringify({diagram: props.diagramModel.serialize(), isUml: props.isUml, isLogic: props.isLogic});

    let blob = new Blob([diagramJson], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${fileName}.dbjson`);
    props.update();
  };

  return (
    <Popup
      modal
      closeOnDocumentClick
      open={props.isOpen}
      closeOnEscape
      onClose={() => props.update()}
    >
      <div className="sql-result-dialog">
        <input
          type="text"
          onChange={event => setFileName(event.target.value)}
          value={fileName}
        />
        <button onClick={download}>save</button>
      </div>
    </Popup>
  );
};
