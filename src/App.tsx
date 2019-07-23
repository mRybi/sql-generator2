
import * as React from "react";
import * as _ from "lodash";
import { Application } from "./components/dragAndDrop/Application";
import { AppView } from "./AppView";
import AppContext from "./context/appContext/AppContext";
require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');
require("storm-react-diagrams/dist/style.min.css");

export class App extends React.Component {

state = {view: 0, application: new Application()};

changeViewType = (viewType: number) => {
    this.setState({view: viewType})
}

render() {
    return (
        <AppContext.Provider
            value={{
                view: this.state.view,
                app: this.state.application,
                changeViewType: this.changeViewType
            }}
        >
            <AppView app={this.state.application}/>
        </AppContext.Provider>
    );
}
}