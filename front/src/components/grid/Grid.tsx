import * as React from "react";

import { GridProps } from "./";

export default class Grid extends React.Component<GridProps> {
  render() {
    return (
      <div style={this.props.style} className={this.buildClassNameString()}>
        {this.props.children}
      </div>
    );
  }

  buildClassNameString() {
    let className = "ms-Grid";

    if (this.props.className != null) {
      className += ` ${this.props.className}`;
    }

    return className;
  }
}
