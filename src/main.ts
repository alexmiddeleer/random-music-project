import { createBrowserKeyboardInput } from './piano/input/browser-keyboard-input';
import { defaultPianoConfig } from './piano/domain/piano-config';
import { createPiano } from './piano/domain/piano';
import { createPianoKeyboardView } from './piano/view/piano-keyboard-view';
import { createWebAudioPianoSound } from './piano/sound/web-audio-piano-sound';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Missing #app root element');
}

const sound = createWebAudioPianoSound(defaultPianoConfig.tuning);
const piano = createPiano(defaultPianoConfig, sound);
const view = createPianoKeyboardView(root, piano.getState());

createBrowserKeyboardInput({
  keyMap: defaultPianoConfig.keyboardMap,
  onPress: (keyId) => {
    piano.pressKey(keyId);
    view.update(piano.getState());
  },
  onRelease: (keyId) => {
    piano.releaseKey(keyId);
    view.update(piano.getState());
  },
});
