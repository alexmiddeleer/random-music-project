import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInstrumentApp } from './instrument-app';
import { createPianoInstrumentPreset } from '../presets/piano-instrument-preset';

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe('createInstrumentApp', () => {
  it('starts a Voice and updates the view when mapped input starts an Control', () => {
    const root = document.createElement('main');
    const sound = { startVoice: vi.fn(() => 'voice-1'), stopVoice: vi.fn() };
    const app = createInstrumentApp(root, { preset: createPianoInstrumentPreset(), sound });
    cleanup = app.cleanup;

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Digit1' }));

    const element = root.querySelector<HTMLButtonElement>('[data-instrument-control-id="C4"]');
    expect(sound.startVoice).toHaveBeenCalledTimes(1);
    expect(element?.classList.contains('is-active')).toBe(true);
  });
});
