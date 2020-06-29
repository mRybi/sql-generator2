import { ResultPopup } from "../components/popups/ResultPopup/ResultPopup";
import React, { useState, useEffect } from "react";
import axios from "axios";

class Props {
  isUml: boolean;
  isLogic: boolean;
  isOpen: boolean;
  serializeDiagram: () => any;
  update: () => void;
}

export const GenerationHandler = (props: Props) => {
  const [sqlString, setSqlString] = useState("");
  const [mysqlString, setMySqlString] = useState("");

  useEffect(() => setSqlString(""), [props.isOpen]);

  const generateScript = async (name: string) => {
    const serDiagram = props.serializeDiagram();
    const dNodes = serDiagram["layers"][1]["models"];

    const nodes = Object.keys(dNodes).map((id) => {
      return dNodes[id];
    });

    const dLinks = serDiagram["layers"][0]["models"];
    const links = Object.keys(dLinks).map((id) => {
      return dLinks[id];
    });

    const diagramJson = {
      nodes,
      links,
    };
    const diagram = JSON.stringify(diagramJson, null, 2);

    const response = await axios.post(
      "https://sql-generator.pl/api/setjob/mssql",
      {
        SerializedModel: diagram,
        DatabaseName: name,
        RelationType: props.isUml ? "UML" : "CHEN"
      }
    );

    const responseMy = await axios.post(
      "https://sql-generator.pl/api/setjob/mysql",
      {
        SerializedModel: diagram,
        DatabaseName: name,
        RelationType: props.isUml ? "UML" : "CHEN"
      }
    );

    if (response.status === 200 && responseMy.status === 200) {
      setSqlString(response.data);
      setMySqlString(responseMy.data);
    } else {
      const errorMessage = 'There was an error while processing your request';
      setSqlString(errorMessage);
      setMySqlString(errorMessage);

      console.log(errorMessage);
    }
  };

  return (
    <ResultPopup
      update={props.update}
      mssqlString={sqlString}
      mysqlString={mysqlString}
      generateScript={(name) => generateScript(name)}
      isOpen={props.isOpen}
    />
  );
};
