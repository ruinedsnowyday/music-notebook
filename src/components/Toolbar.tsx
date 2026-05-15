interface ToolbarProps {
  onAddMarkdown: () => void;
  onAddMusic: () => void;
  onReset: () => void;
}

export function Toolbar({ onAddMarkdown, onAddMusic, onReset }: ToolbarProps) {
  return (
    <header className="toolbar">
      <h1 className="toolbar-title">music-notebook</h1>
      <div className="toolbar-actions">
        <button type="button" onClick={onAddMarkdown}>
          + Markdown
        </button>
        <button type="button" onClick={onAddMusic}>
          + Music
        </button>
        <button
          type="button"
          className="toolbar-reset"
          onClick={() => {
            if (confirm('Reset notebook to the sample? This deletes all current cells.')) {
              onReset();
            }
          }}
        >
          Reset
        </button>
      </div>
    </header>
  );
}
