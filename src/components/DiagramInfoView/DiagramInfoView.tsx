import './nodeItems.scss';
import * as React from "react";

class OwnProps {
    diagramWidget: JSX.Element
    selectedNode: any
}

type Props = OwnProps;

export class DiagramInfoView extends React.Component<Props,{}> {

	render() {
        return ( 
            <div className="flex">
                
            </div>
        );
    }
}