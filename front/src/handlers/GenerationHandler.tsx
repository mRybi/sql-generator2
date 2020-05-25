import { ResultPopup } from "../components/popups/ResultPopup/ResultPopup";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "../infrastructure/models/Link";

class Props {
  isOpen: boolean;
  serializeDiagram: any;
  update: () => void;
}

export const GenerationHandler = (props: Props) => {
  const [sqlString, setSqlString] = useState("");

  useEffect(() => setSqlString(''), [props.isOpen]);

  const generateScript = async (name: string, isUml: boolean) => {
    console.log(props.serializeDiagram, isUml)
    let serDiagram = props.serializeDiagram;
    let diagram = JSON.stringify(serDiagram, null, 2);
    let response = await axios.post("http://localhost:5000/api/setjob", {
      SerializedModel: diagram,
      DatabaseName: name,
      RelationType: isUml ? 'UML' : 'CHEN'
    });

    if (response.status === 200) {
      setSqlString(response.data);
    } else {
      setSqlString('There was an error while processing your request');
      console.log("there was an error while processing your request");
    }
  };

  return (
    <ResultPopup
      update={props.update}
      mssqlString={sqlString}
      generateScript={(name, isUml) => generateScript(name, isUml)}
      isOpen={props.isOpen}
    />
  );
};
