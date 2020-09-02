import "./SaveToFilePopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import FileSaver from "file-saver";
import { DiagramModel } from "@projectstorm/react-diagrams";

import * as _ from 'lodash';

class Props {
  isUml: boolean;
  secondModel: DiagramModel;
  isOpen: boolean;
  diagramModel: DiagramModel;
  update: () => void;
}

export const SaveToFilePopup = (props: Props) => {
  const [fileName, setFileName] = useState("diagram");

  const download = () => {
    const diagramJson = JSON.stringify({
      conceptualDiagram: props.diagramModel.serialize(),
      logicalDiagram: _.isEmpty(props.secondModel.getActiveNodeLayer().getNodes()) ? null : props.secondModel.serialize(),

      isUml: props.isUml,
    });

    console.log('do zapisu', props.secondModel, props.secondModel.getActiveNodeLayer().getNodes() );

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
          onChange={(event) => setFileName(event.target.value)}
          value={fileName}
        />
        <button onClick={download}>save</button>
      </div>
    </Popup>
  );
};
