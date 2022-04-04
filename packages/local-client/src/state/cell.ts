export type CellTypes = 'code' | 'text';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
  tcheck?: TypecheckData[];
}

export interface TypecheckData {
  message: string;
  location: string;
}
