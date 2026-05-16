import type { PianoConfig } from './piano';

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const lowerRowCodes = [
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Digit0',
  'Minus',
  'Equal',
] as const;
const lowerRowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='] as const;
const upperRowCodes = [
  'KeyQ',
  'KeyW',
  'KeyE',
  'KeyR',
  'KeyT',
  'KeyY',
  'KeyU',
  'KeyI',
  'KeyO',
  'KeyP',
  'BracketLeft',
  'BracketRight',
] as const;
const upperRowLabels = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'] as const;

function createOctaveKeys(octave: number, midiStart: number, codes: readonly string[], labels: readonly string[]) {
  return noteNames.map((noteName, index) => {
    const note = `${noteName}${octave}`;

    return {
      id: note,
      note: {
        name: note,
        midiNumber: midiStart + index,
      },
      keyboardCode: codes[index],
      keyboardLabel: labels[index],
      color: noteName.includes('#') ? 'black' : 'white',
    };
  });
}

export const defaultPianoConfig: PianoConfig = {
  keys: [
    ...createOctaveKeys(4, 60, lowerRowCodes, lowerRowLabels),
    ...createOctaveKeys(5, 72, upperRowCodes, upperRowLabels),
  ],
  tuning: {
    a4Frequency: 440,
    a4MidiNumber: 69,
  },
  get keyboardMap() {
    return Object.fromEntries(this.keys.map((key) => [key.keyboardCode, key.id]));
  },
};
