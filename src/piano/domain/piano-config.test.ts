import { describe, expect, it } from 'vitest';

import { defaultPianoConfig } from './piano-config';

describe('defaultPianoConfig', () => {
  it('creates two complete octaves', () => {
    expect(defaultPianoConfig.keys).toHaveLength(24);
    expect(defaultPianoConfig.keys[0]).toMatchObject({
      id: 'C4',
      note: { name: 'C4', midiNumber: 60 },
      keyboardCode: 'Digit1',
      keyboardLabel: '1',
      color: 'white',
    });
    expect(defaultPianoConfig.keys.at(-1)).toMatchObject({
      id: 'B5',
      note: { name: 'B5', midiNumber: 83 },
      keyboardCode: 'BracketRight',
      keyboardLabel: ']',
      color: 'white',
    });
  });

  it('marks sharp notes as black keys', () => {
    const keysById = new Map(defaultPianoConfig.keys.map((key) => [key.id, key]));

    expect(keysById.get('C#4')?.color).toBe('black');
    expect(keysById.get('D#4')?.color).toBe('black');
    expect(keysById.get('F4')?.color).toBe('white');
  });

  it('maps physical keyboard codes to piano key ids', () => {
    expect(defaultPianoConfig.keyboardMap).toMatchObject({
      Digit1: 'C4',
      Equal: 'B4',
      KeyQ: 'C5',
      BracketRight: 'B5',
    });
  });
});
