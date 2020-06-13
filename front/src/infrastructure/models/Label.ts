import * as _ from "lodash";
import { LabelModel, DiagramEngine } from "storm-react-diagrams";

export class Label extends LabelModel {
  label: string;
  isFirst: boolean;

  constructor(label: string) {
    console.log('ctor label')
    super("custom");
    this.label = label;
    this.offsetY = -23;
  }

  setLabel(label: string) {
    this.label = label;
  }

  deSerialize(ob: any, engine: DiagramEngine) {
    super.deSerialize(ob, engine);
    this.label = ob.label;
  }

  serialize() {
    return _.merge(super.serialize(), {
      label: this.label
    });
  }
}
