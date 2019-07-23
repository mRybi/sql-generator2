import * as React from 'react';

import { GridRowProps } from './';

export default class Row extends React.Component<GridRowProps> {
  render() {
    return <div className={this.buildClassNameString()}>{this.props.children}</div>;
  }

  buildClassNameString() {
    let className = 'ms-Grid-row';

    if (this.props.flex) {
      className += ' grid-row-flex';
    }

    if (this.props.className != null) {
      className += ` ${this.props.className}`;
    }

    return className;
  }
}
