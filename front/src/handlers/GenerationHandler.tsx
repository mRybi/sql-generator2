import { ResultPopup } from '../components/popups/ResultPopup/ResultPopup';
import React from 'react'
import axios from 'axios';
import FileSaver from 'file-saver';

class Props {
  isOpen: boolean;
  serializeDiagram: any;
  update: () => void;
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
    console.log('QQQQQjson', diagram)
    axios.post('http://localhost:5000/api/setjob', { SerializedModel: diagram, DatabaseName: name })
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
      <ResultPopup update={this.props.update} mssqlString={this.state.sqlString} mysqlString={this.state.sqlString} generateScript={(name) => this.generateScript(name)} isOpen={this.props.isOpen} />
    )
  }
}
