import * as React from 'react';
import * as SRD from 'storm-react-diagrams';
import './App.css';
import { TrayItemWidget } from './components/dragAndDrop/TrayItemWidget';
import { TrayWidget } from './components/dragAndDrop/TrayWidget';
require("storm-react-diagrams/dist/style.min.css");

class App extends React.Component {

  makeDiagram = (): JSX.Element => {
      // 1) setup the diagram engine
      var engine = new SRD.DiagramEngine();
      engine.installDefaultFactories();
  
      // 2) setup the diagram model
      var model = new SRD.DiagramModel();
      // 3) create a default node
      var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
      let port1 = node1.addOutPort("Out");
      node1.setPosition(100, 100);
  
      // 4) create another default node
      var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
      let port2 = node2.addInPort("In");
      node2.setPosition(400, 100);
  
      // 5) link the ports
      let link1 = port1.link(port2);
  
      // 6) add the models to the root graph
      model.addAll(node1, node2, link1);
  
      // 7) load model into engine
      engine.setDiagramModel(model);

      return <SRD.DiagramWidget className="diagram srd-demo-canvas" diagramEngine={engine}/>
  }

  render() {
    return (
      <div>
        {/* <TrayWidget>
            <TrayItemWidget model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
            <TrayItemWidget model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
        </TrayWidget> */}
        {this.makeDiagram()}
      </div>
    )
    
  }
}

export default App;
