import { ResultPopup } from "../components/popups/ResultPopup/ResultPopup";
import React, { useState } from "react";
import axios from "axios";

class Props {
  isOpen: boolean;
  serializeDiagram: any;
  update: () => void;
}

export const GenerationHandler = (props: Props) => {
  const [sqlString, setSqlString] = useState("");

  const generateScript = async (name: string) => {
    console.log(props.serializeDiagram)
    let diagram = JSON.stringify(props.serializeDiagram, null, 2);
    let response = await axios.post("http://localhost:5000/api/setjob", {
      SerializedModel: diagram,
      DatabaseName: name
    });

    if (response.status === 200) {
      setSqlString(response.data);
    } else {
      console.log("there was an error while processing your request");
    }
  };

  return (
    <ResultPopup
      update={props.update}
      mssqlString={sqlString}
      generateScript={name => generateScript(name)}
      isOpen={props.isOpen}
    />
  );
};
