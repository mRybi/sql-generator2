import * as _ from "lodash";
import { PortModel, DiagramEngine } from "storm-react-diagrams";
import { LogicLink } from "./LogicLink";

export class LogicPort extends PortModel {
  in: boolean;
  isNamePort: boolean;
  label: string;
  links: { [id: string]: LogicLink };
  isPrimaryKey: boolean;
  isPartialKey: boolean;
  isForeignKey: boolean;
  isAutoincremented: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  propertyType: string;// PropertyType;
  fkPortId: string;

  constructor(
    name: string,
    isNamePort: boolean,
    isPrimaryKey?: boolean,
    isForeignKey?: boolean,
    isNotNull?: boolean,
    isAutoincremented?: boolean,
    isUnique?: boolean,
    propertyType?:  string, //PropertyType,
    id?: string,
    fkPortId?: string
  ) {
    super(name, "custom", id);
    this.label = name;
    this.isNamePort = isNamePort;
    this.links = {};

    this.isPrimaryKey = isPrimaryKey;
    this.isForeignKey = isForeignKey;
    this.isPartialKey = false;

    this.isNotNull = isNotNull;
    this.isUnique = isUnique;
    this.isAutoincremented = isAutoincremented;

    this.propertyType = propertyType;
    this.fkPortId = fkPortId;

  }

  deSerialize(object: any, engine: DiagramEngine) {
    super.deSerialize(object, engine);
    this.label = object.label;
    this.isNamePort = object.isNamePort;

    this.isPrimaryKey = object.isPrimaryKey;
    this.isPartialKey = object.isPartialKey;

    this.isForeignKey = object.isForeignKey;
    this.isNotNull = object.isNotNull;
    this.isUnique = object.isUnique;
    this.isAutoincremented = object.isAutoincremented;
    this.propertyType = object.propertyType;
    this.fkPortId = object.fkPortId;

  }

  serialize() {
    return _.merge(super.serialize(), {
      label: this.label,
      links: this.links,
      isNamePort: this.isNamePort,
      isPrimaryKey: this.isPrimaryKey,
      isPartialKey: this.isPartialKey,

      isForeignKey: this.isForeignKey,
      isNotNull: this.isNotNull,
      isUnique: this.isUnique,
      isAutoincremented: this.isAutoincremented,
      propertyType: this.propertyType,
      fkPortId: this.fkPortId
    });
  }

  canLinkToPort(port: LogicPort): boolean {
    return true;
  }

  createLinkModel(): LogicLink {
    return new LogicLink("custom");
  }
}
