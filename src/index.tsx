import {PropType} from "./IColDef";

export type ChangeFilterHandler<T> = (orderBy: PropType<T>, value: any) => void;

export type SortDirection = "asc" | "desc";


export * from "./TableMui";
