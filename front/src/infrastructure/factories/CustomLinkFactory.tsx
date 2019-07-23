import * as React from "react";
import { AbstractLinkFactory, DiagramEngine, DefaultLinkModel, DefaultLinkWidget } from "storm-react-diagrams";
import { Link } from "../models/Link";

export class CustomLinkFactory extends AbstractLinkFactory<Link> {
	constructor() {
		super("custom");
	}

	generateReactWidget(diagramEngine: DiagramEngine, link: DefaultLinkModel): JSX.Element {
		return React.createElement(DefaultLinkWidget, {
			link: link,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): Link {
		return new Link('custom');
	}

	generateLinkSegment(model: Link, widget: DefaultLinkWidget, selected: boolean, path: string) {
		return (
			<path
				className={selected ? widget.bem("--path-selected") : ""}
				strokeWidth={model.width}
				stroke={model.color}
				d={path}
			/>
		);
	}
}
