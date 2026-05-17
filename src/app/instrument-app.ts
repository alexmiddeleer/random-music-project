import { createBrowserInstrumentInput } from '../instrument/browser-instrument-input';
import { createInstrument, type InstrumentSound } from '../instrument/instrument';
import type { InstrumentLayout } from '../instrument/instrument-layout';
import { createInstrumentView } from '../instrument/instrument-view';
import type { createInputMapping } from '../instrument/input-mapping';

type InstrumentPreset = {
  instrument: Parameters<typeof createInstrument>[0];
  inputMapping: ReturnType<typeof createInputMapping>;
  layout: InstrumentLayout;
};

type InstrumentAppOptions = {
  preset: InstrumentPreset;
  sound: InstrumentSound;
};

export function createInstrumentApp(root: HTMLElement, { preset, sound }: InstrumentAppOptions) {
  const instrument = createInstrument(preset.instrument, sound);
  const view = createInstrumentView(root, {
    initialState: instrument.getState(),
    layout: preset.layout,
    inputMapping: preset.inputMapping,
  });
  const cleanupInput = createBrowserInstrumentInput({
    inputMapping: preset.inputMapping,
    onStartControl: (controlId) => {
      instrument.startControl(controlId);
      view.update(instrument.getState());
    },
    onStopControl: (controlId) => {
      instrument.stopControl(controlId);
      view.update(instrument.getState());
    },
  });

  return {
    instrument,
    cleanup: cleanupInput,
  };
}
