import * as React from "react";
import {cleanup, render} from "@testing-library/react"
import {TableMui} from "../TableMui";

afterEach(cleanup);

it("should render", () => {
  render(<TableMui data={[]}  />);
});

it("should prevent not allowed properties", () => {
  const data : SomeModel[] = [{a: "1", b: 1, c: true}]
  render(<TableMui data={data} colDef={[{prop: "a", header: "correct"}]}  />);
});

interface SomeModel {
  a: string;
  b: number;
  c: boolean;
}
