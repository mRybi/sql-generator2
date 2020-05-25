import "./ResultPopup.scss";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import sqlFormatter from "sql-formatter";
import FileSaver from "file-saver";

class Props {
  isOpen: boolean;
  generateScript?: (name: string, isUml: boolean) => void;
  mssqlString?: string;
  update: () => void;
}

export const ResultPopup = (props: Props) => {
  const [dbName, setDbName] = useState("DatabaseName");
  const [uml, setUml] = useState(true);
  const [chen, setChen] = useState(false);

  let formatedSQL =
    props.mssqlString &&
    sqlFormatter.format(props.mssqlString, {
      language: "sql", // Defaults to "sql"
      indent: "  " // Defaults to two spaces
    });

  useEffect(() => {
    formatedSQL = '';
  }, [props.mssqlString])



  const downloadMSSQL = () => {
    console.log(chen, uml)
    var blob = new Blob([formatedSQL], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${dbName}.sql`);
    props.update();
  };

  return (
    <Popup modal closeOnDocumentClick open={props.isOpen} closeOnEscape>
      <div className="sql-result-dialog">
        <input
          style={{ marginRight: "10px" }}
          type="text"
          onChange={event => setDbName(event.target.value)}
          value={dbName}
        />
        <div style={{ display: 'inline' }}>
          <label htmlFor="uml">UML</label>

          <input
            style={{ marginRight: "10px" }}
            type="checkbox"
            id="uml"
            onChange={event => { 
              setUml(event.target.checked); 
              setChen(!event.target.checked); 
            }}
            checked={uml}
          />
        </div>
        <div style={{ display: 'inline' }}>
          <label htmlFor="chen">CHEN</label>

          <input
            style={{ marginRight: "10px" }}
            type="checkbox"
            id="chen"
            onChange={event => { 
              setChen(event.target.checked); 
              setUml(!event.target.checked) 
            }}
            checked={chen}
          />
        </div>

        <button
          onClick={() => {
            props.generateScript(dbName, uml ? true : false)
          }}>
          Generate
            </button>
        <textarea
          style={{ marginTop: "5px" }}
          readOnly={true}
          value={formatedSQL}
          contentEditable={false}
        ></textarea>
        <button style={{ marginRight: "10px" }} onClick={downloadMSSQL}>
          Download MSSQL
        </button>
        <button style={{ marginRight: "10px" }} onClick={downloadMSSQL}>
          Download mySQL
        </button>
      </div>
    </Popup>
  );
};
