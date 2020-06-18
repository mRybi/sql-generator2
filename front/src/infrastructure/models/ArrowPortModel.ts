import { LinkModel, LinkModelGenerics, PortModel, PortModelAlignment } from "@projectstorm/react-diagrams";
import { ArrowLinkModel } from "./ArrowLinkModel";
import { DefaultPortModel } from "./DefaultPortModel";
import { DefaultNodeModel } from "./DefaultNodeModel";
import { Toolkit } from "../Toolkit";

export class AdvancedPortModel extends DefaultPortModel {
	constructor(name: string,
		isNamePort: boolean,
		isPrimaryKey?: boolean,
		isForeignKey?: boolean,
		isNotNull?: boolean,
		isAutoincremented?: boolean,
		isUnique?: boolean,
		propertyType?:  string, //PropertyType,
		id?: string,
		fkPortId?: string,
		alignemnt?: PortModelAlignment) {
		super(true, name,isNamePort, isPrimaryKey, isForeignKey, isNotNull,isAutoincremented, isUnique, propertyType, id,fkPortId,alignemnt);
	}
	canLinkToPort(port: PortModel): boolean {
		let thisParent = this.getParent() as DefaultNodeModel;
		let portNode = port.getParent() as DefaultNodeModel;
	
		let portNodePorts = portNode.getPorts() as {[s: string]: AdvancedPortModel};
		let thisParentPorts = thisParent.getPorts() as {[s: string]: AdvancedPortModel};
	
		let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].fkPortId === portNode.getOptions().id)[0];
		let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).filter(id => portNodePorts[id].fkPortId === thisParent.getOptions().id)[0];
		
		let pk = Object.keys(thisParentPorts).filter(id => thisParentPorts[id].isPrimaryKey)[0];
	
		if(!czyMaPortZPKjakoFk && !czyMaPortZPKjakoFk2) {
            portNode.addPort(new AdvancedPortModel(thisParent.getOptions().name + thisParentPorts[pk].getOptions().name, false, false, true, true, false, false, 'INT', Toolkit.UID(), thisParent.getOptions().id));
		}
	
		return true;
	}
	
	createLinkModel(): ArrowLinkModel | LinkModel<LinkModelGenerics> {
		return new ArrowLinkModel();
	}
}