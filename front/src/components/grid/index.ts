import Grid from "./Grid";
import Row from "./Row";
import Col from "./Col";
import { CSSProperties } from "react";

export class GridProps {
  className?: string;
  style?: CSSProperties;
  onDoubleClick?: () => void;
}

export class GridRowProps extends GridProps {
  flex?: boolean;
}

export type GridColWidth =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export class GirdColConfig {
  size: GridColWidth | number;
  push?: GridColWidth | number;
  pull?: GridColWidth | number;
  offset?: GridColWidth | number;
  order?: number;
}

export type GridColConfigProp = GridColWidth | GirdColConfig;

export class GridColProps extends GridProps {
  sm?: GridColConfigProp;
  md?: GridColConfigProp;
  lg?: GridColConfigProp;
  xl?: GridColConfigProp;
  xxl?: GridColConfigProp;
  xxxl?: GridColConfigProp;
  hidden?:
    | "Sm"
    | "Md"
    | "MdDown"
    | "MdUp"
    | "Lg"
    | "LgDown"
    | "LgUp"
    | "Xl"
    | "XlDown"
    | "XlUp"
    | "Xxl"
    | "XxlDown"
    | "XxlUp";
  order?: number;
}

export { Grid, Row, Col };
