import { describe, expect, it } from 'vitest';

import { createNote, defaultTuning, frequencyForNote } from './music';

describe('music domain', () => {
  it('converts a Note to frequency using Tuning', () => {
    expect(frequencyForNote(createNote('A4', 69), defaultTuning)).toBe(440);
    expect(frequencyForNote(createNote('A5', 81), defaultTuning)).toBe(880);
  });
});
