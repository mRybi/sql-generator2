
import * as _ from "lodash";
import { LinkModelListener, BaseEvent, LinkModel, DefaultLinkModel, DiagramEngine, LabelModel } from "storm-react-diagrams";
import { Label } from "./Label";

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export class Link extends LinkModel<DefaultLinkModelListener> {
	width: number;
	color: string;
	curvyness: number;

	constructor(type: string = "custom") {
		super(type);
		this.color = "rgba(255,255,255,0.5)";
		this.width = 3;
		this.curvyness = 50;
		this.addLabel('1,N');
		this.addLabel('relation name');
		this.addLabel('1,N');
	}

	serialize() {
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(ob: any, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new Label('custom');
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.width = width;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color: string) {
		this.color = color;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}
}