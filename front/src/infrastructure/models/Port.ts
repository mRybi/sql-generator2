import * as _ from "lodash";
import { Link } from "./Link";
import { PortModel, DiagramEngine } from "storm-react-diagrams";
import { PropertyType } from "./PropertyType";

export class Port extends PortModel {
  in: boolean;
  isNamePort: boolean;
  label: string;
  links: { [id: string]: Link };
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isAutoincremented: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  propertyType: PropertyType;

  constructor(
    name: string,
    isNamePort: boolean,
    isPrimaryKey?: boolean,
    isForeignKey?: boolean,
    isNotNull?: boolean,
    isAutoincremented?: boolean,
    isUnique?: boolean,
    propertyType?: PropertyType,
    id?: string
  ) {
    super(name, "custom", id);
    this.label = name;
    this.isNamePort = isNamePort;
    this.links = {};

    this.isPrimaryKey = isPrimaryKey;
    this.isForeignKey = isForeignKey;

    this.isNotNull = isNotNull;
    this.isUnique = isUnique;
    this.isAutoincremented = isAutoincremented;

    this.propertyType = propertyType;
  }

  deSerialize(object: any, engine: DiagramEngine) {
    super.deSerialize(object, engine);
    this.label = object.label;
    this.isNamePort = object.isNamePort;

    this.isPrimaryKey = object.isPrimaryKey;
    this.isForeignKey = object.isForeignKey;
    this.isNotNull = object.isNotNull;
    this.isUnique = object.isUnique;
    this.isAutoincremented = object.isAutoincremented;
    this.propertyType = object.propertyType;
  }

  serialize() {
    return _.merge(super.serialize(), {
      label: this.label,
      links: this.links,
      isNamePort: this.isNamePort,
      isPrimaryKey: this.isPrimaryKey,
      isForeignKey: this.isForeignKey,
      isNotNull: this.isNotNull,
      isUnique: this.isUnique,
      isAutoincremented: this.isAutoincremented,
      propertyType: this.propertyType
    });
  }

  canLinkToPort(port: Port): boolean {
    return true;
  }

  createLinkModel(): Link {
    return new Link("custom");
  }
}
