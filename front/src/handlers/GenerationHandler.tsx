import { ResultPopup } from '../components/popups/ResultPopup/ResultPopup';
import React from 'react'
import axios from 'axios';

class Props {
  isOpen: boolean;
  serializeDiagram: any;
}

class State {
  sqlString: string;
}

export class GenerationHandler extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { sqlString: '' }
  }
  
  generateScript = (name: string) => {
    let diagram = JSON.stringify(this.props.serializeDiagram, null, 2);
    axios.post('http://localhost:5000/api/setjob', { SerializedDiagram: diagram, DatabaseName: name })
      .then((response) => {
        this.setState({ sqlString: response.data });
        this.forceUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <ResultPopup sqlString={this.state.sqlString} generateScript={(name) => this.generateScript(name)} isOpen={this.props.isOpen} />
    )
  }
}
