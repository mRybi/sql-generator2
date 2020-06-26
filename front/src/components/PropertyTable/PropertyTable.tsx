import "./PropertyTable.scss";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import React from "react";
import { PropertyType } from "../../infrastructure/models/PropertyType";
import { DefaultPortModel } from "../../infrastructure/models/DefaultPortModel";
import BootstrapTable from "react-bootstrap-table-next";
import { DefaultNodeModel } from "../../infrastructure/models/DefaultNodeModel";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { AdvancedPortModel } from "../../infrastructure/models/ArrowPortModel";
import styled from "@emotion/styled";
import { DarkInput } from "../DarkInput";
import { Toolkit } from "../../infrastructure/Toolkit";
import { DefaultLinkModel } from "../../infrastructure/models/DefaultLinkModel";
import { DefaultLabelModel } from "../../infrastructure/models/DefaultLabelModel";

namespace S {
  export const AddNewAtributeButton = styled.p`
    cursor: cell
  `;
}

class Props {
  relationName?: string;
  update: () => void;
  selectedItem: DefaultNodeModel;
  diagramEngine: DiagramEngine;
  relView?: boolean;
  link?: DefaultLinkModel;
  isLogic: boolean;
}

export function useForceUpdate() {
  const [, setValue] = React.useState(0);
  return () => setValue((value) => ++value);
}

