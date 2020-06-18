import * as _ from "lodash";
import {
  LinkModelListener,
  BaseEvent,
  LinkModel,
  DefaultLinkModel,
  DiagramEngine,
  LabelModel,
  PortModel
} from "storm-react-diagrams";
import { Label } from "./Label";
import { Node } from "./Node";
import { PropertyType } from "./PropertyType";

export interface DefaultLinkModelListener extends LinkModelListener {
  colorChanged?(
    event: BaseEvent<DefaultLinkModel> & { color: null | string }
  ): void;

  widthChanged?(
    event: BaseEvent<DefaultLinkModel> & { width: 0 | number }
  ): void;
}
class RelationProperties {
  label: string;
  isPrimaryKey: boolean;
  isAutoincremented: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  propertyType: PropertyType
}
export class LogicLink extends LinkModel<DefaultLinkModelListener> {
  width: number;
  color: string;
  curvyness: number;
  properties: Node;
  markers: any;

  constructor(type: string = "custom", labelF: string, labelS: string) {
    super(type);
    this.color = "rgba(255,255,255,0.5)";
    this.width = 3;
    this.curvyness = 0;

    this.addLabel(labelF);
    this.addLabel(labelS);

    this.properties = new Node(false, 'relNode')
    this.markers = {startMarker: false, endMarker: false};
  }

  serialize() {
    let relPorts = this.properties && this.properties.ports && Object.values(this.properties.ports);
    let properties = relPorts && relPorts.map(a => {
      return { label: a.label, 
        propertyType: a.propertyType, 
        isPrimaryKey: a.isPrimaryKey ,
        isNotNull: a.isNotNull,
        isAutoincremented: a.isAutoincremented,
        isUnique: a.isUnique 
      }
    })

    return _.merge(super.serialize(), {
      width: this.width,
      color: this.color,
      curvyness: this.curvyness,
      properties
    });
  }

  deSerialize(ob: any, engine: DiagramEngine) {
    let propertiesNode = new Node(false, 'relNode');
    propertiesNode.ports = ob.properties.map((a: RelationProperties) => {
      return { label: a.label, 
        propertyType: a.propertyType, 
        isPrimaryKey: a.isPrimaryKey ,
        isNotNull: a.isNotNull,
        isAutoincremented: a.isAutoincremented,
        isUnique: a.isUnique 
      }
    })
    console.log('obj', ob.properties)
    super.deSerialize(ob, engine);
    this.color = ob.color;
    this.width = ob.width;
    this.curvyness = ob.curvyness;
    this.properties = propertiesNode //ob.properties;
  }

  addLabel(label: LabelModel | string) {
    if (label instanceof LabelModel) {
      return super.addLabel(label);
    }
    let labelOb = new Label("custom");
    labelOb.setLabel(label);
    return super.addLabel(labelOb);
  }


  setWidth(width: number) {
    this.width = width;
    this.iterateListeners(
      (listener: DefaultLinkModelListener, event: BaseEvent) => {
        if (listener.widthChanged) {
          listener.widthChanged({ ...event, width: width });
        }
      }
    );
  }

  setColor(color: string) {
    this.color = color;
    this.iterateListeners(
      (listener: DefaultLinkModelListener, event: BaseEvent) => {
        if (listener.colorChanged) {
          listener.colorChanged({ ...event, color: color });
        }
      }
    );
  }

  setMarkers(startMarker: boolean, endMarker: boolean) {
		this.markers = {startMarker: startMarker, endMarker: endMarker};
	}
}
