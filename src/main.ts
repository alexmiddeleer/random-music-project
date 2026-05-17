import { createInstrumentApp } from './app/instrument-app';
import { createWebAudioInstrumentSound } from './instrument/web-audio-instrument-sound';
import { createPianoInstrumentPreset } from './presets/piano-instrument-preset';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Missing #app root element');
}

const preset = createPianoInstrumentPreset();

createInstrumentApp(root, {
  preset,
  sound: createWebAudioInstrumentSound({ tuning: preset.tuning }),
});
