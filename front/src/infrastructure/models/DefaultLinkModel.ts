import {
	LabelModel,
	LinkModel,
	LinkModelGenerics,
	LinkModelListener,
	PortModel,
	PortModelAlignment
} from '@projectstorm/react-diagrams-core';
import { DefaultLabelModel } from '../models/DefaultLabelModel';
import { BezierCurve } from '@projectstorm/geometry';
import { BaseEntityEvent, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { DefaultNodeModel } from './DefaultNodeModel';
import { PropertyType } from './PropertyType';
import { DefaultPortModel } from './DefaultPortModel';

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEntityEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEntityEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export interface DefaultLinkModelOptions extends BaseModelOptions {
	width?: number;
	color?: string;
	selectedColor?: string;
	curvyness?: number;
	type?: string;
	testName?: string;
}

export interface DefaultLinkModelGenerics extends LinkModelGenerics {
	LISTENER: DefaultLinkModelListener;
	OPTIONS: DefaultLinkModelOptions;
}

class RelationProperties {
	label: string;
	isPrimaryKey: boolean;
	isAutoincremented: boolean;
	isNotNull: boolean;
	isUnique: boolean;
	propertyType: PropertyType
  }

export class DefaultLinkModel extends LinkModel<DefaultLinkModelGenerics> {
	properties: DefaultNodeModel;

	constructor(options: DefaultLinkModelOptions = {}) {
		super({
			type: 'default',
			width: options.width || 3,
			color: options.color || 'gray',
			selectedColor: options.selectedColor || 'rgb(0,192,255)',
			curvyness: 0,
			...options
		});

		this.addLabel('0,N')
		this.addLabel('relation name')
		this.addLabel('0,N')

		this.properties = new DefaultNodeModel(false, 'relNode', 'rgb(0,192,255)');
	}

	calculateControlOffset(port: PortModel): [number, number] {
		if (port.getOptions().alignment === PortModelAlignment.RIGHT) {
			return [this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.LEFT) {
			return [-this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.TOP) {
			return [0, -this.options.curvyness];
		}
		return [0, this.options.curvyness];
	}

	getSVGPath(): string {
		if (this.points.length === 2) {
			const curve = new BezierCurve();
			curve.setSource(this.getFirstPoint().getPosition());
			curve.setTarget(this.getLastPoint().getPosition());
			curve.setSourceControl(this.getFirstPoint().getPosition().clone());
			curve.setTargetControl(this.getLastPoint().getPosition().clone());

			if (this.sourcePort) {
				curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
			}

			if (this.targetPort) {
				curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
			}
			return curve.getSVGCurve();
		}
	}

	serialize() {
		let relPorts = this.properties && this.properties.getPorts() && Object.values(this.properties.getPorts());
		let properties = relPorts && relPorts.map((a: DefaultPortModel) => {
			return { 
			label: a.label, 
			  propertyType: a.propertyType, 
			  isPrimaryKey: a.isPrimaryKey ,
			  isNotNull: a.isNotNull,
			  isAutoincremented: a.isAutoincremented,
			  isUnique: a.isUnique 
			}
		  })

		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness,
			selectedColor: this.options.selectedColor,
			properties
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		let propertiesNode = new DefaultNodeModel(false, 'relNode', 'rgb(0,192,255)');
		event.data.properties.map((a: RelationProperties) => {
			propertiesNode.addPort(new DefaultPortModel(false, a.label, false, a.isPrimaryKey, 
				false, false, a.isNotNull, a.isAutoincremented, a.isUnique, a.propertyType));
		  })

		super.deserialize(event);
		this.options.color = event.data.color;
		this.options.width = event.data.width;
		this.options.curvyness = event.data.curvyness;
		this.options.selectedColor = event.data.selectedColor;
		this.properties = propertiesNode;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.options.width = width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}
}
