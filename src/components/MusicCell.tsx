import { useEffect, useRef, useState } from 'react';
import type { Cell } from '../types';
import {
  renderAbcInto,
  playAbc,
  isSynthSupported,
  INSTRUMENTS,
  DEFAULT_PROGRAM,
  type PlayHandle,
} from '../lib/abc';

interface MusicCellProps {
  cell: Cell;
  onSourceChange: (source: string) => void;
  onRun: () => void;
  onEdit: () => void;
  onInstrumentChange: (program: number) => void;
}

export function MusicCell({
  cell,
  onSourceChange,
  onRun,
  onEdit,
  onInstrumentChange,
}: MusicCellProps) {
  const program = cell.instrument ?? DEFAULT_PROGRAM;
  const renderRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const playHandleRef = useRef<PlayHandle | null>(null);

  const [renderError, setRenderError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => {
    if (cell.mode === 'render' && renderRef.current) {
      const result = renderAbcInto(renderRef.current, cell.source);
      setRenderError(result.ok ? null : result.error ?? 'Render failed.');
    }
  }, [cell.mode, cell.source]);

  useEffect(() => {
    if (cell.mode === 'edit' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [cell.mode]);

  useEffect(() => {
    return () => {
      playHandleRef.current?.stop();
      playHandleRef.current = null;
    };
  }, []);

  async function handlePlay() {
    setPlayError(null);
    if (!isSynthSupported()) {
      setPlayError('Audio playback is not supported in this browser.');
      return;
    }
    playHandleRef.current?.stop();
    try {
      const handle = await playAbc(cell.source, program);
      playHandleRef.current = handle;
      setPlaying(true);
    } catch (e) {
      setPlayError(e instanceof Error ? e.message : String(e));
      setPlaying(false);
    }
  }

  function handleInstrumentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = Number(e.target.value);
    if (playing) {
      playHandleRef.current?.stop();
      playHandleRef.current = null;
      setPlaying(false);
    }
    onInstrumentChange(next);
  }

  function handleStop() {
    playHandleRef.current?.stop();
    playHandleRef.current = null;
    setPlaying(false);
  }

  if (cell.mode === 'edit') {
    return (
      <textarea
        ref={textareaRef}
        className="cell-textarea cell-textarea-music"
        value={cell.source}
        placeholder="X:1&#10;T:Title&#10;K:C&#10;CDEF GABc"
        onChange={(e) => onSourceChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            onRun();
          }
        }}
        rows={Math.max(5, cell.source.split('\n').length + 1)}
        spellCheck={false}
      />
    );
  }

  return (
    <div className="cell-rendered cell-rendered-music">
      <div className="music-toolbar">
        {playing ? (
          <button type="button" onClick={handleStop}>
            ■ Stop
          </button>
        ) : (
          <button type="button" onClick={handlePlay}>
            ▶ Play
          </button>
        )}
        <label className="instrument-picker">
          <span className="instrument-label">Instrument</span>
          <select
            value={program}
            onChange={handleInstrumentChange}
            aria-label="Instrument for playback"
          >
            {INSTRUMENTS.map((inst) => (
              <option key={inst.program} value={inst.program}>
                {inst.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={onEdit} title="Edit ABC source">
          Edit
        </button>
      </div>
      <div ref={renderRef} className="music-score" onDoubleClick={onEdit} />
      {renderError && <div className="cell-error">Render error: {renderError}</div>}
      {playError && <div className="cell-error">Playback error: {playError}</div>}
    </div>
  );
}
