import "./LoadFilePopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";

class Props {
  isOpen: boolean;
  loadDiagram?: (name: string) => void;
  update: () => void;
}

export const LoadFilePopup = (props: Props) => {
  let fileReader: FileReader;

  const [fileContent, setFileContent] = useState("");

  const handleFileRead = (e: any) => {
    const content = fileReader.result;
    setFileContent(content as string);
  };

  const handleFileChosen = (name: any) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(name);
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
          type="file"
          onChange={event => handleFileChosen(event.target.files[0])}
          accept=".dbjson"
        />
        <button onClick={() => props.loadDiagram(fileContent)}>Load</button>
      </div>
    </Popup>
  );
};
