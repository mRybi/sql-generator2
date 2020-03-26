import "./ResultPopup.scss";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import sqlFormatter from "sql-formatter";
import FileSaver from "file-saver";

class Props {
  isOpen: boolean;
  generateScript?: (name: string) => void;
  mssqlString?: string;
  update: () => void;
}

export const ResultPopup = (props: Props) => {
  const [dbName, setDbName] = useState("DatabaseName");

  const formatedSQL =
    props.mssqlString &&
    sqlFormatter.format(props.mssqlString, {
      language: "sql", // Defaults to "sql"
      indent: "  " // Defaults to two spaces
    });

  const downloadMSSQL = () => {
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
        <button onClick={() => props.generateScript(dbName)}>Generate</button>
        <textarea
          style={{ marginTop: "5px" }}
          readOnly={true}
          value={formatedSQL}
          contentEditable={false}
        ></textarea>
        <button style={{ marginRight: "10px" }} onClick={downloadMSSQL}>
          Download MSSQL
        </button>
      </div>
    </Popup>
  );
};
