import "./NodeProperties.scss";
import * as React from "react";
import { DiagramEngine } from "storm-react-diagrams";
import { Node } from "../../infrastructure/models/Node";

import { Col, Row, Grid } from "../grid";
import { PropertyTable } from "../propertyTable/PropertyTable";

class Props {
  selectedItem: Node;
  isLogic: boolean;
  diagramEngine: DiagramEngine;
}

export function useForceUpdate() {
  const [value, setValue] = React.useState(0);
  return () => setValue(value => ++value);
}

export const NodeProperties = (props: Props) => {
  const [updatedItem, setUpdatedItem] = React.useState(null);
  const [defaultName, setDefaultName] = React.useState("");

  const [name, setName] = React.useState("");
  const [showInput, setShowInput] = React.useState(false);

  const forceUpdate = useForceUpdate();

  React.useMemo(() => {
    setUpdatedItem(props.selectedItem);
    setName(props.selectedItem.name);
    setDefaultName(props.selectedItem.name);
  }, [props.selectedItem]);


  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    event.persist();
    let allNodes = props.diagramEngine.diagramModel.getNodes() as {
      [id: string]: Node;
    };
    let names = Object.values(allNodes).map(node => allNodes[node.id].name.toLowerCase().trim());
    
    names.includes(event.target.value.toLowerCase().trim())
      ? updatedItem.name = defaultName
      : updatedItem.name = event.target.value.trim();
    forceUpdate();
  };

      const iconStyles: React.CSSProperties = {
        display: "flex",
        flexDirection: 'row',
        flexFlow: 'row-reverse',
        position: 'absolute',
        right: '0',
        top: '10px',
        zIndex: 9999
      };


      const acceptStyle: React.CSSProperties = {
        marginRight: 5,
        backgroundColor: 'green',
        borderRadius: '90px',
        padding: '10px',
      };

      const declineStyle: React.CSSProperties = {
        marginRight: '20px',
        backgroundColor: 'red',
        borderRadius: '90px',
        padding: '10px',
      };

  if (!updatedItem) return null;
  else
    return (
      <div className="trayBottom">
        {/* <div style={iconStyles}>
              <span
                style={declineStyle}
                className={`mi ${
                  "mi-Cancel"
                }`}
              />
                <span
                  style={acceptStyle}
                  className={`mi ${
                    "mi-Accept"
                  }`}
                />
            </div> */}
        <Grid>
          <Row>
          
            <Col >
              {!showInput ? (
                
                <h1 style={{wordBreak: 'break-all'}} onDoubleClick={() => setShowInput(true)}>{name}</h1>
              ) : (
                props.selectedItem.isLabel ? 
                <textarea
                style={{height: '200px'}}
                className="darkInput fs-24"
                defaultValue={name}
                onChange={event => handleNameChange(event)}
                >

                </textarea> :
                <input
                  className="darkInput fs-24"
                  defaultValue={name}
                  onChange={event => handleNameChange(event)}
                />
              )}
              
            </Col>
            
            {!updatedItem.isLabel ? (
        <PropertyTable selectedItem={props.selectedItem} diagramEngine={props.diagramEngine} isLogic={props.isLogic}/> 
            ) : null}
          </Row>
        </Grid>
      </div>
    );
};
