import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { AdvancedPortModel } from '../models/ArrowPortModel';

export class ArrowPortFactory extends AbstractModelFactory<AdvancedPortModel, DiagramEngine> {
	constructor() {
		super('arrow');
	}

	generateModel(): AdvancedPortModel {
		return new AdvancedPortModel('port', true, false);
	}
}
