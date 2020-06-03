import "./PropertyTable.scss";
import React, { useState } from "react";
import { PropertyType } from "../../infrastructure/models/PropertyType";
import { Port } from "../../infrastructure/models/Port";
import BootstrapTable from "react-bootstrap-table-next";
import { DiagramEngine } from "storm-react-diagrams";
import { Link } from "../../infrastructure/models/Link";
import { Node } from "../../infrastructure/models/Node";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

class Props {
	selectedItem: Node;
	diagramEngine: DiagramEngine;
	relView?: boolean;
}

export function useForceUpdate() {
	const [value, setValue] = React.useState(0);
	return () => setValue(value => ++value);
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
		(updatedItem.ports as { [s: string]: Port });

		Object.keys(ports).map(p => console.log(ports[p].isPartialKey = false));
	}

	const handleChangePK = (
		event: React.ChangeEvent<HTMLInputElement>,
		row: Port
	) => {
		event.persist();
		(updatedItem.getPortFromID(
			row.id
		) as Port).isPrimaryKey = !row.isPrimaryKey;

		(updatedItem.getPortFromID(
			row.id
		) as Port).isNotNull = row.isPrimaryKey ? true : false;

		(updatedItem.getPortFromID(
			row.id
		) as Port).isAutoincremented = row.isPrimaryKey ? true : false;

		(updatedItem.getPortFromID(
			row.id
		) as Port).isUnique = row.isPrimaryKey ? true : false;

		clearPartialKeys();
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

	const handleChangePartialKey = (
		event: React.ChangeEvent<HTMLInputElement>,
		row: Port
	) => {
		event.persist();
		(updatedItem.getPortFromID(row.id) as Port).isPartialKey = !row.isPartialKey;
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

	const handleChangepPropType = (
		event: React.ChangeEvent<HTMLInputElement>,
		row: Port
	) => {
		event.persist();
		(updatedItem.getPortFromID(row.id) as Port).propertyType = event.target
			.value;
	};

	const handleChangePortLabel = (
		event: React.ChangeEvent<HTMLInputElement>,
		row: Port
	) => {
		event.persist();
		(updatedItem.getPortFromID(row.id) as Port).label = event.target.value;
	};

	const addNewPort = (newPortNumber: number) => {
		updatedItem.addInPort(
			false,
			`new atribute ${newPortNumber}`,
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
						style={{ width: '100px' }}
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
				<div className="input">
					<input
						style={{ width: '100px' }}

						type="text"
						list="types"
						className="darkInput"
						onChange={event => handleChangepPropType(event, row)}
						defaultValue={row.propertyType}

					/>
					<datalist id="types">
						{preparePropertyTypes()}
					</datalist>

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
			dataField: "isPartialKey",
			text: "Is Partial Key",
			formatter: (cellContent: any, row: Port) => (
				<div className="checkbox">
					<label>
						<input
							type="checkbox"
						checked={row.isPartialKey}
						onChange={event => handleChangePartialKey(event, row)}
						/>
					</label>
				</div>
			)
		},
		{
			dataField: "isNotNull",
			text: "Not Null",
			formatter: (cellContent: any, row: Port) => (
				<div className="checkbox">
					<label>
						<input
							disabled={row.isPrimaryKey}
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
							disabled={row.isPrimaryKey}
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
							disabled={row.isPrimaryKey}
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

	let ispk = portsTable && portsTable.find(p => p.isPrimaryKey) ? true : false;

	let cols = columns;

	if (ispk) {
		cols = cols.filter(col => col.dataField !== 'isPartialKey')
	}

	return (
		<div>
			<BootstrapTable
				keyField="id"
				data={portsTable}
				columns={props.relView ? cols.filter(col => col.dataField !== 'isPrimaryKey' && col.dataField !== 'isPartialKey') : cols}
				bordered={false}
			/>
			<p
				className="mouse-cursor"
				onClick={() => addNewPort(portsTable.length)}
			>
				Add new atribute
      </p>
		</div>
	);
};
