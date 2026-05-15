import type { Notebook } from '../types';

export function notebookToMarkdown(notebook: Notebook): string {
  return notebook.cells
    .map((cell) => {
      const source = cell.source.trim();

      if (cell.type === 'markdown') {
        return source;
      }

      return ['```abc', source, '```'].join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

export function downloadMarkdown(notebook: Notebook): void {
  const markdown = notebookToMarkdown(notebook);
  const blob = new Blob([markdown.endsWith('\n') ? markdown : `${markdown}\n`], {
    type: 'text/markdown;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `music-notebook-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
