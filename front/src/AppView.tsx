import * as React from "react";
import * as _ from "lodash";

import { DiagramWidget, PointModel } from "storm-react-diagrams";
import { TrayItemWidget } from "./components/dragAndDrop/TrayItemWidget";
import { TrayWidget } from "./components/dragAndDrop/TrayWidget";
import { Application } from "./components/dragAndDrop/Application";
import { Node } from "./infrastructure/models/Node";
import { Link } from "./infrastructure/models/Link";
import { PropertyType } from "./infrastructure/models/PropertyType";
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
	showRelationDialog: boolean;
}

export enum AppViewType {
	ENTITY = 0,
	RELATION = 1
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
			showRelationDialog: false
		}
	}

	componentWillMount() {
		this.setState({ selectedNode: null })
	}

	updateRelationPopup() {
		this.setState({ showRelationDialog: false, selectedNode: null });
	}

	render() {
		console.log('QQQQ', this.state);
		return (
			<div className="body">
				<div className="header">
					<div className="title">DB Diagram Scripter</div>
				</div>
				<div className="content" ref={this.myRef}>
					<TrayWidget>
						<TrayItemWidget model={{ type: "table" }} name="Entity" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: "label" }} name="Label" color="rgb(192,255,0)" />
						{/* <div
							style={{ borderColor: "rgb(255,0,0)", marginTop: '100px' }}
							className={`tray-item ${this.context.view === AppViewType.ENTITY ? 'selected' : ''}`}
							onClick={() => {
								this.context.changeViewType(0);
							}}
						>
							Entity View
						</div>

						<div
							style={{ borderColor: "rgb(255,0,0)" }}
							className={`tray-item ${this.context.view === AppViewType.RELATION ? 'selected' : ''}`}
							onClick={() => {
								this.context.changeViewType(1);
							}}
						>
							Relation View
						</div> */}
						<div
							style={{ borderColor: "rgb(255,123,0)", marginTop: '100px' }}
							className="tray-item"
							onClick={() => {
								console.log('SAVE ACTION');
							}}
						>
							Save
						</div>

						<div
							style={{ borderColor: "rgb(255,123,0)" }}
							className="tray-item"
							onClick={() => {
								console.log('Load from file ACTION');
							}}
						>
							Load Diagram
						</div>

						<div
							style={{ borderColor: "rgb(255,0,0)", marginTop: '100px' }}
							className="tray-item"
							onClick={() => this.setState({ showDialog: true, selectedNode: null })}
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
								node = new Node(false, this.props.app.getDiagramEngine(), `Entity${nodesCount + 1}`, "rgb(0,192,255)");
								node.addInPort("Id", true, false, false, false, false, PropertyType.INT);
							} else {
								node = new Node(true, this.props.app.getDiagramEngine(), "Label ", "rgb(192,255,0)");
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
								showDialog: false,
								showRelationDialog: false,
								selectedNode: null,
								selectedLink: null
							})
						}}
						onDoubleClick={event => {
							console.log('WWWWif',this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems());

							console.log('WWWWif',this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems()[0] instanceof Node);

							event.preventDefault();
							if (this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems()[0] instanceof PointModel) {
							console.log('WWWWif',this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems() );

								this.setState({
									selectedLink: this.props.app
										.getDiagramEngine()
										.getDiagramModel().getSelectedItems()[0].parent as Link,
									showRelationDialog: true,
									selectedNode: null
								})
							} else if (this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems()[0] instanceof Node) {
							console.log('WWWWel',this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems() );
								
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
					{this.state.selectedNode != null ? <NodeProperties selectedLink={this.state.selectedLink} selectedItem={this.state.selectedNode} diagramEngine={this.props.app.getDiagramEngine()} /> : null}
					<GenerationHandler isOpen={this.state.showDialog} serializeDiagram={this.props.app.getActiveDiagram().serializeDiagram()} />
					<RelationPopup diagramModel={this.props.app.getActiveDiagram()} update={() => this.updateRelationPopup()} isOpen={this.state.showRelationDialog} link={this.state.selectedLink} />
				</div>
			</div >
		);
	}
}