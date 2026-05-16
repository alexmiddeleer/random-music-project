import { describe, expect, it, vi } from 'vitest';

import { createPiano, type PianoConfig, type PianoNote } from './piano';

const c4: PianoNote = {
  name: 'C4',
  midiNumber: 60,
};

const d4: PianoNote = {
  name: 'D4',
  midiNumber: 62,
};

const config: PianoConfig = {
  keys: [
    {
      id: 'C4',
      note: c4,
      keyboardCode: 'KeyA',
      keyboardLabel: 'a',
      color: 'white',
    },
    {
      id: 'D4',
      note: d4,
      keyboardCode: 'KeyS',
      keyboardLabel: 's',
      color: 'white',
    },
  ],
  tuning: {
    a4Frequency: 440,
    a4MidiNumber: 69,
  },
  keyboardMap: {
    KeyA: 'C4',
    KeyS: 'D4',
  },
};

describe('createPiano', () => {
  it('starts sound when pressing a known key', () => {
    const sound = { start: vi.fn(), stop: vi.fn() };
    const piano = createPiano(config, sound);

    piano.pressKey('C4');

    expect(sound.start).toHaveBeenCalledExactlyOnceWith(c4);
    expect(piano.getState().pressedKeyIds).toEqual(new Set(['C4']));
  });

  it('does not restart sound while a key is already pressed', () => {
    const sound = { start: vi.fn(), stop: vi.fn() };
    const piano = createPiano(config, sound);

    piano.pressKey('C4');
    piano.pressKey('C4');

    expect(sound.start).toHaveBeenCalledTimes(1);
  });

  it('stops sound when releasing a pressed key', () => {
    const sound = { start: vi.fn(), stop: vi.fn() };
    const piano = createPiano(config, sound);

    piano.pressKey('C4');
    piano.releaseKey('C4');

    expect(sound.stop).toHaveBeenCalledExactlyOnceWith(c4);
    expect(piano.getState().pressedKeyIds).toEqual(new Set());
  });

  it('ignores unknown and unpressed keys', () => {
    const sound = { start: vi.fn(), stop: vi.fn() };
    const piano = createPiano(config, sound);

    piano.pressKey('missing');
    piano.releaseKey('C4');

    expect(sound.start).not.toHaveBeenCalled();
    expect(sound.stop).not.toHaveBeenCalled();
  });

  it('returns a defensive copy of pressed key ids', () => {
    const sound = { start: vi.fn(), stop: vi.fn() };
    const piano = createPiano(config, sound);

    piano.pressKey('C4');
    piano.getState().pressedKeyIds.clear();

    expect(piano.getState().pressedKeyIds).toEqual(new Set(['C4']));
  });
});
