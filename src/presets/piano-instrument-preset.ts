import { createInputMapping } from '../instrument/input-mapping';
import type { InstrumentConfig, Control } from '../instrument/instrument';
import type { InstrumentLayout, InstrumentLayoutControl } from '../instrument/instrument-layout';
import { createNote, defaultTuning } from '../music/music';

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const lowerRowCodes = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'] as const;
const lowerRowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='] as const;
const upperRowCodes = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'] as const;
const upperRowLabels = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'] as const;
const raisedOffsetsBySemitone = new Map([
  [1, 0.7],
  [3, 1.7],
  [6, 3.7],
  [8, 4.7],
  [10, 5.7],
]);

function createOctave(octave: number, midiStart: number, codes: readonly string[], labels: readonly string[]) {
  return noteNames.map((noteName, index) => {
    const id = `${noteName}${octave}`;
    const note = createNote(id, midiStart + index);

    return {
      element: { id, label: id, note },
      binding: { inputCode: codes[index], inputLabel: labels[index], controlId: id },
    };
  });
}

export function createPianoInstrumentPreset() {
  const entries = [
    ...createOctave(4, 60, lowerRowCodes, lowerRowLabels),
    ...createOctave(5, 72, upperRowCodes, upperRowLabels),
  ];
  const controls: Control[] = entries.map((entry) => entry.element);
  const baseControls = controls.filter((element) => !element.note?.name.includes('#'));
  const layoutControls: InstrumentLayoutControl[] = controls.map((element) => {
    const semitone = element.note ? element.note.midiNumber % 12 : 0;
    const raisedOffset = raisedOffsetsBySemitone.get(semitone);
    const octaveStartIndex = element.note ? Math.floor((element.note.midiNumber - 60) / 12) * 7 : 0;

    return {
      controlId: element.id,
      layer: raisedOffset === undefined ? 'base' : 'raised',
      leftPercent: raisedOffset === undefined ? undefined : ((octaveStartIndex + raisedOffset) / baseControls.length) * 100,
    };
  });

  return {
    instrument: { controls } satisfies InstrumentConfig,
    tuning: defaultTuning,
    inputMapping: createInputMapping(entries.map((entry) => entry.binding)),
    layout: {
      label: 'Two-octave piano keyboard',
      baseControlCount: baseControls.length,
      controls: layoutControls,
    } satisfies InstrumentLayout,
  };
}
