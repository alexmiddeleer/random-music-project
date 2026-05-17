import { describe, expect, it } from 'vitest';

import { compileScoreToPerformance } from '../composition/composition';
import { createPianoInstrumentPreset } from '../presets/piano-instrument-preset';
import { createHappyBirthdayComposition } from './happy-birthday';

describe('createHappyBirthdayComposition', () => {
  it('provides a bundled Composition that compiles for the piano preset', () => {
    const composition = createHappyBirthdayComposition();
    const score = composition.scores[0];
    const piano = createPianoInstrumentPreset();
    const result = compileScoreToPerformance(score, {
      partInstrumentConfigs: {
        melody: piano.instrument,
      },
    });

    expect(composition.title).toBe('Happy Birthday');
    expect(score.parts).toHaveLength(1);
    expect(result.warnings).toEqual([]);
    expect(result.performance.actions.length).toBeGreaterThan(0);
  });
});
