import * as React from "react";

import { GridColProps, GridColConfigProp } from "./";

export default class Col extends React.Component<GridColProps> {
  render() {
    return (
      <div
        className={this.buildClassNameString()}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.props.children}
      </div>
    );
  }

  buildGridColConfigClassNames(size: string, config: GridColConfigProp) {
    if (config == null) return "";

    let className = ` ms-${size}`;

    if (typeof config === "string") {
      className += config;
    } else {
      className += config.size;

      if (config.pull != null) {
        className += ` ms-${size}Pull${config.pull}`;
      }

      if (config.push != null) {
        className += ` ms-${size}Push${config.push}`;
      }

      if (config.offset != null) {
        className += ` ms-${size}Offset${config.offset}`;
      }

      if (config.order != null) {
        className += ` grid-flex-order-${size}-${config.order}`;
      }
    }

    return className;
  }

  buildClassNameString() {
    let className = "ms-Grid-col";

    if (this.props.className != null) {
      className += ` ${this.props.className}`;
    }

    if (this.props.hidden != null) {
      className += ` ms-hidden${this.props.hidden}`;
    }

    if (this.props.order != null) {
      className += ` grid-flex-order-${this.props.order}`;
    }

    className += this.buildGridColConfigClassNames("sm", this.props.sm);
    className += this.buildGridColConfigClassNames("md", this.props.md);
    className += this.buildGridColConfigClassNames("lg", this.props.lg);
    className += this.buildGridColConfigClassNames("xl", this.props.xl);
    className += this.buildGridColConfigClassNames("xxl", this.props.xxl);
    className += this.buildGridColConfigClassNames("xxxl", this.props.xxxl);

    return className;
  }
}
