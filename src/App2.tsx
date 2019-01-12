import * as React from "react";
import * as _ from "lodash";
import { DefaultNodeModel, DiagramWidget, BaseEntityType, BaseEntity, BaseModelListener, BaseModel } from "storm-react-diagrams";
import { TrayItemWidget } from "./components/dragAndDrop/TrayItemWidget";
import { TrayWidget } from "./components/dragAndDrop/TrayWidget";
import { Application } from "./components/dragAndDrop/Application";
import './dragAndDrop.scss';
require("storm-react-diagrams/dist/style.min.css");
import './App.css';
import { NodeInfo } from "./components/nodeInfo/NodeInfo";

export interface BodyWidgetProps {
	app: Application;
}

export interface BodyWidgetState {
	// selectedNode: BaseModel<BaseEntity, BaseModelListener>[]; //DefaultNodeModel
	selectedNode: DefaultNodeModel;
}

/** 
 * @author Dylan Vorster
 */
export class App2 extends React.Component<BodyWidgetProps, BodyWidgetState> {
	constructor(props: BodyWidgetProps) {
		super(props);
		this.state = {
			selectedNode: null
		};
	}

	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">Create diagrams</div>
				</div>
				<div className="content">
					<TrayWidget>
						<TrayItemWidget model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
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
							if (data.type === "in") {
								node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(192,255,0)");
								node.addInPort("In");
							} else {
								node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
								node.addOutPort("Out");
								node.addOutPort("XDD")
								node.addInPort("IN")
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
						onDoubleClick={event => {
							this.setState({
								selectedNode: this.props.app
								.getDiagramEngine()
								.getDiagramModel()
								.getSelectedItems()[0] as DefaultNodeModel
							});
													
							console.log('XD',this.state.selectedNode);
						}}
					>
						<DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
						
					</div>
					{ this.state.selectedNode != null ? <NodeInfo selectedItem={this.state.selectedNode} /> : null}
				</div>
			</div>
		);
	}
}