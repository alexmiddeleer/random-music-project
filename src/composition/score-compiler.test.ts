import { describe, expect, it } from 'vitest';

import { compileScoreToPerformance, type Score } from './composition';
import { createNote } from '../music/music';

describe('compileScoreToPerformance', () => {
  it('converts Score notes from musical Beats into Performance actions in seconds', () => {
    const score: Score = {
      tempo: { beatsPerMinute: 120, beatUnit: 4 },
      timeSignature: { beatsPerMeasure: 3, beatUnit: 4 },
      measures: [{ duration: { count: 3, unit: 4 } }],
      parts: [
        {
          id: 'melody',
          label: 'Melody',
          events: [
            {
              id: 'note-001',
              kind: 'note',
              note: createNote('C4', 60),
              position: { measureIndex: 0, beat: { count: 0, unit: 4 } },
              duration: { count: 1, unit: 4 },
            },
          ],
        },
      ],
    };
    const result = compileScoreToPerformance(score, {
      partInstrumentConfigs: {
        melody: { controls: [{ id: 'piano-c4', label: 'C4', note: createNote('C4', 60) }] },
      },
    });

    expect(result.warnings).toEqual([]);
    expect(result.performance.actions).toEqual([
      { id: 'note-001-start', scoreEventId: 'note-001', time: 0, kind: 'start-control', partId: 'melody', controlId: 'piano-c4' },
      { id: 'note-001-stop', scoreEventId: 'note-001', time: 0.5, kind: 'stop-control', partId: 'melody', controlId: 'piano-c4' },
    ]);
  });

  it('warns when a Score note cannot be played and leaves silence in the Performance', () => {
    const missingNote = createNote('G6', 91);
    const score: Score = {
      tempo: { beatsPerMinute: 120, beatUnit: 4 },
      timeSignature: { beatsPerMeasure: 3, beatUnit: 4 },
      measures: [{ duration: { count: 3, unit: 4 } }],
      parts: [
        {
          id: 'melody',
          label: 'Melody',
          events: [
            {
              id: 'note-002',
              kind: 'note',
              note: missingNote,
              position: { measureIndex: 0, beat: { count: 0, unit: 4 } },
              duration: { count: 1, unit: 4 },
            },
          ],
        },
      ],
    };
    const result = compileScoreToPerformance(score, {
      partInstrumentConfigs: {
        melody: { controls: [{ id: 'piano-c4', label: 'C4', note: createNote('C4', 60) }] },
      },
    });

    expect(result.performance.actions).toEqual([]);
    expect(result.warnings).toEqual([
      {
        partId: 'melody',
        eventId: 'note-002',
        message: 'Part Melody: note G6 has no matching Control; it will sound as a rest.',
      },
    ]);
    expect(score.parts[0].events[0].note).toBe(missingNote);
  });
});
