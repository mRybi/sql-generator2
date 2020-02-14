
import * as React from "react";
import * as _ from "lodash";
import { Application } from "./components/dragAndDrop/Application";
import { AppView } from "./AppView";
import AppContext from "./context/appContext/AppContext";
require('react-bootstrap-table-next/dist/react-bootstrap-table2.min.css');
require("storm-react-diagrams/dist/style.min.css");

export const App = () => {
  const [application, setApplication] = React.useState(new Application());

  const newApplication = () => {
    setApplication(new Application());
  }

  return (
    <AppContext.Provider
      value={{
        app: application,
        newApplication: newApplication
      }}
    >
      <AppView app={application}  />
    </AppContext.Provider>
  );
}