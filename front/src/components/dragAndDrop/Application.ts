import * as SRD from "storm-react-diagrams";
import { CustomLabelFactory } from "../../infrastructure/factories/CustomLabelFactory";
import { CustomPortFactory } from "../../infrastructure/factories/CustomPortFactory";
import { CustomNodeFactory } from "../../infrastructure/factories/CustomNodeFactory";
import { CustomLinkLabelFactory } from "../../infrastructure/factories/CustomLinkLabelFactory";
import { CustomLinkFactory } from "../../infrastructure/factories/CustomLinkFactory";


export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = new SRD.DiagramEngine();
		this.diagramEngine.registerNodeFactory(new CustomLabelFactory());
		this.diagramEngine.registerLinkFactory(new CustomLinkFactory());
		this.diagramEngine.registerLabelFactory(new CustomLinkLabelFactory());
		this.diagramEngine.registerNodeFactory(new CustomNodeFactory());
		this.diagramEngine.registerPortFactory(new CustomPortFactory());

		this.diagramEngine.installDefaultFactories(); 

		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setDiagramModel(this.activeModel);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}