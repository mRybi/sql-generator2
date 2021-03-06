import {
  LinkModel,
  PortModel,
  PortModelAlignment,
  PortModelGenerics,
  PortModelOptions,
  PointModel,
  DiagramEngine,
} from "@projectstorm/react-diagrams-core";
import { DefaultLinkModel } from "../models/DefaultLinkModel";
import { AbstractModelFactory } from "@projectstorm/react-canvas-core";
import { Toolkit } from "../Toolkit";
import _ from "lodash";

export interface DefaultPortModelOptions extends PortModelOptions {
  label?: string;
  propertyType?: string;
  in?: boolean;
}

export interface DefaultPortModelGenerics extends PortModelGenerics {
  OPTIONS: DefaultPortModelOptions;
}

export class DefaultPortModel extends PortModel<DefaultPortModelGenerics> {
  in: boolean;
  isNamePort: boolean;
  label: string;
  isPrimaryKey: boolean;
  isPartialKey: boolean;
  isForeignKey: boolean;
  isAutoincremented: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  propertyType: string;
  fkPortId: string;

  dEngine: DiagramEngine;

  constructor(
    logic: boolean,
    name: string,
    isNamePort: boolean,
    isPrimaryKey?: boolean,
    isForeignKey?: boolean,
    isPartialKey?: boolean,
    isNotNull?: boolean,
    isAutoincremented?: boolean,
    isUnique?: boolean,
    propertyType?: string,
    engine?: DiagramEngine,
    id?: string,
    fkPortId?: string,
    alignemnt?: PortModelAlignment,
  ) {
    super({
      id: id || Toolkit.UID(),
      in: true,
      name,
      label: name,
      propertyType: propertyType,
      alignment: alignemnt,
      type: logic ? "arrow" : "default",
    });

    this.label = name;
    this.isNamePort = isNamePort;
    this.links = {};

    this.isPrimaryKey = isPrimaryKey;
    this.isForeignKey = isForeignKey;
    this.isPartialKey = isPartialKey;

    this.isNotNull = isNotNull;
    this.isUnique = isUnique;
    this.isAutoincremented = isAutoincremented;

    this.propertyType = propertyType;
    this.fkPortId = fkPortId;

    this.dEngine = engine;
  }

  deserialize(event: any) {
    super.deserialize(event);
    this.options.in = event.data.in;
    this.options.label = event.data.label;

    this.label = event.data.label;
    this.isNamePort = event.data.isNamePort;

    this.isPrimaryKey = event.data.isPrimaryKey;
    this.isPartialKey = event.data.isPartialKey;

    this.isForeignKey = event.data.isForeignKey;
    this.isNotNull = event.data.isNotNull;
    this.isUnique = event.data.isUnique;
    this.isAutoincremented = event.data.isAutoincremented;
    this.propertyType = event.data.propertyType;
    this.fkPortId = event.data.fkPortId;
  }

  serialize() {
    return {
      ...super.serialize(),
      in: this.in,
      label: this.label,
      isNamePort: this.isNamePort,
      isPrimaryKey: this.isPrimaryKey,
      isPartialKey: this.isPartialKey,

      isForeignKey: this.isForeignKey,
      isNotNull: this.isNotNull,
      isUnique: this.isUnique,
      isAutoincremented: this.isAutoincremented,
      propertyType: this.propertyType,
      fkPortId: this.fkPortId,
    };
  }

  updateOptionsLabel(newLabel: string) {
    this.options.label = newLabel;
  }

  updateOptionsPropertyType(newPropType: string) {
    this.options.propertyType = newPropType;
  }

  link<T extends LinkModel>(
    port: PortModel,
    factory?: AbstractModelFactory<T>
  ): T {
    let link = this.createLinkModel(factory);
    link.setSourcePort(this);
    link.setTargetPort(port);
    link.removeMiddlePoints()
    return link as T;
  }

  canLinkToPort(port: PortModel): boolean {
    if (port === this) {
      return false;
    }
    if( port.getParent() === this.getParent()) {
      this.recursiveRelation(port);
    }

    return true;
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    let link = super.createLinkModel();
    if (!link && factory) {
      return factory.generateModel({});
    }
    var linksCount = _.keys(
      this.dEngine.getModel().getLinks()
    ).length;

    console.log(linksCount);

    return link || new DefaultLinkModel({}, {position: {x: this.getPosition().x + 40, y: this.getPosition().y - 100 }}, linksCount + 1);

  }

  recursiveRelation(port: PortModel) {
    this.link(port);

    return false;
  }
}
