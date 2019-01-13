import './NodeProperty.scss'
import * as React from "react";
import { BaseModel, BaseEntity, BaseModelListener, DefaultNodeModel } from 'storm-react-diagrams';
import { Col, Grid, Row } from "../../grid";

class OwnProps {
    value: string;
    acceptChangeProperty?: (newValue: string) => void 
    addPort?: (portName: string, isOut: boolean) => void
}

class State {
    propertyValue: string;
    copy: string;
    showInput: boolean;
}

type Props = OwnProps;

export class NodeProperty extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            propertyValue: this.props.value,
            copy: this.props.value,
            showInput: false
        })
    }

    componentWillReceiveProps(nextProps: Props){
        if(nextProps != this.props) {
            this.setState({
                propertyValue: nextProps.value,
                copy: nextProps.value
            })
            this.forceUpdate();
        }
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()

        this.setState({propertyValue: event.target.value, copy: event.target.value});
    }

    switchViewUpdateValue(): void {
        this.props.acceptChangeProperty(this.state.propertyValue);
        this.setState({showInput: false});
        this.forceUpdate();
    }

    cancelRenaming(): void {
        this.setState({showInput: false});
    }

    showInput(): void {
        this.setState({
            showInput: true
        })
    }

    render() {
        return (
            <div onDoubleClick={() => this.showInput()} >
                {this.state.showInput ? 
                <div>
                    <input className="tray-bottom-item" type="text" onBlur={this.switchViewUpdateValue.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.propertyValue}></input> 
                    <button className="tray-bottom-item" onClick={this.switchViewUpdateValue.bind(this)}>Change name</button>
                    <button className="tray-bottom-item" onClick={this.cancelRenaming.bind(this)}>Cancel</button>
                </div> : <h1 className="tray-bottom-item">Rename {this.state.propertyValue}</h1>}
            </div>
        );
    }
    


}