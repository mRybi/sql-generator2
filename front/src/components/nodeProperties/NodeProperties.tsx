import './NodeProperties.scss';
import * as React from "react";
import { DiagramEngine } from 'storm-react-diagrams';
import { Link } from '../../infrastructure/models/Link';
import { Port } from '../../infrastructure/models/Port';
import { Node } from '../../infrastructure/models/Node';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { PropertyType } from '../../infrastructure/models/PropertyType';
import { Col, Row, Grid } from '../grid';
import AppContext from '../../context/appContext/AppContext';

class OwnProps {
  selectedItem: Node;
  diagramEngine: DiagramEngine;
  selectedLink: Link;
}

class State {
  updatedItem: Node
  name: string;
  portLabel: string;
  showInput: boolean;
}

type Props = OwnProps;

export class NodeProperties extends React.Component<Props, State> {
  static contextType = AppContext;

  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      updatedItem: this.props.selectedItem,
      name: this.props.selectedItem.name,
      portLabel: "",
      showInput: false
    })
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps != this.props) {
      this.forceUpdate();
      this.setState({
        updatedItem: nextProps.selectedItem,
        name: nextProps.selectedItem.name
      })
      this.forceUpdate();
    }
  }

  handleChangePK(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();

    (this.state.updatedItem.getPortFromID(row.id) as Port).isPrimaryKey = !row.isPrimaryKey;

    this.forceUpdate();
  }

  handleChangeFK(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();

    (this.state.updatedItem.getPortFromID(row.id) as Port).isForeignKey = !row.isForeignKey;

    this.forceUpdate();
  }

  handleChangeNull(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();

    (this.state.updatedItem.getPortFromID(row.id) as Port).isNotNull = !row.isNotNull;

    this.forceUpdate();
  }

  handleChangeUnique(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();

    (this.state.updatedItem.getPortFromID(row.id) as Port).isUnique = !row.isUnique;

    this.forceUpdate();
  }

  handleChangeAutoInc(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();

    (this.state.updatedItem.getPortFromID(row.id) as Port).isAutoincremented = !row.isAutoincremented;

    this.forceUpdate();
  }

  handleChangepRropType(event: React.ChangeEvent<HTMLSelectElement>, row: Port) {
    event.persist();
    (this.state.updatedItem.getPortFromID(row.id) as Port).propertyType = event.target.value as PropertyType;

    this.forceUpdate();
  }

  handleChangePortLabel(event: React.ChangeEvent<HTMLInputElement>, row: Port) {
    event.persist();
    (this.state.updatedItem.getPortFromID(row.id) as Port).label = event.target.value;
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist();

    this.state.updatedItem.name = event.target.value;

    this.forceUpdate();
  }

  render() {
    console.log('state', this.state);
    let columns: any[] = [];
    if (this.context.view !== 0) {
      columns = [{
        dataField: 'label',
        text: 'Property Name',
        formatter: (cellContent: any, row: Port) => (
          <div className="input">
            <input className="darkInput" type="text" defaultValue={row.label} onChange={(event) => this.handleChangePortLabel(event, row)}></input>
          </div>
        )
      }, {
        style: {paddingLeft: 0},
        dataField: 'propertyType',
        text: 'Property Type',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <select className="darkSelect" onChange={(event) => this.handleChangepRropType(event, row)} value={PropertyType[row.propertyType]}>
                <option value="BIT">BIT</option>
                <option value="TINYINT">TINYINT</option>
                <option value="SMALLINT">SMALLINT</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="NUMERIC">NUMERIC</option>
                <option value="FLOAT">FLOAT</option>
                <option value="REAL">REAL</option>
  
                <option value="DATE">DATE</option>
                <option value="TIME">TIME</option>
                <option value="DATETIME">DATETIME</option>
                <option value="TIMESTAMP">TIMESTAMP</option>
                <option value="YEAR">YEAR</option>
  
                <option value="CHAR">CHAR</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="VARCHARMAX">VARCHARMAX</option>
                <option value="TEXT">TEXT</option>
  
                <option value="NCHAR">NCHAR</option>
                <option value="NVARCHAR">NVARCHAR</option>
                <option value="NVARCHARMAX">NVARCHARMAX</option>
                <option value="NTEXT">NTEXT</option>
                <option value="BINARY">BINARY</option>
                <option value="VARBINARY">VARBINARY</option>
                <option value="VARBINARYMAX">VARBINARYMAX</option>
                <option value="IMAGE">IMAGE</option>
                <option value="CLOB">CLOB</option>
                <option value="BLOB">BLOB</option>
                <option value="XML">XML</option>
                <option value="JSON">JSON</option>
  
              </select>
            </label>
          </div>
        )
      }, {
        dataField: 'isPrimaryKey',
        text: 'Is Primary Key',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isPrimaryKey} onChange={(event) => this.handleChangePK(event, row)} />
            </label>
          </div>
        )
      }
      ,
       {
        dataField: 'isForeignKey',
        text: 'Is Foreign Key',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isForeignKey} onChange={(event) => this.handleChangeFK(event, row)} />
            </label>
          </div>
        )
      }
      , 
      {
        dataField: 'isNotNull',
        text: 'Is Nullable',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isNotNull} onChange={(event) => this.handleChangeNull(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'isAutoincremented',
        text: 'Is Auto Incremented',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isAutoincremented} onChange={(event) => this.handleChangeAutoInc(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'isUnique',
        text: 'Is Unique',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isUnique} onChange={(event) => this.handleChangeUnique(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'remove',
        text: 'Remove',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <span onClick={() => this.removePort(row)} className="mi mi-Delete red" />          
            </label>
          </div>
        )
      }];
    } else {
      columns = [{
        dataField: 'label',
        text: 'Property Name',
        formatter: (cellContent: any, row: Port) => (
          <div className="input">
            <input className="darkInput" type="text" defaultValue={row.label} onChange={(event) => this.handleChangePortLabel(event, row)}></input>
          </div>
        )
      }, {
        style: {paddingLeft: 0},
        dataField: 'propertyType',
        text: 'Property Type',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <select className="darkSelect" onChange={(event) => this.handleChangepRropType(event, row)} value={PropertyType[row.propertyType]}>
                <option value="BIT">BIT</option>
                <option value="TINYINT">TINYINT</option>
                <option value="SMALLINT">SMALLINT</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="NUMERIC">NUMERIC</option>
                <option value="FLOAT">FLOAT</option>
                <option value="REAL">REAL</option>
  
                <option value="DATE">DATE</option>
                <option value="TIME">TIME</option>
                <option value="DATETIME">DATETIME</option>
                <option value="TIMESTAMP">TIMESTAMP</option>
                <option value="YEAR">YEAR</option>
  
                <option value="CHAR">CHAR</option>
                <option value="VARCHAR">VARCHAR</option>
                <option value="VARCHARMAX">VARCHARMAX</option>
                <option value="TEXT">TEXT</option>
  
                <option value="NCHAR">NCHAR</option>
                <option value="NVARCHAR">NVARCHAR</option>
                <option value="NVARCHARMAX">NVARCHARMAX</option>
                <option value="NTEXT">NTEXT</option>
                <option value="BINARY">BINARY</option>
                <option value="VARBINARY">VARBINARY</option>
                <option value="VARBINARYMAX">VARBINARYMAX</option>
                <option value="IMAGE">IMAGE</option>
                <option value="CLOB">CLOB</option>
                <option value="BLOB">BLOB</option>
                <option value="XML">XML</option>
                <option value="JSON">JSON</option>
  
              </select>
            </label>
          </div>
        )
      }, {
        dataField: 'isPrimaryKey',
        text: 'Is Primary Key',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isPrimaryKey} onChange={(event) => this.handleChangePK(event, row)} />
            </label>
          </div>
        )
      }
      , 
      {
        dataField: 'isNotNull',
        text: 'Is Nullable',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isNotNull} onChange={(event) => this.handleChangeNull(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'isAutoincremented',
        text: 'Is Auto Incremented',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isAutoincremented} onChange={(event) => this.handleChangeAutoInc(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'isUnique',
        text: 'Is Unique',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={row.isUnique} onChange={(event) => this.handleChangeUnique(event, row)} />
            </label>
          </div>
        )
      }, {
        dataField: 'remove',
        text: 'Remove',
        formatter: (cellContent: any, row: Port) => (
          <div className="checkbox">
            <label>
              <span onClick={() => this.removePort(row)} className="mi mi-Delete red" />          
            </label>
          </div>
        )
      }];
    }
    

    let ports = this.state.updatedItem.ports && this.state.updatedItem.ports as { [s: string]: Port };
    let portsTable: Port[] = Object.keys(ports).map(x => {
      return ports[x];
    });
    
    portsTable = this.context.view === 0 ? portsTable.filter( p => !p.isForeignKey) : portsTable; // for entity view enable FK in rel view
    // let newPorts: Port[] = [];
    // newPorts.push(new Port(true, 'newProp1',false, false, false, false, false, ));

    return (
      <div className="trayBottom">
      <Grid>
        <Row>
          <Col>
            {!this.state.showInput ? <h1 onDoubleClick={() => this.setState({showInput: true})}>{this.state.name}</h1> : <input className="darkInput fs-24" defaultValue={this.state.name} onChange={(event) => this.handleNameChange(event)}/>}
          </Col>
{!this.state.updatedItem.isLabel ? 
           <Col className="tableFixHead">
            <BootstrapTable
              keyField="id"
              data={portsTable}
              columns={columns}
              bordered={false}
            />
            <p className="mouse-cursor" onClick={() => this.addNewPort(portsTable.length)}>Add new prop</p>
          </Col> : null }
        </Row>
      </Grid>
        
      </div>
    )
  }

  addNewPort(newPortNumber: number) {
    this.state.updatedItem.addInPort(`new port ${newPortNumber}`, false, false, false, false, false, PropertyType.INT)
    this.forceUpdate();
  }

  removePort(port: Port) {
    if(Object.entries(port.links).length !== 0 && port.links.constructor === Object) {
      let portLinks: Link[] = Object.keys(port.links).map(x => {
        return port.links[x];
      });
      portLinks.forEach(p => this.props.diagramEngine.getDiagramModel().removeLink(p));
    }
    this.state.updatedItem.removePort(port);
    this.forceUpdate();
  }
}