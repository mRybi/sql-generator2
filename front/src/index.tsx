import "./styles/index.scss";
import "./styles/App.scss";
import "./styles/dragAndDrop.scss";
import "./icons/micon/css/micon.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { App } from "./App";
import * as ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import * as React from "react";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
