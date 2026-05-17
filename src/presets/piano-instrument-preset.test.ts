import { describe, expect, it } from 'vitest';

import { createPianoInstrumentPreset } from './piano-instrument-preset';

describe('createPianoInstrumentPreset', () => {
  it('builds piano Instrument data with Input Mapping and layout metadata', () => {
    const preset = createPianoInstrumentPreset();

    expect(preset.instrument.controls).toHaveLength(24);
    expect(preset.instrument.controls[0]).toMatchObject({ id: 'C4', label: 'C4', note: { name: 'C4', midiNumber: 60 } });
    expect(preset.instrument.controls.at(-1)).toMatchObject({ id: 'B5', label: 'B5', note: { name: 'B5', midiNumber: 83 } });
    expect(preset.inputMapping.controlIdForInput('Digit1')).toBe('C4');
    expect(preset.inputMapping.labelForControl('B5')).toBe(']');
    expect(preset.layout.controls.find((element) => element.controlId === 'C#4')).toMatchObject({ layer: 'raised' });
  });
});
