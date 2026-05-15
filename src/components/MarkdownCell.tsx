import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Cell } from '../types';

interface MarkdownCellProps {
  cell: Cell;
  onSourceChange: (source: string) => void;
  onRun: () => void;
  onEdit: () => void;
}

export function MarkdownCell({ cell, onSourceChange, onRun, onEdit }: MarkdownCellProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (cell.mode === 'edit' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [cell.mode]);

  if (cell.mode === 'edit') {
    return (
      <textarea
        ref={textareaRef}
        className="cell-textarea"
        value={cell.source}
        placeholder="Write Markdown here…"
        onChange={(e) => onSourceChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            onRun();
          }
        }}
        rows={Math.max(3, cell.source.split('\n').length + 1)}
      />
    );
  }

  return (
    <div
      className="cell-rendered cell-rendered-md"
      onDoubleClick={onEdit}
      title="Double-click to edit"
    >
      {cell.source.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cell.source}</ReactMarkdown>
      ) : (
        <em className="cell-empty">Empty markdown cell — double-click to edit.</em>
      )}
    </div>
  );
}
