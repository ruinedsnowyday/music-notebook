import { useNotebook } from './hooks/useNotebook';
import { Toolbar } from './components/Toolbar';
import { Cell } from './components/Cell';

export function App() {
  const {
    notebook,
    addCell,
    updateSource,
    setMode,
    deleteCell,
    moveCell,
    reset,
  } = useNotebook();

  return (
    <div className="app">
      <Toolbar
        onAddMarkdown={() => addCell('markdown')}
        onAddMusic={() => addCell('music')}
        onReset={reset}
      />
      <main className="notebook">
        {notebook.cells.length === 0 ? (
          <p className="empty-note">
            Empty notebook. Add a cell with the buttons above.
          </p>
        ) : (
          notebook.cells.map((cell, i) => (
            <Cell
              key={cell.id}
              cell={cell}
              index={i}
              total={notebook.cells.length}
              onSourceChange={(source) => updateSource(cell.id, source)}
              onRun={() => setMode(cell.id, 'render')}
              onEdit={() => setMode(cell.id, 'edit')}
              onDelete={() => deleteCell(cell.id)}
              onMove={(direction) => moveCell(cell.id, direction)}
            />
          ))
        )}
      </main>
    </div>
  );
}
