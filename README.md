# react-table-mui

A npm package that implements react-table-plain for Material-UI.

![travis build](https://img.shields.io/travis/DCCS-IT-Business-Solutions/react-table-mui.svg?style=flat-square)
![npm version](https://img.shields.io/npm/v/react-table-mui.svg?style=flat-square)

## Usage

```typescript jsx

import {TableMui} from "@dccs/react-table-mui";

function List() {
    return <TableMui data={[]} />
}

```

## Version < 1.0

In all versions lower than 1.0 _react-table-mui_ was designed as a theme to _react-table-plain.

Since version 1.0 _react-table-mui_ is a stand alone lib that is fully bound to Mui.

## Usage

```javascript

import { TablePlain } from "@dccs/react-table-plain"
import { tableMuiTheme } from "@dccs/react-table-mui"

function List() {
  return <TablePlain {...tableMuiTheme} data={...} />
}

```
