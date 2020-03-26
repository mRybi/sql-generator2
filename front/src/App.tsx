import * as React from "react";
import { Application } from "./components/dragAndDrop/Application";
import { AppView } from "./AppView";
require("react-bootstrap-table-next/dist/react-bootstrap-table2.min.css");
require("storm-react-diagrams/dist/style.min.css");

export const App = () => {
  return <AppView app={new Application()} />;
};
