export type CellType = 'markdown' | 'music';

export type CellMode = 'edit' | 'render';

export interface Cell {
  id: string;
  type: CellType;
  source: string;
  mode: CellMode;
}

export interface Notebook {
  version: 1;
  cells: Cell[];
}
