import abcjs from 'abcjs';

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

export async function playAbc(source: string): Promise<PlayHandle> {
  const visualObj = abcjs.renderAbc('*', source)[0];
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
