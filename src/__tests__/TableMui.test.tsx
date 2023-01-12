import * as React from "react";
import {cleanup, render} from "@testing-library/react"
import {TableMui} from "../TableMui";

afterEach(cleanup);

it("should render", () => {
  render(<TableMui data={[]}  />);
});
