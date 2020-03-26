import "./NodeProperties.scss";
import * as React from "react";
import { DiagramEngine } from "storm-react-diagrams";
import { Link } from "../../infrastructure/models/Link";
import { Port } from "../../infrastructure/models/Port";
import { Node } from "../../infrastructure/models/Node";

import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { PropertyType } from "../../infrastructure/models/PropertyType";
import { Col, Row, Grid } from "../grid";

class Props {
  selectedItem: Node;
  diagramEngine: DiagramEngine;
  selectedLink: Link;
}

export function useForceUpdate() {
  const [value, setValue] = React.useState(0);
  return () => setValue(value => ++value);
}

export const NodeProperties = (props: Props) => {
  const [updatedItem, setUpdatedItem] = React.useState(null);
  const [name, setName] = React.useState("");
  const [showInput, setShowInput] = React.useState(false);

  const forceUpdate = useForceUpdate();

  React.useMemo(() => {
    setUpdatedItem(props.selectedItem);
    setName(props.selectedItem.name);
  }, [props.selectedItem]);

  const handleChangePK = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.id
    ) as Port).isPrimaryKey = !row.isPrimaryKey;
    forceUpdate();
  };

  const handleChangeNull = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isNotNull = !row.isNotNull;
    forceUpdate();
  };

  const handleChangeUnique = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).isUnique = !row.isUnique;
    forceUpdate();
  };

  const handleChangeAutoInc = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.id
    ) as Port).isAutoincremented = !row.isAutoincremented;
    forceUpdate();
  };

  const handleChangepRropType = (
    event: React.ChangeEvent<HTMLSelectElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).propertyType = event.target
      .value as PropertyType;
    forceUpdate();
  };

  const handleChangePortLabel = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: Port
  ) => {
    event.persist();
    (updatedItem.getPortFromID(row.id) as Port).label = event.target.value;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    let allNodes = props.diagramEngine.diagramModel.getNodes() as {
      [id: string]: Node;
    };
    let names = Object.values(allNodes).map(node => allNodes[node.id].name);

    updatedItem.name = names.includes(event.target.value)
      ? event.target.value + " ALREADY TAKEN!!"
      : event.target.value;
    forceUpdate();
  };

  const addNewPort = (newPortNumber: number) => {
    updatedItem.addInPort(
      false,
      `new port ${newPortNumber}`,
      false,
      false,
      false,
      false,
      false,
      PropertyType.INT
    );
    forceUpdate();
  };

  const removePort = (port: Port) => {
    if (
      Object.entries(port.links).length !== 0 &&
      port.links.constructor === Object
    ) {
      let portLinks: Link[] = Object.keys(port.links).map(x => {
        return port.links[x];
      });
      portLinks.forEach(p =>
        props.diagramEngine.getDiagramModel().removeLink(p)
      );
    }
    updatedItem.removePort(port);
    forceUpdate();
  };

  const preparePropertyTypes = () => {
    return Object.values(PropertyType).map(obj => (
      <option key={obj} value={obj}>
        {obj}
      </option>
    ));
  };

  const columns: any[] = [
    {
      dataField: "label",
      text: "Property Name",
      formatter: (cellContent: any, row: Port) => (
        <div className="input">
          <input
            className="darkInput"
            type="text"
            defaultValue={row.label}
            onChange={event => handleChangePortLabel(event, row)}
          ></input>
        </div>
      )
    },
    {
      style: { paddingLeft: 0 },
      dataField: "propertyType",
      text: "Property Type",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <select
              className="darkSelect"
              onChange={event => handleChangepRropType(event, row)}
              value={PropertyType[row.propertyType]}
            >
              {preparePropertyTypes()}
            </select>
          </label>
        </div>
      )
    },
    {
      dataField: "isPrimaryKey",
      text: "Is Primary Key",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isPrimaryKey}
              onChange={event => handleChangePK(event, row)}
            />
          </label>
        </div>
      )
    },
    {
      dataField: "isNotNull",
      text: "Is Nullable",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isNotNull}
              onChange={event => handleChangeNull(event, row)}
            />
          </label>
        </div>
      )
    },
    {
      dataField: "isAutoincremented",
      text: "Is Auto Incremented",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isAutoincremented}
              onChange={event => handleChangeAutoInc(event, row)}
            />
          </label>
        </div>
      )
    },
    {
      dataField: "isUnique",
      text: "Is Unique",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isUnique}
              onChange={event => handleChangeUnique(event, row)}
            />
          </label>
        </div>
      )
    },
    {
      dataField: "remove",
      text: "Remove",
      formatter: (cellContent: any, row: Port) => (
        <div className="checkbox">
          <label>
            <span
              onClick={() => removePort(row)}
              className="mi mi-Delete red"
            />
          </label>
        </div>
      )
    }
  ];

  let ports =
    updatedItem &&
    updatedItem.ports &&
    (updatedItem.ports as { [s: string]: Port });
  let portsTable: Port[] =
    ports &&
    Object.keys(ports)
      .map(x => {
        return ports[x];
      })
      .filter(p => !p.isNamePort);

  if (!updatedItem) return null;
  else
    return (
      <div className="trayBottom">
        <Grid>
          <Row>
            <Col>
              {!showInput ? (
                <h1 onDoubleClick={() => setShowInput(true)}>{name}</h1>
              ) : (
                <input
                  className="darkInput fs-24"
                  defaultValue={name}
                  onChange={event => handleNameChange(event)}
                />
              )}
            </Col>
            {!updatedItem.isLabel ? (
              <Col className="tableFixHead">
                <BootstrapTable
                  keyField="id"
                  data={portsTable}
                  columns={columns}
                  bordered={false}
                />
                <p
                  className="mouse-cursor"
                  onClick={() => addNewPort(portsTable.length)}
                >
                  Add new prop
                </p>
              </Col>
            ) : null}
          </Row>
        </Grid>
      </div>
    );
};
