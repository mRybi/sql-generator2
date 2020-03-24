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

class OwnProps {
  selectedItem: Node;
  diagramEngine: DiagramEngine;
  selectedLink: Link;
}

type Props = OwnProps;

export function useForceUpdate(){
  const [value, setValue] = React.useState(0);
  return () => setValue(value => ++value);
}

export const NodeProperties = (props: Props) => {
  const [updatedItem, setUpdatedItem] = React.useState(null);
  const [name, setName] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  const forceUpdate = useForceUpdate();

  React.useMemo(() => {
    setUpdatedItem(props.selectedItem);
    setName(props.selectedItem.name);
  }, [props.selectedItem]);

  const handleChangePK = (event: React.ChangeEvent<HTMLInputElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isPrimaryKey = !row.isPrimaryKey;
    forceUpdate()
  }

  const handleChangeNull = (event: React.ChangeEvent<HTMLInputElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isNotNull = !row.isNotNull;
    forceUpdate()
  }

  const handleChangeUnique = (event: React.ChangeEvent<HTMLInputElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isUnique = !row.isUnique;
    forceUpdate()
  }

  const handleChangeAutoInc = (event: React.ChangeEvent<HTMLInputElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isAutoincremented = !row.isAutoincremented;
    forceUpdate()
  }

  const handleChangepRropType = (event: React.ChangeEvent<HTMLSelectElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).propertyType = event.target.value as PropertyType;
    forceUpdate()
  }

  const handleChangePortLabel = (event: React.ChangeEvent<HTMLInputElement>, row: Port) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).label = event.target.value;
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    updatedItem.name = event.target.value;
    forceUpdate()
  }


  const addNewPort = (newPortNumber: number) => {
    updatedItem.addInPort(`new port ${newPortNumber}`, false, false, false, false, false, PropertyType.INT)
    forceUpdate()
  }

  const removePort = (port: Port) => {
    if (Object.entries(port.links).length !== 0 && port.links.constructor === Object) {
      let portLinks: Link[] = Object.keys(port.links).map(x => {
        return port.links[x];
      });
      portLinks.forEach(p => props.diagramEngine.getDiagramModel().removeLink(p));
    }
    updatedItem.removePort(port);
    forceUpdate()
  }

  const columns: any[] = [{
    dataField: 'label',
    text: 'Property Name',
    formatter: (cellContent: any, row: Port) => (
      <div className="input">
        <input className="darkInput" type="text" defaultValue={row.label} onChange={(event) => handleChangePortLabel(event, row)}></input>
      </div>
    )
  }, {
    style: { paddingLeft: 0 },
    dataField: 'propertyType',
    text: 'Property Type',
    formatter: (cellContent: any, row: Port) => (
      <div className="checkbox">
        <label>
          <select className="darkSelect" onChange={(event) => handleChangepRropType(event, row)} value={PropertyType[row.propertyType]}>
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
          <input type="checkbox" checked={row.isPrimaryKey} onChange={(event) => handleChangePK(event, row)} />
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
          <input type="checkbox" checked={row.isNotNull} onChange={(event) => handleChangeNull(event, row)} />
        </label>
      </div>
    )
  }, {
    dataField: 'isAutoincremented',
    text: 'Is Auto Incremented',
    formatter: (cellContent: any, row: Port) => (
      <div className="checkbox">
        <label>
          <input type="checkbox" checked={row.isAutoincremented} onChange={(event) => handleChangeAutoInc(event, row)} />
        </label>
      </div>
    )
  }, {
    dataField: 'isUnique',
    text: 'Is Unique',
    formatter: (cellContent: any, row: Port) => (
      <div className="checkbox">
        <label>
          <input type="checkbox" checked={row.isUnique} onChange={(event) => handleChangeUnique(event, row)} />
        </label>
      </div>
    )
  }, {
    dataField: 'remove',
    text: 'Remove',
    formatter: (cellContent: any, row: Port) => (
      <div className="checkbox">
        <label>
          <span onClick={() => removePort(row)} className="mi mi-Delete red" />
        </label>
      </div>
    )
  }];


  let ports = updatedItem && updatedItem.ports && updatedItem.ports as { [s: string]: Port };
  let portsTable: Port[] = ports && Object.keys(ports).map(x => {
    return ports[x];
  });

  if (!updatedItem) return null;
  else
    return (
      <div className="trayBottom">
        <Grid>
          <Row>
            <Col>
              {!showInput ? <h1 onDoubleClick={() => setShowInput(true)}>{name}</h1> : <input className="darkInput fs-24" defaultValue={name} onChange={(event) => handleNameChange(event)} />}
            </Col>
            {!updatedItem.isLabel ?
              <Col className="tableFixHead">
                <BootstrapTable
                  keyField="id"
                  data={portsTable}
                  columns={columns}
                  bordered={false}
                />
                <p className="mouse-cursor" onClick={() => addNewPort(portsTable.length)}>Add new prop</p>
              </Col> : null}
          </Row>
        </Grid>

      </div>
    )


}