import './nodeItems.scss';
import * as React from "react";
import { BaseModel, BaseEntity, BaseModelListener, DefaultNodeModel } from 'storm-react-diagrams';

class OwnProps {
    selectedItem: DefaultNodeModel
}

class State {
    updatedItem: DefaultNodeModel
    name: string;
}

type Props = OwnProps;

export class NodeInfo extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount( ){
        this.setState({
            updatedItem: this.props.selectedItem,
            name: this.props.selectedItem.name
        })
    }

    componentWillReceiveProps(nextProps: Props) {

        if(nextProps != this.props) {
            this.setState({
                updatedItem: nextProps.selectedItem,
                name: this.props.selectedItem.name
            })
            this.forceUpdate();
        }
    }

    changeName( newName: string): (event: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void {
        console.log('event',event);
        console.log('event',event.srcElement.innerHTML);
        console.log('event',event.srcElement.append());


        let updatedNameItem: DefaultNodeModel = this.state.updatedItem;
        updatedNameItem.name = newName;

        this.setState({ updatedItem: updatedNameItem})
        return null
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event)
        console.log(this.state.name);
        // this.setState({name: event.currentTarget.textContent});
      }


    render() {
        if(this.state.updatedItem == null) return 'Loading....' 
        console.log('item', this.props.selectedItem);
        return (
            <div className="trayBottom">
                <input className="tray-bottom-item" type="text" onChange={(e) => this.handleChange(e)} value={this.state.name}></input>
                {/* onChange={() => this.changeName(this.state.updatedItem.name)} */}

                {/* <div className="tray-bottom-item" onDoubleClick={() => this.changeName('XDD')}>
                    <input>{this.state.updatedItem.name}</input>
                </div>
                <input className="tray-bottom-item">{this.state.updatedItem.width}</input>
                <input className="tray-bottom-item">{this.state.updatedItem.height}</input>
                <input className="tray-bottom-item">{this.state.updatedItem.color}</input> */}
            </div>
        );
    }
    
}