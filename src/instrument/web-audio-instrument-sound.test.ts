import { describe, expect, it, vi } from 'vitest';

import { createNote } from '../music/music';
import { createWebAudioInstrumentSound } from './web-audio-instrument-sound';

describe('createWebAudioInstrumentSound', () => {
  it('starts and stops a Voice for a pitched Control', () => {
    const oscillator = {
      type: 'sine',
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const gain = {
      gain: {
        value: 0.12,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
      },
      connect: vi.fn(),
    };
    const audioContext = {
      currentTime: 2,
      destination: {},
      resume: vi.fn(),
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gain),
    } as unknown as AudioContext;
    const sound = createWebAudioInstrumentSound({ createAudioContext: () => audioContext });

    const voiceId = sound.startVoice({ id: 'element-a4', label: 'A4', note: createNote('A4', 69) });
    sound.stopVoice(voiceId);

    expect(oscillator.frequency.value).toBe(440);
    expect(oscillator.start).toHaveBeenCalledExactlyOnceWith(2);
    expect(oscillator.stop).toHaveBeenCalledExactlyOnceWith(2.09);
  });
});
