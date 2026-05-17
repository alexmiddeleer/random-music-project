import { createNote } from '../music/music';
import type { Beat, Composition, Score, ScoreEvent } from '../composition/composition';

const eighth: Beat = { count: 1, unit: 8 };
const quarter: Beat = { count: 1, unit: 4 };
const half: Beat = { count: 1, unit: 2 };
const dottedHalf: Beat = { count: 3, unit: 4 };

const notes = new Map([
  ['G4', createNote('G4', 67)],
  ['A4', createNote('A4', 69)],
  ['B4', createNote('B4', 71)],
  ['C5', createNote('C5', 72)],
  ['D5', createNote('D5', 74)],
  ['E5', createNote('E5', 76)],
  ['F5', createNote('F5', 77)],
  ['G5', createNote('G5', 79)],
]);

export function createHappyBirthdayComposition(): Composition {
  return {
    id: 'happy-birthday',
    title: 'Happy Birthday',
    scores: [createHappyBirthdayScore()],
  };
}

function createHappyBirthdayScore(): Score {
  return {
    tempo: { beatsPerMinute: 120, beatUnit: 4 },
    timeSignature: { beatsPerMeasure: 3, beatUnit: 4 },
    measures: [
      { duration: quarter },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
      { duration: dottedHalf },
    ],
    parts: [
      {
        id: 'melody',
        label: 'Melody',
        events: [
          note('hb-melody-001', 'G4', 0, { count: 0, unit: 4 }, eighth),
          note('hb-melody-002', 'G4', 0, { count: 1, unit: 8 }, eighth),
          note('hb-melody-003', 'A4', 1, { count: 0, unit: 4 }, quarter),
          note('hb-melody-004', 'G4', 1, quarter, quarter),
          note('hb-melody-005', 'C5', 1, half, quarter),
          note('hb-melody-006', 'B4', 2, { count: 0, unit: 4 }, half),
          note('hb-melody-007', 'G4', 2, half, eighth),
          note('hb-melody-008', 'G4', 2, { count: 5, unit: 8 }, eighth),
          note('hb-melody-009', 'A4', 3, { count: 0, unit: 4 }, quarter),
          note('hb-melody-010', 'G4', 3, quarter, quarter),
          note('hb-melody-011', 'D5', 3, half, quarter),
          note('hb-melody-012', 'C5', 4, { count: 0, unit: 4 }, half),
          note('hb-melody-013', 'G4', 4, half, eighth),
          note('hb-melody-014', 'G4', 4, { count: 5, unit: 8 }, eighth),
          note('hb-melody-015', 'G5', 5, { count: 0, unit: 4 }, quarter),
          note('hb-melody-016', 'E5', 5, quarter, quarter),
          note('hb-melody-017', 'C5', 5, half, quarter),
          note('hb-melody-018', 'B4', 6, { count: 0, unit: 4 }, quarter),
          note('hb-melody-019', 'A4', 6, quarter, half),
          note('hb-melody-020', 'F5', 7, { count: 0, unit: 4 }, eighth),
          note('hb-melody-021', 'F5', 7, { count: 1, unit: 8 }, eighth),
          note('hb-melody-022', 'E5', 7, quarter, quarter),
          note('hb-melody-023', 'C5', 7, half, quarter),
          note('hb-melody-024', 'D5', 8, { count: 0, unit: 4 }, quarter),
          note('hb-melody-025', 'C5', 8, quarter, half),
        ],
      },
    ],
  };
}

function note(id: string, noteName: string, measureIndex: number, beat: Beat, duration: Beat): ScoreEvent {
  const noteValue = notes.get(noteName);

  if (!noteValue) {
    throw new Error(`Missing Happy Birthday note ${noteName}`);
  }

  return {
    id,
    kind: 'note',
    note: noteValue,
    position: { measureIndex, beat },
    duration,
  };
}
