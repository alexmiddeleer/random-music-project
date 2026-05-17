import { compileScoreToPerformance, createTransport, type PartId } from '../composition/composition';
import { createInstrument, type InstrumentSound } from '../instrument/instrument';
import { createHappyBirthdayComposition } from '../samples/happy-birthday';
import type { createPianoInstrumentPreset } from '../presets/piano-instrument-preset';

type PianoPreset = ReturnType<typeof createPianoInstrumentPreset>;

type HappyBirthdayPocOptions = {
  preset: PianoPreset;
  createSound(): InstrumentSound;
};

export function installHappyBirthdayPoc(root: HTMLElement, { preset, createSound }: HappyBirthdayPocOptions) {
  const panel = document.createElement('section');
  panel.className = 'happy-birthday-poc';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'happy-birthday-poc-button';
  button.textContent = 'Play Happy Birthday';

  panel.append(button);
  root.prepend(panel);

  const composition = createHappyBirthdayComposition();
  const score = composition.scores[0];
  const partInstrumentConfigs = Object.fromEntries(score.parts.map((part) => [part.id, preset.instrument])) as Record<PartId, PianoPreset['instrument']>;
  const { performance, warnings } = compileScoreToPerformance(score, { partInstrumentConfigs });

  for (const warning of warnings) {
    console.warn(warning.message);
  }

  const instrumentByPartId = Object.fromEntries(
    score.parts.map((part) => [part.id, createInstrument(preset.instrument, createSound())]),
  );
  const transport = createTransport(performance, instrumentByPartId, {
    onStateChange: (state) => {
      button.textContent = state.status === 'playing' ? 'Pause Happy Birthday' : state.status === 'paused' ? 'Resume Happy Birthday' : 'Play Happy Birthday';
    },
  });

  button.addEventListener('click', transport.toggle);

  return () => {
    button.removeEventListener('click', transport.toggle);
    transport.dispose();
    panel.remove();
  };
}
