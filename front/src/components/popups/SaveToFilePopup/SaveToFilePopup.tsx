import './SaveToFilePopup.scss';
import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import { DiagramModel } from 'storm-react-diagrams';
import FileSaver from 'file-saver';

class Props {
  isOpen: boolean;
  diagramModel: DiagramModel;
  update: () => void;
}

export const SaveToFilePopup = (props: Props) => {
  const [fileName, setFileName] = useState(
    'diagram'
  );

  const download = () => {
    const diagramJson = JSON.stringify(props.diagramModel.serializeDiagram());
    var blob = new Blob([diagramJson], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, `${fileName}.dbjson`);
    props.update();
  }
  
  return (
    <Popup
      modal
      closeOnDocumentClick
      open={props.isOpen}
      closeOnEscape
      onClose={() => props.update()}
    >
      <div className="sql-result-dialog">
        <input type="text" onChange={event => setFileName(event.target.value)} value={fileName}/>
        <button onClick={ () => download()}>save</button>
      </div>
    </Popup>)
}