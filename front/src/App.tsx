
import * as React from "react";
import * as _ from "lodash";
import { Application } from "./components/dragAndDrop/Application";
import { AppView } from "./AppView";
import AppContext from "./context/appContext/AppContext";
require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');
require("storm-react-diagrams/dist/style.min.css");

export class App extends React.Component {

state = {view: 0, application: new Application(), application2: new Application()};

changeViewType = (viewType: number) => {
    this.state.application.getDiagramEngine().recalculatePortsVisually();
    this.state.application2.getDiagramEngine().recalculatePortsVisually();

    this.setState({view: viewType})
}

render() {
    return (
        <AppContext.Provider
            value={{
                view: this.state.view,
                app: this.state.application,
                app2: this.state.application2,
                changeViewType: this.changeViewType
            }}
        >
            <AppView app2={this.state.application2} app={this.state.application}/>
        </AppContext.Provider>
    );
}
}