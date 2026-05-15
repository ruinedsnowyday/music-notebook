import type { Notebook } from '../types';

const KEY = 'music-notebook/v1/current';

export function loadNotebook(): Notebook | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Notebook;
    if (parsed.version !== 1 || !Array.isArray(parsed.cells)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveNotebook(nb: Notebook): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(nb));
  } catch {
    // localStorage may be full or disabled; failing silently is fine for v1
  }
}

export function clearNotebook(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
