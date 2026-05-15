import type { Cell as CellModel } from '../types';
import { MarkdownCell } from './MarkdownCell';
import { MusicCell } from './MusicCell';

interface CellProps {
  cell: CellModel;
  index: number;
  total: number;
  onSourceChange: (source: string) => void;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export function Cell({
  cell,
  index,
  total,
  onSourceChange,
  onRun,
  onEdit,
  onDelete,
  onMove,
}: CellProps) {
  const body =
    cell.type === 'markdown' ? (
      <MarkdownCell cell={cell} onSourceChange={onSourceChange} onRun={onRun} onEdit={onEdit} />
    ) : (
      <MusicCell cell={cell} onSourceChange={onSourceChange} onRun={onRun} onEdit={onEdit} />
    );

  return (
    <section className={`cell cell-${cell.type} cell-${cell.mode}`}>
      <div className="cell-gutter">
        <span className="cell-tag">{cell.type}</span>
      </div>
      <div className="cell-body">{body}</div>
      <div className="cell-actions">
        {cell.mode === 'edit' ? (
          <button type="button" onClick={onRun} title="Run (⌘/Ctrl+Enter)">
            Run
          </button>
        ) : (
          <button type="button" onClick={onEdit} title="Edit source">
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={() => onMove('up')}
          disabled={index === 0}
          title="Move up"
          aria-label="Move cell up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove('down')}
          disabled={index === total - 1}
          title="Move down"
          aria-label="Move cell down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Delete this cell?')) onDelete();
          }}
          title="Delete cell"
          aria-label="Delete cell"
        >
          ✕
        </button>
      </div>
    </section>
  );
}
