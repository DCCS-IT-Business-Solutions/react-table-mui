import {IColDef, PropType} from "./IColDef";
import * as React from "react";
import {ChangeFilterHandler, SortDirection} from "./index";
import {ITableElements} from "./ITableElements";

export interface ITableMuiProps<T> {
  data: T[];
  colDef?: IColDef<T>[];
  orderBy?: string;
  sort?: SortDirection;
  onChangeOrderBy?: (orderBy: PropType<T>) => void;
  onChangeFilter?: ChangeFilterHandler<T>;
  onRowClick?: (data: T) => void;
  renderRoot?: (children: React.ReactNode) => React.ReactNode;
  renderHeaderCell?: (col: IColDef<T>, idx: number) => React.ReactNode;
  renderFooterCell?: (
    col: IColDef<T>,
    data: T[],
    idx: number
  ) => React.ReactNode;
  renderFilter?: (col: IColDef<T>, idx: number) => React.ReactNode;
  renderExpansionIndicator?: (expanded: boolean) => React.ReactNode;
  subComponent?: (data: T) => React.ReactNode;
  rowProps?: (data: T) => object;
  cellProps?: (data: T) => object;
  filter?: object;
  defaultFilter?: object;
  ellipsis?: boolean;
  selectedRow?: T | T[];
  onChangeSelectedRow?: (data: T) => void;
  selectedRowProps?: (data: T) => object;
  rowSelectionColumnName?: string;
  filterBlur?: boolean;
}

export type TableProps<T> = ITableMuiProps<T> & ITableElements<T>;
