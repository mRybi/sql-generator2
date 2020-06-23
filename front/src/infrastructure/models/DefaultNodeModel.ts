import * as _ from "lodash";
import { DefaultPortModel } from "../models/DefaultPortModel";
import {
  NodeModel,
  NodeModelGenerics,
} from "@projectstorm/react-diagrams-core";
import {
  BasePositionModelOptions,
  DeserializeEvent,
} from "@projectstorm/react-canvas-core";

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
  name?: string;
  color?: string;
}

export interface DefaultNodeModelGenerics extends NodeModelGenerics {
  OPTIONS: DefaultNodeModelOptions;
}

export class DefaultNodeModel extends NodeModel<DefaultNodeModelGenerics> {
  isLabel: boolean;

  protected portsIn: DefaultPortModel[];

  constructor(isLabel: boolean, name: string, color: string) {
    super({
      type: "default",
      name,
      color,
    });
    this.isLabel = isLabel;
    this.portsIn = [];
  }

  doClone(lookupTable: {}, clone: any): void {
    clone.portsIn = [];
    clone.portsOut = [];
    super.doClone(lookupTable, clone);
  }

  removePort<T extends DefaultPortModel>(port: T): void {
    super.removePort(port);
  }

  addPort<T extends DefaultPortModel>(port: T): T {
    super.addPort(port);
    if (port.getOptions().in) {
      if (this.portsIn.indexOf(port) === -1) {
        this.portsIn.push(port);
      }
    }
    return port;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.name = event.data.name;
    this.options.color = event.data.color;
    this.portsIn = _.map(event.data.portsInOrder, (id) => {
      return this.getPortFromID(id);
    }) as DefaultPortModel[];
    this.isLabel = event.data.isLabel;
  }

  serialize(): any {
    return {
      ...super.serialize(),
      name: this.options.name,
      color: this.options.color,
      isLabel: this.isLabel
    };
  }

  getInPorts(): DefaultPortModel[] {
    return this.portsIn;
  }
}
