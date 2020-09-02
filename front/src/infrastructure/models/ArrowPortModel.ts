import {
  LinkModel,
  LinkModelGenerics,
  PortModel,
  PortModelAlignment,
  DiagramEngine,
} from "@projectstorm/react-diagrams";
import { ArrowLinkModel } from "./ArrowLinkModel";
import { DefaultPortModel } from "./DefaultPortModel";
import { DefaultNodeModel } from "./DefaultNodeModel";
import { Toolkit } from "../Toolkit";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";

export class AdvancedPortModel extends DefaultPortModel {
  constructor(
    name: string,
    isNamePort: boolean,
    isPrimaryKey?: boolean,
    isForeignKey?: boolean,
    isPartialKey?: boolean,
    isNotNull?: boolean,
    isAutoincremented?: boolean,
    isUnique?: boolean,
    propertyType?: string,
    id?: string,
    fkPortId?: string,
    alignemnt?: PortModelAlignment
  ) {
    super(
      true,
      name,
      isNamePort,
      isPrimaryKey,
      isForeignKey,
      isPartialKey,
      isNotNull,
      isAutoincremented,
      isUnique,
      propertyType,
      null,
      id,
      fkPortId,
      alignemnt
    );
  }

  link<T extends LinkModel>(
    port: PortModel,
    
    factory?: AbstractModelFactory<T>
  ): T {
    let link = this.createLinkModel();
    link.setSourcePort(port);
    link.setTargetPort(this);
    return link as T;
  }

  canLinkToPort(port: PortModel): boolean {
    if (port === this) {
      return false;
    }

    let thisParent = this.getParent() as DefaultNodeModel;
    let portNode = port.getParent() as DefaultNodeModel;

    let portNodePorts = portNode.getPorts() as {
      [s: string]: AdvancedPortModel;
    };
    let thisParentPorts = thisParent.getPorts() as {
      [s: string]: AdvancedPortModel;
    };

    let czyMaPortZPKjakoFk = Object.keys(thisParentPorts).find(
      (id) => thisParentPorts[id].fkPortId === portNode.getOptions().id
    );
    let czyMaPortZPKjakoFk2 = Object.keys(portNodePorts).find(
      (id) => portNodePorts[id].fkPortId === thisParent.getOptions().id
    );

    let pk =
      Object.keys(thisParentPorts).find(
        (id) => thisParentPorts[id].isPrimaryKey
      ) || "Id";

    if (!czyMaPortZPKjakoFk && !czyMaPortZPKjakoFk2) {
      if (pk) {
        portNode.addPort(
          new AdvancedPortModel(
            thisParent.getOptions().name +
              thisParentPorts[pk].getOptions().name,
            false,
            false,
            true,
            true,
            true,
            false,
            false,
            "INT",
            
            Toolkit.UID(),
            thisParent.getOptions().id
          )
        );
      } else {
        portNode.addPort(
          new AdvancedPortModel(
            thisParent.getOptions().name + "Id",
            false,
            false,
            true,
            true,
            true,
            false,
            false,
            "INT",
            Toolkit.UID(),
            thisParent.getOptions().id
          )
        );
      }
    }

    return true;
  }

  createLinkModel(): ArrowLinkModel | LinkModel<LinkModelGenerics> {
    return new ArrowLinkModel();
  }
}
