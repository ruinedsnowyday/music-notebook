# music-notebook

An interactive, ipynb-style notebook for music. Build a vertical stack of cells; each cell is either:

- **Markdown** — write notes in GitHub-flavored Markdown.
- **Music** — write a snippet in [ABC notation](https://abcnotation.com/learn), render it as a music staff, and play it back (Web Audio synth, built into `abcjs`).

Cells are persisted to `localStorage` and survive a page reload.

## Quickstart

```bash
npm install
npm run dev
```

Open the printed URL. The first load seeds a sample notebook (one intro Markdown cell and one C-major-scale music cell).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run typecheck # tsc -b --noEmit
```

## Using the notebook

- **Add cells** with the **+ Markdown** / **+ Music** buttons in the toolbar.
- **Edit / Run.** New cells open in edit mode. Click **Run** (or press ⌘/Ctrl-Enter inside the cell's textarea) to render.
- **Re-edit** a rendered cell by clicking **Edit** in its action column, or double-clicking the rendered area.
- **Reorder** with the ↑ / ↓ buttons, **delete** with ✕.
- **Music cells** show **▶ Play** / **■ Stop** above the staff. The first Play in a session lazy-loads `abcjs`'s default soundfont over the network — give it a beat.

### A taste of ABC

```
X:1
T:Twinkle Twinkle
M:4/4
L:1/4
K:C
CCGG | AAG2 | FFEE | DDC2 |]
```

The [ABC notation cheat sheet](https://abcnotation.com/learn) covers the basics: `X` (index), `T` (title), `M` (meter), `L` (default note length), `K` (key), then notes (`CDEFGAB cdefgab`, `,` / `'` for octaves, `2`/`/2` for durations, `|` barlines).

## Stack

- **Vite + React 18 + TypeScript** — SPA, no SSR overhead.
- **[`abcjs`](https://www.npmjs.com/package/abcjs)** — ABC parsing, staff rendering, and Web Audio playback.
- **`react-markdown` + `remark-gfm`** — Markdown rendering with GFM.
- **State**: `useReducer` in `src/hooks/useNotebook.ts`, persisted via `src/lib/storage.ts` (`localStorage` key `music-notebook/v1/current`).

## Layout

```
src/
├── main.tsx
├── App.tsx
├── types.ts
├── styles.css
├── hooks/useNotebook.ts
├── lib/
│   ├── abc.ts            # abcjs render + synth wrappers
│   └── storage.ts        # localStorage load/save
└── components/
    ├── Toolbar.tsx
    ├── Cell.tsx          # routes by cell.type
    ├── MarkdownCell.tsx
    └── MusicCell.tsx
```

## Agents working here

This repo is developed by multiple AI coding agents working concurrently — at least **Claude Code** and **OpenCode**. Sessions are tracked by [Entire CLI](https://docs.entire.io/), which captures checkpoints on a dedicated `entire/checkpoints/v1` branch (kept out of normal `git log` views).

If you're an agent (or human) about to contribute:

- Treat `src/types.ts` as the shared contract — change it only with intent.
- Prefer **additive commits**; small, focused changes are friendlier to other sessions running on the same commit.
- Try not to edit `package.json`, `vite.config.ts`, or `tsconfig.*.json` simultaneously with another active session.
- One module per session is a good rule of thumb. Markdown cells, music cells, the hook, and the storage layer are each natural seams.
- Entire's `entire/checkpoints/v1` branch is set up automatically. Don't push to it manually; don't merge it into `main`.

## Roadmap (post-v1)

- Import / export notebooks as `.json` files.
- Multiple notebooks + a sidebar to switch between them.
- MusicXML import (one-way) for sharing with MuseScore / Flat.
- Tempo / instrument controls per music cell.
- Optional in-app real-time collaboration (Yjs) — currently out of scope; `entire.io` covers the multi-agent _dev_ workflow, not multi-user app-state collaboration.

## License

MIT (TBD — add a LICENSE file before publishing).
