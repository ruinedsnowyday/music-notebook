import abcjs from 'abcjs';

export interface Instrument {
  label: string;
  program: number;
}

export const INSTRUMENTS: Instrument[] = [
  { label: 'Piano', program: 0 },
  { label: 'Violin', program: 40 },
  { label: 'Flute', program: 73 },
];

export const DEFAULT_PROGRAM = 0;

function withInstrument(source: string, program: number): string {
  if (program === DEFAULT_PROGRAM) return source;
  const directive = `%%MIDI program ${program}`;
  const lines = source.split('\n');
  const kIdx = lines.findIndex((l) => /^K\s*:/.test(l));
  if (kIdx === -1) return `${directive}\n${source}`;
  return [...lines.slice(0, kIdx + 1), directive, ...lines.slice(kIdx + 1)].join('\n');
}

export interface RenderResult {
  ok: boolean;
  error?: string;
  visualObj?: unknown;
}

export function renderAbcInto(target: HTMLElement, source: string): RenderResult {
  try {
    const visualObjs = abcjs.renderAbc(target, source, {
      responsive: 'resize',
      add_classes: true,
    });
    const visualObj = visualObjs?.[0];
    if (!visualObj) {
      return { ok: false, error: 'No music parsed from source.' };
    }
    return { ok: true, visualObj };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function isSynthSupported(): boolean {
  try {
    return abcjs.synth.supportsAudio();
  } catch {
    return false;
  }
}

export interface PlayHandle {
  stop(): void;
}

export async function playAbc(source: string, program = DEFAULT_PROGRAM): Promise<PlayHandle> {
  const visualObj = abcjs.renderAbc('*', withInstrument(source, program))[0];
  if (!visualObj) throw new Error('Cannot parse music.');

  const synth = new abcjs.synth.CreateSynth();
  await synth.init({ visualObj });
  await synth.prime();
  synth.start();

  return {
    stop() {
      try {
        synth.stop();
      } catch {
        // ignore
      }
    },
  };
}
