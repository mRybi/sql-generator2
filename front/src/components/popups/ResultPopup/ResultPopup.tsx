import './ResultPopup.scss';
import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import sqlFormatter from "sql-formatter";

class Props {
  isOpen: boolean;
  generateScript?: (name: string) => void;
  sqlString?: string;
}

export const ResultPopup = (props: Props) => {
  const [dbName, setDbName] = useState(
    'DatabaseName'
  );

  const formatedSQL = props.sqlString && sqlFormatter.format(props.sqlString, {
    language: "sql", // Defaults to "sql"
    indent: "    "   // Defaults to two spaces
  });
  
  return (
    <Popup
      modal
      closeOnDocumentClick
      open={props.isOpen}
      closeOnEscape
    >
      <div className="sql-result-dialog">
      <input type="text" onChange={event => setDbName(event.target.value)} value={dbName}/>
      <button onClick={ () => props.generateScript(dbName)}>Generate</button>
        <textarea readOnly={true} value={formatedSQL}></textarea>
      </div>
    </Popup>)
}