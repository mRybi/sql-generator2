import * as React from "react";
import * as _ from "lodash";

import { DiagramWidget } from "storm-react-diagrams";
import { TrayItemWidget } from "./components/dragAndDrop/TrayItemWidget";
import { TrayWidget } from "./components/dragAndDrop/TrayWidget";
import { Application } from "./components/dragAndDrop/Application";
import { Node } from "./components/models/Node";
import { Link } from "./components/models/Link";
import { PropertyType } from "./components/models/PropertyType";
import { NodeProperties } from "./components/nodeProperties/NodeProperties";
import { GenerationHandler } from "./handlers/GenerationHandler";
import { RelationPopup } from "./components/popups/RealtionPopup/RelationPopup";
import AppContext from "./context/appContext/AppContext";

require("storm-react-diagrams/dist/style.min.css");
require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');

interface Props {
	app: Application;
}

interface State {
	showDialog: boolean;
	selectedNode: Node;
	selectedLink: Link;
	selectedRelation: RelationType;
	showRelationDialog: boolean;
}

export enum AppViewType {
	ENTITY = 0,
	RELATION = 1
}

export enum RelationType {
	O2O = 0,
	O2M = 1,
	M2M = 2,
	none = 3,
	M2MNoTable = 4
}

export class AppView extends React.Component<Props, State> {

	static contextType = AppContext;
	private myRef: React.RefObject<any>;

	constructor(props: Props) {
		super(props);
		this.state = {
			showDialog: false,
			selectedNode: null,
			selectedLink: null,
			selectedRelation: RelationType.O2O,
			showRelationDialog: false
		}
	}

	componentWillMount() {
		this.setState({ selectedNode: null })
	}

	updateRelationPopup() {
		this.setState({ showRelationDialog: false,  selectedNode: null});
	}

	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">DB Diagram Scripter</div>
				</div>
				<div className="content" ref={this.myRef}>
					<TrayWidget>
						<TrayItemWidget model={{ type: "table" }} name="Node" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: "label" }} name="Label" color="rgb(192,255,0)" />

						<div
							style={{
								borderColor: "rgb(0,255,0)", marginTop: '100px'
							}}
							className={`tray-item ${this.state.selectedRelation === RelationType.O2O ? 'selected' : ''}`}
							onClick={() => {
								// let app = this.props.app.getActiveDiagram().getNodes() as { [s: string]: Node };
								// Object.keys(app).forEach(x => app[x].updatePorts(RelationType.O2O));
								this.setState({
									selectedRelation: RelationType.O2O
								})

							}}
						>
							Relation
						</div>
						<div
							style={{ borderColor: "rgb(255,0,0)", marginTop: '100px' }}
							className={`tray-item ${this.context.view === AppViewType.ENTITY ? 'selected' : ''}`}
							onClick={() => {
								this.context.changeViewType(0);
								// this.props.app.getDiagramEngine().recalculatePortsVisually();
							}}
						>
							Entity View
						</div>

						<div
							style={{ borderColor: "rgb(255,0,0)" }}
							className={`tray-item ${this.context.view === AppViewType.RELATION ? 'selected' : ''}`}
							onClick={() => {
								this.context.changeViewType(1);
								// this.props.app.getDiagramEngine().recalculatePortsVisually();
							}}
						>
							Relation View
						</div>

						<div
							style={{ borderColor: "rgb(255,0,0)" }}
							className="tray-item"
							onClick={() => this.setState({ showDialog: true })}
						>
							Create DB Code
						</div>

					
					</TrayWidget>

					<div
						className="diagram-layer"
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getDiagramModel()
									.getNodes()
							).length;
							
							var node = null;
							if (data.type === "table") {
								node = new Node(this.props.app.getDiagramEngine(), `Node${nodesCount + 1}`, "rgb(0,192,255)");
								// node = new Node("table", `Node${nodesCount + 1}`, "rgb(0,192,255)");
								 node.addInPort("Id", true, false, false, false, false, PropertyType.INT);

								// node.addInPort(true, true, true, true, false, "Id", PropertyType.INT);
								// node.addInPort(false, false, false, false, false, "Name", PropertyType.NVARCHAR);
							} else {
								node = new Node(this.props.app.getDiagramEngine(), "Label ", "rgb(192,255,0)");
								// node = new Node("label", "Label ", "rgb(192,255,0)");
							}

							var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.x = points.x;
							node.y = points.y;
							this.props.app
								.getDiagramEngine()
								.getDiagramModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}

						onClick={event => {
							event.preventDefault();
							this.setState({
								selectedRelation: RelationType.none,
								showDialog: false
							})
						}}
						onDoubleClick={event => {
							event.preventDefault();
							if (this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems().length === 1) {
								this.setState({
									selectedLink: this.props.app
										.getDiagramEngine()
										.getDiagramModel().getSelectedItems()[0].parent as Link,
									showRelationDialog: true,
									selectedNode: null
								})
							} else {
							this.setState({
								showDialog: false,
								showRelationDialog: false,
								selectedNode: this.props.app
									.getDiagramEngine()
									.getDiagramModel()
									.getSelectedItems()[0] as Node

							});
							}
						}}
					>
						<DiagramWidget deleteKeys={[46]} className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
					</div>
					{this.state.selectedNode != null ? <NodeProperties selectedRelation={this.state.selectedRelation} selectedLink={this.state.selectedLink} selectedItem={this.state.selectedNode} diagramEngine={this.props.app.getDiagramEngine()} /> : null}
					<GenerationHandler isOpen={this.state.showDialog} serializeDiagram={this.props.app.getActiveDiagram().serializeDiagram()} />
					<RelationPopup diagramModel={this.props.app.getActiveDiagram()} update={() => this.updateRelationPopup()} isOpen={this.state.showRelationDialog} link={this.state.selectedLink} />
				</div>
			</div >
		);
	}
}