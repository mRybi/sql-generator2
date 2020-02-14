import { ResultPopup } from '../components/popups/ResultPopup/ResultPopup';
import React, { useState, useMemo } from 'react'
import axios from 'axios';

class Props {
  isOpen: boolean;
  serializeDiagram: any;
  update: () => void;
}

export const GenerationHandler = (props: Props) => {
  const [sqlString, setSqlString] = useState('');

  const generateScript = (name: string) => {
    let diagram = JSON.stringify(props.serializeDiagram, null, 2);
    axios.post('http://localhost:5000/api/setjob', { SerializedModel: diagram, DatabaseName: name })
      .then((response) => {
        setSqlString(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  };

  return (
    <ResultPopup update={props.update} mssqlString={sqlString} generateScript={(name) => generateScript(name)} isOpen={props.isOpen} />
  )
}
