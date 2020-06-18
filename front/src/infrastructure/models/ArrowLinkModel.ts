import { DefaultLinkModelOptions } from "./DefaultLinkModel";
import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class ArrowLinkModel extends DefaultLinkModel {
	constructor(options: DefaultLinkModelOptions = {}) {
		super({
			type: 'arrow',
			width: options.width || 3,
			color: options.color || 'gray',
			selectedColor: options.selectedColor || 'rgb(0,192,255)',
			curvyness: 0,
			...options
		});
	}
}