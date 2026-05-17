export type Note = {
  name: string;
  midiNumber: number;
};

export type Tuning = {
  a4Frequency: number;
  a4MidiNumber: number;
};

export const defaultTuning: Tuning = {
  a4Frequency: 440,
  a4MidiNumber: 69,
};

export function createNote(name: string, midiNumber: number): Note {
  return { name, midiNumber };
}

export function frequencyForNote(note: Note, tuning: Tuning = defaultTuning) {
  return tuning.a4Frequency * 2 ** ((note.midiNumber - tuning.a4MidiNumber) / 12);
}
