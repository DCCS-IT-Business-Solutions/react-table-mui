import * as React from "react";

export interface IColDef<T> {
  prop: keyof T;
  header: string | ElementContent<T> | React.ReactNode;
  accessor?: (data: T) => string;
  width?: number;
  render?: (data: T) => React.ReactNode;
  renderFilter?: (
    value: T,
    handleChange: (v: T) => void
  ) => React.ReactNode;
  props?: (data: T) => object;
  headerProps?: object;
  footerProps?: object;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  footer?: string | ElementContent<T>;
}

type Fn<T> = (colDef: IColDef<T>, data: T[]) => React.ReactNode;
type ElementContent<T> = string | Fn<T>;
