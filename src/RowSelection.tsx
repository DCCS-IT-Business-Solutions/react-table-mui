export enum RowSelectionType {
  "single-line",
  "multi-line",
}
export interface IRowSelectionProps<T> {
  selectedRow?: T | T[];                  // Welche Zeile wird hervorgehoben. Bei einem Array können mehrere Zeilen hervorgehoben werden (optional)
  onChangeSelectedRow?: (data: T) => void;  // Ausgewählte Zeile wurde verändert.
  selectedRowProps?: (data: T) => object;   // Wird pro ausgewählter Zeile aufgerufen. Ergebnis wird den Props der <tr> hinzugefügt.
  columnName: string;                         // Mit welchem Column selectedRow verglichen werden soll
}

export type RowSelectionProps<T> = IRowSelectionProps<T>;