export const PropertyTable = (props: Props) => {
  const [updatedItem, setUpdatedItem] = React.useState(null);

  const forceUpdate = useForceUpdate();

  React.useMemo(() => {
    setUpdatedItem(props.selectedItem);
  }, [props.selectedItem]);

  const clearPartialKeys = () => {
    let ports =
      updatedItem &&
      updatedItem.ports &&
      (updatedItem.ports as { [s: string]: DefaultPortModel });

    Object.keys(ports).map((p) => console.log((ports[p].isPartialKey = false)));
  };

  const handleChangePK = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isPrimaryKey = !row.isPrimaryKey;

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isNotNull = row.isPrimaryKey ? true : false;

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isAutoincremented = row.isPrimaryKey ? true : false;

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isUnique = row.isPrimaryKey ? true : false;

    clearPartialKeys();
    forceUpdate();
  };

  const handleChangeFK = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isForeignKey = !row.isForeignKey;

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isNotNull = row.isForeignKey ? true : false;

    forceUpdate();
  };

  const handleChangeNull = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isNotNull = !row.isNotNull;
    forceUpdate();
  };

  const handleChangePartialKey = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isPartialKey = !row.isPartialKey;

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isNotNull = row.isPartialKey ? true : false;
    forceUpdate();
  };

  const handleChangeUnique = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isUnique = !row.isUnique;
    forceUpdate();
  };

  const handleChangeAutoInc = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).isAutoincremented = !row.isAutoincremented;
    forceUpdate();
  };

  const handleChangepPropType = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();

    (updatedItem.getPortFromID(
      row.getOptions().id
    ) as DefaultPortModel).propertyType = event.target.value;
  };

  const handleChangePortLabel = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: DefaultPortModel
  ) => {
    event.persist();
    (updatedItem.getPortFromID(row.getOptions().id) as DefaultPortModel).label =
      event.target.value;

    if(props.relView) {
      let relationAtributes = props.link.properties !== null && props.link.properties.getPorts() as {[s: string]: DefaultPortModel};
      let attString = '';
  
      if(Object.keys(relationAtributes).length > 0) {
        Object.keys(relationAtributes).map(id => attString += `${relationAtributes[id].label} ${relationAtributes[id].propertyType} \n`);
        
  
        let labels = props.link.getLabels() as DefaultLabelModel[];
        labels[1].getOptions().label = `${props.relationName}\n${attString}`;
    
      }
    }
  };

  const addNewPort = (newPortNumber: number) => {
    (updatedItem as DefaultNodeModel).addPort(
      new AdvancedPortModel(
        `new atribute ${newPortNumber}`,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        "INT",
        Toolkit.UID()
      )
    );

    if(props.relView) {
      let {link} = props;
      let labels = link.getLabels() as DefaultLabelModel[];
      
      labels[1].getOptions().label += `${`new atribute ${newPortNumber}`} INT \n`;
    }

    forceUpdate();
  };

  const removePort = (port: DefaultPortModel) => {
    updatedItem.removePort(port);
    let relationAtributes = props.link.properties !== null && props.link.properties.getPorts() as {[s: string]: DefaultPortModel};
    let attString = '';

    if(Object.keys(relationAtributes).length > 0) {
      Object.keys(relationAtributes).filter(id => id !== port.getID()).map(id => attString += `${relationAtributes[id].label} ${relationAtributes[id].propertyType} \n`);
      
      let labels = props.link.getLabels() as DefaultLabelModel[];
      let oldLabel = labels[1].getOptions().label;
      labels[1].getOptions().label = oldLabel.slice(0, oldLabel.indexOf('\n'));
      labels[1].getOptions().label += `\n${attString}`;
    }

    forceUpdate();
  };

  const preparePropertyTypes = () => {
    return Object.values(PropertyType).map((obj) => (
      <option key={obj} value={obj}>
        {obj}
      </option>
    ));
  };

  const columns: any[] = [
    {
      dataField: "label",
      text: "Property Name",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="input">
          {/* <DarkInput 
            type="text" 
            defaultValue={row.label} 
            onChange={(event) => handleChangePortLabel(event, row)}
          ></DarkInput> */}

          <input
            style={{ width: "100px" }}
            className="darkInput"
            type="text"
            defaultValue={row.label}
            onChange={(event) => handleChangePortLabel(event, row)}
          ></input>
        </div>
      ),
    },
    {
      style: { paddingLeft: 0 },
      dataField: "propertyType",
      text: "Property Type",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="input">
          <input
            style={{ width: "100px" }}
            type="text"
            list="types"
            className="darkInput"
            onChange={(event) => handleChangepPropType(event, row)}
            defaultValue={row.propertyType}
          />
          <datalist id="types">{preparePropertyTypes()}</datalist>
        </div>
      ),
    },
    {
      dataField: "isPrimaryKey",
      text: "Is Primary Key",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isPrimaryKey}
              onChange={(event) => handleChangePK(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "isForeignKey",
      text: "Is Foreign Key",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isForeignKey}
              onChange={(event) => handleChangeFK(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "isPartialKey",
      text: "Is Partial Key",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={row.isPartialKey}
              onChange={(event) => handleChangePartialKey(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "isNotNull",
      text: "Not Null",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              disabled={row.isPrimaryKey || row.isForeignKey}
              type="checkbox"
              checked={row.isNotNull}
              onChange={(event) => handleChangeNull(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "isAutoincremented",
      text: "Is Auto Incremented",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              disabled={row.isPrimaryKey}
              type="checkbox"
              checked={row.isAutoincremented}
              onChange={(event) => handleChangeAutoInc(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "isUnique",
      text: "Is Unique",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <input
              disabled={row.isPrimaryKey}
              type="checkbox"
              checked={row.isUnique}
              onChange={(event) => handleChangeUnique(event, row)}
            />
          </label>
        </div>
      ),
    },
    {
      dataField: "remove",
      text: "Remove",
      formatter: (cellContent: any, row: DefaultPortModel) => (
        <div className="checkbox">
          <label>
            <span
              onClick={() => removePort(row)}
              className="mi mi-Delete red"
            />
          </label>
        </div>
      ),
    },
  ];

  let ports =
    updatedItem &&
    updatedItem.ports &&
    (updatedItem.ports as { [s: string]: DefaultPortModel });

  let portsTable: DefaultPortModel[] =
    ports &&
    Object.keys(ports)
      .map((x) => {
        return ports[x];
      })
      .filter((p) => !p.isNamePort);

  let ispk =
    portsTable && portsTable.find((p) => p.isPrimaryKey) ? true : false;

  let cols = columns;

  if (ispk) {
    cols = cols.filter((col) => col.dataField !== "isPartialKey");
  }

  if (!props.isLogic) {
    cols = cols.filter((c) => c.dataField !== "isForeignKey");
  }

  return (
    <div className={`${!props.relView && 'relView'}`}>
      <BootstrapTable
        keyField="id"
        data={portsTable}
        columns={
          props.relView
            ? cols.filter(
                (col) =>
                  col.dataField !== "isPrimaryKey" &&
                  col.dataField !== "isPartialKey"
              )
            : cols
        }
        bordered={false}
      />
      <S.AddNewAtributeButton onClick={() => addNewPort(portsTable.length)}>
        Add new atribute
        </S.AddNewAtributeButton>
    </div>
  );
};
