import * as React from "react";
import {IColDef} from "./IColDef";

export interface ITableElements<T> {
  rootElement?: React.ReactNode;
  rowElement?: React.ReactNode;
  cellElement?: React.ReactNode;
  headerCellElement?: React.ReactNode;
  headerElement?: React.ReactNode;
  bodyElement?: React.ReactNode;
  footerElement?: React.ReactNode;
  renderSortLabel?: (colDef: IColDef<T>, desc: boolean) => React.ReactNode;
  renderSortHint?: (colDef: IColDef<T>) => React.ReactNode;
}
