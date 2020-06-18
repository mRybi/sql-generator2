import React from 'react';
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";

import { ArrowLinkModel } from "../models/ArrowLinkModel";
import { ArrowLinkWidget } from "../widgets/ArrowLinkWidget";

export class ArrowLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('arrow');
	}

	generateModel(): ArrowLinkModel {
		return new ArrowLinkModel();
	}

	generateReactWidget(event: any): JSX.Element {
		return <ArrowLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
}