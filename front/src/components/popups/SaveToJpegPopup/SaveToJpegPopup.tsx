import "./SaveToJpegPopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import domtoimage from "dom-to-image";
import { DiagramModel } from "@projectstorm/react-diagrams";

class Props {
  isOpen: boolean;
  diagramModel: DiagramModel;
  update: () => void;
}

export const SaveToJpegPopup = (props: Props) => {
  const [fileName, setFileName] = useState("diagram");

  const download = () => {
    domtoimage
      .toJpeg(document.getElementById("diagram-layer"), { quality: 0.95 })
      .then((dataUrl: any) => {
        let link = document.createElement("a");
        link.download = `${fileName}.jpeg`;
        link.href = dataUrl;
        link.click();
        props.update();
      });
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
