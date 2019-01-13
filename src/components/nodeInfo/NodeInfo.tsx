import './nodeItems.scss';
import * as React from "react";
import { DefaultNodeModel, DefaultPortModel, PortModel, DiagramModel, LabelModel, DefaultLinkModel } from 'storm-react-diagrams';
import { NodeProperty } from './nodeProperty/NodeProperty';
import { number } from 'prop-types';
import { randomBytes } from 'crypto';

class OwnProps {
    selectedItem: DefaultNodeModel
    diagramModel: DiagramModel
    selectedLink: DefaultLinkModel
}

class State {
    updatedItem: DefaultNodeModel
    name: string;
    showInput: boolean;
    showInputDelete: boolean;
    showInputColor: boolean;
    portState: string;
    newPortName: string;
    portToRemove: string;
    portLabelToRemove: string;
    color: string
}

type Props = OwnProps;

export class NodeInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            updatedItem: this.props.selectedItem,
            name: this.props.selectedItem.name,
            showInput: false,
            showInputDelete: false,
            showInputColor: false,
            portState: 'out',
            newPortName: 'out',
            portToRemove: null,
            portLabelToRemove: null,
            color: 'Red'
        })
    }

    componentWillReceiveProps(nextProps: Props) {
        console.log('both', this.props, nextProps);
        if (nextProps != this.props) {
            this.setState({
                updatedItem: nextProps.selectedItem,
                name: nextProps.selectedItem.name
            })
            this.forceUpdate();
        }
    }

    changeName1(newValue: string): void {
        let updatedItem: DefaultNodeModel = this.state.updatedItem;
        updatedItem.name = newValue;
        this.setState({ updatedItem: updatedItem });
    }

    addPort(): void {
        if (this.state.portState == 'out') {
            this.state.updatedItem.addOutPort(this.state.newPortName);
        } else {
            this.state.updatedItem.addInPort(this.state.newPortName);
        }
    }

    switchViewUpdateValue(): void {
        this.addPort();
        this.setState({ showInput: false });
    }

    cancelAddingPort(): void {
        this.setState({ showInput: false, showInputDelete: false, showInputColor: false });
    }
    cancelChangingColor(): void {
        this.setState({ showInputColor: false });
    }
    cancelInputDelete(): void {
        this.setState({ showInputDelete: false });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()

        this.setState({ newPortName: event.target.value });
    }

    handleChangePort(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist()

        this.setState({ portState: event.target.value });
    }



    removePort() {
        console.log('JEBANY ROMOVER', this.state.portToRemove);
        if (this.state.portToRemove != null) {
            let portToDelete: PortModel = this.state.updatedItem.getPort(this.state.portToRemove);

            this.state.updatedItem.removePort(portToDelete);
            this.setState({ portToRemove: null })
        }

    }

    render() {
        // console.log('selected link', this.props.selectedLink);
        // let links = this.props.diagramModel.getLinks();
        // console.log(links);
        // let liksIDs = Object.keys(links).map((key) => {
        //     return key
        // });

        // let testLink = this.props.diagramModel.getLink(liksIDs[0]);
        // (testLink as DefaultLinkModel).addLabel("Hello World!");


        /////// Colors/////////////////// red pink green blue orange brown
        let colors: string[] = ['pink', 'red', 'green', 'blue', 'orange', 'brown']
        let colorsRgb: string[] = ['rgb(255,0,185)', 'rgb(255,0,0)', 'rgb(0,250,14)', 'rgb(0, 250, 253)', 'rgb(239, 137, 74)', 'rgb(125, 73, 64)']


        let allPorts: { [S: string]: DefaultPortModel } = this.state.updatedItem.ports;
        console.log(allPorts);

        this.state.updatedItem
        if (allPorts != null) {
            let aaa = Object.values(allPorts).map(value => {
                return value.label;
            });

            console.log(aaa);



            let portsIds = Object.keys(allPorts).map((key) => {
                return key
            });

            let makeItem = function (x: any) {
                return <option key={x}>{x}</option>;
            }

            console.log('selected node', this.props.selectedItem)
            if (this.state.updatedItem == null) return 'Loading...';
            return (
                <div className="trayBottom">

                    <NodeProperty value={this.state.name} acceptChangeProperty={this.changeName1.bind(this)} />
                    <div onDoubleClick={() => this.showInput()}>
                        {this.state.showInput ?
                            <div>
                                <input className="tray-bottom-item" type="text" onChange={this.handleChange.bind(this)} value={this.state.newPortName}></input>
                                <input className="tray-bottom-item" type="text" onChange={this.handleChangePort.bind(this)} value={this.state.portState}></input>
                                <button className="tray-bottom-item" onClick={this.switchViewUpdateValue.bind(this)}>Add</button>
                                <button className="tray-bottom-item" onClick={this.cancelAddingPort.bind(this)}>Cancel</button>
                            </div> : <h1 className="tray-bottom-item">{'Add Property'}</h1>}
                    </div>
                    <div onDoubleClick={() => this.showInputDelete()}>
                        {this.state.showInputDelete ?
                            <div>
                                <select className="tray-bottom-item" onChange={this.selectPort.bind(this)}>{aaa.map(makeItem)}</select>
                                <button className="tray-bottom-item" onClick={() => this.removePort()}>Delete</button>
                                <button className="tray-bottom-item" onClick={this.cancelInputDelete.bind(this)}>Cancel</button>

                            </div> : <h1 className="tray-bottom-item">{'Delete Property'}</h1>}
                    </div>
                    <div onDoubleClick={() => this.showInputColor()}>
                        {this.state.showInputColor ?
                            <div>
                                <select className="tray-bottom-item" onChange={this.selectColor.bind(this)} value={this.state.color}>
                                    <option value="Red">Red</option>
                                    <option value="Pink">Pink</option>
                                    <option value="Green">Green</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Orange">Orange</option>
                                    <option value="Brown">Brown</option>
                                </select>
                                <button className="tray-bottom-item" onClick={() => this.changeColor()}>Change color</button>
                                <button className="tray-bottom-item" onClick={this.cancelChangingColor.bind(this)}>Cancel</button>

                            </div> : <h1 className="tray-bottom-item">{'Change Color'}</h1>}
                    </div>

                </div>


            );

        }
        else return null;

    }
    changeColor(): void {
        if (this.state.color != null) {
            this.state.updatedItem.color = this.state.color;
        }
    }

    selectColor(e: any) {
        e.persist();
        e.preventDefault();

        let colors: string[] = ['Red', 'Pink', 'Green', 'Blue', 'Orange', 'Brown'];
        let colorsRgb: string[] = ['rgb(255,0,0)', 'rgb(255,0,185)', 'rgb(0,250,14)', 'rgb(0, 250, 253)', 'rgb(239, 137, 74)', 'rgb(125, 73, 64)'];
        let index = colors.indexOf(e.target.value);
        let xd = this.state.updatedItem;
        xd.color = colorsRgb[index];
        this.setState({
            color: colorsRgb[index]
        })

    }

    selectPort(e: any) {
        e.persist()
        let ports: { [S: string]: DefaultPortModel } = this.state.updatedItem.ports;

        let names = Object.values(ports).map(value => {
            return value.label
        })
        let portsIds = Object.keys(ports).map((key) => {
            return key
        });

        let indexOfGuyToDelete = names.indexOf(e.target.value);
        this.setState({
            portLabelToRemove: e.target.value,
            portToRemove: portsIds[indexOfGuyToDelete] as string
        });


    }

    showInput(): void {
        this.setState({
            showInput: true
        })
    }

    showInputDelete(): void {
        this.setState({
            showInputDelete: true
        })
    }

    showInputColor(): void {

        this.setState({
            showInputColor: true,
        })
    }


}