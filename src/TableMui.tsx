import * as React from "react";
import {ChangeFilterHandler} from ".";
import {some, sumBy} from "lodash";
import {IconButton, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import {IColDef, PropType} from "./IColDef";
import {TableProps} from "./Props";

interface IState {
  filter: any;
  showSubComponent: object;
}

export class TableMui<T extends object, F extends keyof T & object> extends React.Component<TableProps<T, F>, IState> {
  state = {
    filter: this.props.defaultFilter || {} as F,
    showSubComponent: {}
  };

  get hasFooter() {
    return some(this.props.colDef, def => def.footer != null);
  }

  get isFilterable() {
    return some(this.props.colDef, def => def.filterable === true);
  }

  get filter() {
    return this.props.filter ? this.props.filter : this.state.filter;
  }

  render() {
    const {data} = this.props;
    const colDef = this.props.colDef || this.generateColDef(data);

    if (data != null) {
      const renderRoot = this.props.renderRoot || this.renderRoot;
      return renderRoot(
        <React.Fragment>
          {this.renderHeader(colDef)}
          {this.renderData(colDef, data)}
          {this.hasFooter && this.renderFooter(colDef, data)}
        </React.Fragment>
      );
    }
    return null;
  }

  renderRoot = (children: React.ReactNode) => {
    return <Table style={{tableLayout: "auto"}}>{children}</Table>;
  };

  renderData(colDef: IColDef<T>[], data: any[]) {
    return (
      <TableBody>
        {data && data.map((d, idx) => this.renderRow(colDef, d, idx))}
      </TableBody>
    );
  }

  getSelectedRowProps(data: any) {
    if (this.props.selectedRow == null) {
      // No Row is selected
      return false;
    }
    if (this.props.rowSelectionColumnName != null) {
      // The user has provided a ColumnName to compare a single Column with the SelectedRow Value
      if (Array.isArray(this.props.selectedRow)) {
        // This is a multi-line selectable table
        if (
          this.props.selectedRow!.indexOf(
            data[this.props.rowSelectionColumnName]
          ) !== -1
        ) {
          // This row is in scope of the selectedRow Array
          if (this.props.selectedRowProps != null) {
            // The user has provided a function that provides a object for the row
            return this.props.selectedRowProps(data);
          } else {
            // The user has not provided a function that provides a object for the row,
            // so default the background is set to grey
            return {
              style: {
                background: "grey",
                cursor: this.props.onRowClick ? "pointer" : "default"
              }
            };
          }
        } else {
          // This row is not in scope of the selectedRow Array
          return false;
        }
      } else {
        // This is a single-line selectable table
        if (
          this.props.selectedRow === data[this.props.rowSelectionColumnName]
        ) {
          // This row is the selectedRow
          if (this.props.selectedRowProps != null) {
            // The user has provided a function that provides a object for the row
            return this.props.selectedRowProps(data);
          } else {
            // The user has not provided a function that provides a object for the row,
            // so default the background is set to grey
            return {
              style: {
                background: "grey",
                cursor: this.props.onRowClick ? "pointer" : "default"
              }
            };
          }
        } else {
          // This row is not the selected Row
          return false;
        }
      }
    } else {
      // The user has not provided a ColumnName to compare a single Column with the SelectedRow Value
      // so default the selectedRow is compared with the whole data object
      if (Array.isArray(this.props.selectedRow)) {
        // This is a multi-line selectable table
        if (this.props.selectedRow.indexOf(data) !== -1) {
          // This row is in scope of the selectedRow Array
          if (this.props.selectedRowProps != null) {
            // The user has provided a function that provides a object for the row
            return this.props.selectedRowProps(data);
          } else {
            // The user has not provided a function that provides a object for the row,
            // so default the background is set to grey
            return {
              style: {
                background: "grey",
                cursor: this.props.onRowClick ? "pointer" : "default"
              }
            };
          }
        } else {
          // This row is not in scope of the selectedRow Array
          return false;
        }
      } else {
        // This is a single-line selectable table
        if (this.props.selectedRow === data) {
          // This row is the selectedRow
          if (this.props.selectedRowProps != null) {
            // The user has provided a function that provides a object for the row
            return this.props.selectedRowProps(data);
          } else {
            // The user has not provided a function that provides a object for the row,
            // so default the background is set to grey
            return {
              style: {
                background: "grey",
                cursor: this.props.onRowClick ? "pointer" : "default"
              }
            };
          }
        } else {
          // This row is not the selected Row
          return false;
        }
      }
    }
  }

  onClickCalls(data: any) {
    if (this.props.onRowClick) {
      this.props.onRowClick(data);
    }
    if (this.props.onChangeSelectedRow) {
      this.props.onChangeSelectedRow(data);
    }
  }

  renderRow(colDef: IColDef<T>[], data: any, key: number) {
    const renderIndicator =
      this.props.renderExpansionIndicator || this.renderExpansionIndicator;
    const props = this.props.rowProps != null && this.props.rowProps(data);
    const selectedRowProps = this.getSelectedRowProps(data);
    const result = [
      <TableRow
        key={key}
        style={{
          background: this.props.alternateRowBackgroundColor != null
            ? (key % 2 ? this.props.alternateRowBackgroundColor : "white")
            : undefined,
          cursor: this.props.onRowClick ? "pointer" : "default"
        }}
        onClick={() => this.onClickCalls(data)}
        {...props}
        {...selectedRowProps}
      >
        {this.props.subComponent &&
          this.renderCell(
            {
              header: "",
              prop: "",
              props: () => ({
                onClick: (e: React.MouseEvent) =>
                  this.handleExpansionClick(e, key)
              }),
              render: () =>
                renderIndicator(this.state.showSubComponent[key] === true)
            },
            data,
            -1,
            {width: "1%", style: {paddingRight: 0}}
          )}
        {colDef.map((def, idx) => this.renderCell(def, data, idx))}
      </TableRow>
    ];

    if (this.props.subComponent && this.state.showSubComponent[key]) {
      result.push(
        <TableRow key={-1}>
          <TableCell colSpan={colDef.length + 1}>
            {this.props.subComponent(data)}
          </TableCell>
        </TableRow>
      );
    }

    return result;
  }

  renderCell(colDef: IColDef<T>, data: any, idx: number, props?: object) {
    const ps = {
      // IMPORTANT: The order of the following lines matters:
      // ...this.ellipsisToCss(this.props.ellipsis),
      // generated style props for alignment
      ...this.alignToCss(colDef.align),
      // table-wide cell props.
      ...(this.props.cellProps != null
        ? this.props.cellProps(data)
        : undefined),
      // specific cell props
      ...(colDef.props != null ? {...props, ...colDef.props(data)} : props)
    };
    if (colDef.render != null) {
      return (
        <TableCell key={idx} {...ps}>
          {colDef.render(data)}
        </TableCell>
      );
    }
    const val =
      colDef.accessor != null ? colDef.accessor(data) : data[colDef.prop];
    return (
      <TableCell key={idx} {...ps}>
        {val}
      </TableCell>
    );
  }

  renderHeader(colDef: IColDef<T>[]) {
    const totalWidth = sumBy(colDef, x => x.width || 0);

    const render =
      this.props.renderHeaderCell != null
        ? this.props.renderHeaderCell.bind(this)
        : this.renderHeaderCell.bind(this);

    function renderSubComponentSpacer(subComponent?: (data: any) => React.ReactNode) {
      return subComponent != null
        ? render(
          {prop: "", header: ""},
          -1,
          {
            width: "1%",
            style: {paddingRight: 0}
          },
          totalWidth
        )
        : null;
    }

    return (
      <TableHead>
        <TableRow>
          {renderSubComponentSpacer(this.props.subComponent)}
          {colDef.map((col: IColDef<T>, idx) =>
            render(col, idx, undefined, totalWidth)
          )}
        </TableRow>
        {this.isFilterable && (
          <TableRow>
            {renderSubComponentSpacer(this.props.subComponent)}
            {colDef.map((def, idx) => (
              <TableCell key={idx}>
                {def.filterable
                  ? this.props.renderFilter != null
                    ? this.props.renderFilter(def, idx)
                    : this.renderFilter(def)
                  : null}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableHead>
    );
  }


  renderHeaderCell(
    colDef: IColDef<T>,
    idx: number,
    props?: object,
    totalWidth?: number
  ) {
    const ps = {...props, ...this.alignToCss(colDef.align)};
    const isSorted = this.props.orderBy === colDef.prop;
    const showSortHint = colDef.sortable === true
      && this.props.orderBy !== colDef.prop
      && this.props.renderSortHint != null;
    const showSortLabel = this.props.orderBy != null
      && this.props.orderBy === colDef.prop
      && this.props.renderSortLabel != null;

    return (
      <TableCell
        key={idx}
        variant="head"
        style={{cursor: colDef.sortable ? "pointer" : ""}}
        {...colDef.headerProps}
        onClick={() => colDef.sortable && this.handleChangeSort(colDef.prop)}
        {...ps}
        width={
          colDef.width ? `${(colDef.width! / totalWidth!) * 100}%` : undefined
        }
      >
        <>
          {colDef.header}
          {colDef.sortable && showSortHint && this.props.renderSortHint!(colDef)}
          {colDef.sortable
            ? (showSortLabel && this.props.renderSortLabel
              ? this.props.renderSortLabel(colDef, this.props.sort === "desc")
              : <TableSortLabel active={isSorted} direction={this.props.sort}/>)
            : null}
        </>
      </TableCell>
    );
  }

  renderSortLabel(colDef: IColDef<T>, desc: boolean) {
    return <TableSortLabel active direction={desc ? "desc" : "asc"}/>
  }

  renderExpansionIndicator(expanded: boolean) {
    return <IconButton
      style={{
        transition: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        transform: `rotate(${expanded ? 0 : -90}deg)`
      }}
    >
      <ExpandMore/>
    </IconButton>
  }

  renderFilter(colDef: IColDef<T>) {
    const propName = colDef.prop.toString();
    let input = (
      <input
        type="text"
        name={propName}
        value={this.filter[propName] || ""}
        onChange={e => this.handleFilterChange(colDef.prop, e.target.value)}
      />
    );

    if (this.props.filterBlur === true) {
      input = (
        <input
          type="text"
          name={propName}
          onKeyDown={e => {
            if (e.code === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onBlur={e => {
            this.handleFilterChange(colDef.prop, e.target.value);
          }}
        />
      );
    }

    return colDef.renderFilter
      ? colDef.renderFilter(this.filter[propName], (v: any) =>
        this.handleFilterChange(colDef.prop, v)
      )
      : input;
  }

  renderFooter(colDef: IColDef<T>[], data: any[]) {
    return (
      <TableFooter>
        <TableRow>
          {colDef.map((def, idx) =>
            this.props.renderFooterCell != null
              ? this.props.renderFooterCell(def, data, idx)
              : this.renderFooterCell(def, data, idx)
          )}
        </TableRow>
      </TableFooter>
    );
  }

  renderFooterCell(colDef: IColDef<T>, data: T[], idx: number) {
    const ps = this.alignToCss(colDef.align);
    return (
      <TableCell key={idx} variant="footer" {...colDef.footerProps} {...ps}>
        {colDef.footer != null
          ? typeof colDef.footer === "string"
            ? colDef.footer
            : colDef.footer!(colDef, data)
          : null}
      </TableCell>
    );
  }

  generateColDef(_: any[]): IColDef<T>[] {
    return [];
  }

  handleChangeSort = (orderBy: PropType<T>) => {
    if (this.props.onChangeOrderBy) {
      this.props.onChangeOrderBy(orderBy);
    }
  };

  handleFilterChange = (orderBy: PropType<T>, value: any) => {
    const name = orderBy;

    function callHandler(fn?: ChangeFilterHandler<T>) {
      if (fn != null) {
        fn(orderBy, value);
      }
    }

    if (this.props.filter != null) {
      callHandler(this.props.onChangeFilter);
    } else {
      this.setState(
        p => ({
          filter: {
            ...p.filter,
            [name]: value
          }
        }),
        () => callHandler(this.props.onChangeFilter)
      );
    }
  };

  handleExpansionClick = (e: React.MouseEvent, key: number) => {
    e.stopPropagation();
    this.toggleSubmenu(key);
  };

  private toggleSubmenu = (key: number) => {
    this.setState(prev => ({
      showSubComponent: {
        ...prev.showSubComponent,
        [key]: !prev.showSubComponent[key]
      }
    }));
  };

  private alignToCss(align?: "left" | "center" | "right") {
    return align != null ? {style: {textAlign: align}} : undefined;
  }

  /*private ellipsisToCss(ellipsis?: boolean) {
    return ellipsis === true
      ? {
        style: {
          whiteSpace: "nowrap",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "auto"
        }
      }
      : undefined;
  }*/
}
