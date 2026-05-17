import { describe, expect, it, vi } from 'vitest';

import { createNote } from '../music/music';
import { createInstrument, type InstrumentConfig } from './instrument';

const c4 = createNote('C4', 60);

const config: InstrumentConfig = {
  controls: [
    {
      id: 'element-c4',
      label: 'C4',
      note: c4,
    },
  ],
};

describe('createInstrument', () => {
  it('starts and stops a Voice for an Control', () => {
    const sound = { startVoice: vi.fn(() => 'voice-1'), stopVoice: vi.fn() };
    const instrument = createInstrument(config, sound);

    const voiceId = instrument.startControl('element-c4');
    instrument.stopControl('element-c4');

    expect(voiceId).toBe('voice-1');
    expect(sound.startVoice).toHaveBeenCalledExactlyOnceWith(config.controls[0]);
    expect(sound.stopVoice).toHaveBeenCalledExactlyOnceWith('voice-1');
    expect(instrument.getState().activeControlIds).toEqual(new Set());
  });

  it('can stop one Voice while another Voice for the same Control keeps sounding', () => {
    const sound = {
      startVoice: vi.fn().mockReturnValueOnce('voice-1').mockReturnValueOnce('voice-2'),
      stopVoice: vi.fn(),
    };
    const instrument = createInstrument(config, sound);

    expect(instrument.startControl('element-c4')).toBe('voice-1');
    expect(instrument.startControl('element-c4')).toBe('voice-2');
    instrument.stopVoice('voice-1');

    expect(sound.startVoice).toHaveBeenCalledTimes(2);
    expect(sound.stopVoice).toHaveBeenCalledExactlyOnceWith('voice-1');
    expect(instrument.getState().activeControlIds).toEqual(new Set(['element-c4']));

    instrument.stopVoice('voice-2');

    expect(instrument.getState().activeControlIds).toEqual(new Set());
  });
});
