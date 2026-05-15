import { useEffect, useReducer } from 'react';
import type { Cell, CellMode, CellType, Notebook } from '../types';
import { loadNotebook, saveNotebook } from '../lib/storage';
import { DEFAULT_PROGRAM } from '../lib/abc';

const SAMPLE_NOTEBOOK: Notebook = {
  version: 1,
  cells: [
    {
      id: 'sample-md',
      type: 'markdown',
      mode: 'render',
      source: [
        '# music-notebook',
        '',
        'An interactive notebook for music. Use the toolbar to add **Markdown** cells (for notes)',
        'or **Music** cells (editable [ABC notation](https://abcnotation.com/) you can render and play).',
        '',
        '> Double-click a rendered cell to edit it. Press **Run** (or ⌘/Ctrl-Enter inside a cell) to re-render.',
      ].join('\n'),
    },
    {
      id: 'sample-music',
      type: 'music',
      mode: 'render',
      source: [
        'X:1',
        'T:C Major Scale',
        'M:4/4',
        'L:1/8',
        'K:C',
        'CDEF GABc | cBAG FEDC |]',
      ].join('\n'),
    },
  ],
};

type Action =
  | { type: 'add'; cellType: CellType }
  | { type: 'update'; id: string; source: string }
  | { type: 'setMode'; id: string; mode: CellMode }
  | { type: 'setInstrument'; id: string; instrument: number }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; direction: 'up' | 'down' }
  | { type: 'reset' };

function newCell(cellType: CellType): Cell {
  return {
    id: crypto.randomUUID(),
    type: cellType,
    mode: 'edit',
    source: cellType === 'markdown' ? '' : 'X:1\nT:Untitled\nM:4/4\nL:1/8\nK:C\n',
    ...(cellType === 'music' ? { instrument: DEFAULT_PROGRAM } : {}),
  };
}

function reducer(state: Notebook, action: Action): Notebook {
  switch (action.type) {
    case 'add':
      return { ...state, cells: [...state.cells, newCell(action.cellType)] };
    case 'update':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.id ? { ...c, source: action.source } : c)),
      };
    case 'setMode':
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.id ? { ...c, mode: action.mode } : c)),
      };
    case 'setInstrument':
      return {
        ...state,
        cells: state.cells.map((c) =>
          c.id === action.id ? { ...c, instrument: action.instrument } : c,
        ),
      };
    case 'delete':
      return { ...state, cells: state.cells.filter((c) => c.id !== action.id) };
    case 'move': {
      const i = state.cells.findIndex((c) => c.id === action.id);
      if (i === -1) return state;
      const j = action.direction === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= state.cells.length) return state;
      const cells = state.cells.slice();
      const tmp = cells[i]!;
      cells[i] = cells[j]!;
      cells[j] = tmp;
      return { ...state, cells };
    }
    case 'reset':
      return SAMPLE_NOTEBOOK;
  }
}

function initialState(): Notebook {
  return loadNotebook() ?? SAMPLE_NOTEBOOK;
}

export function useNotebook() {
  const [notebook, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    saveNotebook(notebook);
  }, [notebook]);

  return {
    notebook,
    addCell: (cellType: CellType) => dispatch({ type: 'add', cellType }),
    updateSource: (id: string, source: string) => dispatch({ type: 'update', id, source }),
    setMode: (id: string, mode: CellMode) => dispatch({ type: 'setMode', id, mode }),
    setInstrument: (id: string, instrument: number) =>
      dispatch({ type: 'setInstrument', id, instrument }),
    deleteCell: (id: string) => dispatch({ type: 'delete', id }),
    moveCell: (id: string, direction: 'up' | 'down') => dispatch({ type: 'move', id, direction }),
    reset: () => dispatch({ type: 'reset' }),
  };
}
