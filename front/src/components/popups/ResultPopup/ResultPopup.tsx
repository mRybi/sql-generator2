import "./ResultPopup.scss";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import sqlFormatter from "sql-formatter";
import FileSaver from "file-saver";

class Props {
  isOpen: boolean;
  generateScript?: (name: string, isUml: boolean) => void;
  mssqlString: string;
  mysqlString: string;
  update: () => void;
}

export const ResultPopup = (props: Props) => {
  const [dbName, setDbName] = useState("DatabaseName");
  const [uml, setUml] = useState(true);
  const [chen, setChen] = useState(false);
  const [mySQLView, setmySQLView] = useState(false);


  let formatedMSSQL =
    props.mssqlString &&
    sqlFormatter.format(props.mssqlString, {
      language: "sql", // Defaults to "sql"
      indent: "  " // Defaults to two spaces
    });

  let formatedMySQL =
    props.mysqlString &&
    sqlFormatter.format(props.mysqlString, {
      language: "sql", // Defaults to "sql"
      indent: "  " // Defaults to two spaces
    });

  // useEffect(() => {
  //   formatedMSSQL = '';
  //   formatedMySQL = '';
  // }, [props.mssqlString, props.mysqlString])



  const downloadMSSQL = () => {
    var blob = new Blob([formatedMSSQL], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${dbName}.sql`);
    props.update();
  };

  const downloadMYSQL = () => {
    var blob = new Blob([formatedMySQL], { type: "text/plain;charset=utf-8" });
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
         style={{ marginRight: "10px" }}
          onClick={() => {
            props.generateScript(dbName, uml ? true : false)
          }}>
          Generate
            </button>

            <button
            className={`${mySQLView ? '' : 'selected-sql'}`}
          onClick={() => {
            setmySQLView(false)
          }}>
          MSSQL
            </button>

            <button
            className={`${mySQLView ? 'selected-sql' : ''}`}

          onClick={() => {
            setmySQLView(true)

          }}>
          MySQL
            </button>


        <textarea
          style={{ marginTop: "5px" }}
          readOnly={true}
          value={mySQLView ? formatedMySQL : formatedMSSQL}
          contentEditable={false}
        ></textarea>

        <button style={{ marginRight: "10px" }} onClick={downloadMSSQL}>
          Download MSSQL
        </button>
        <button style={{ marginRight: "10px" }} onClick={downloadMYSQL}>
          Download mySQL
        </button>
      </div>
    </Popup>
  );
};
