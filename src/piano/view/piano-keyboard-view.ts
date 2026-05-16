import type { PianoKey, PianoState } from '../domain/piano';
import './piano-keyboard.css';

const blackKeyOffsetsBySemitone = new Map([
  [1, 0.7],
  [3, 1.7],
  [6, 3.7],
  [8, 4.7],
  [10, 5.7],
]);

export function createPianoKeyboardView(root: HTMLElement, initialState: PianoState) {
  const keyElements = new Map<string, HTMLElement>();
  const whiteKeys = initialState.keys.filter((key) => key.color === 'white');
  const blackKeys = initialState.keys.filter((key) => key.color === 'black');
  const whiteKeyIndexById = new Map(whiteKeys.map((key, index) => [key.id, index]));

  root.innerHTML = '';
  root.className = 'piano-page';

  const keyboard = document.createElement('section');
  keyboard.className = 'piano-keyboard';
  keyboard.ariaLabel = 'Two-octave piano keyboard';

  const whiteKeyLayer = document.createElement('div');
  whiteKeyLayer.className = 'piano-white-key-layer';

  const blackKeyLayer = document.createElement('div');
  blackKeyLayer.className = 'piano-black-key-layer';

  for (const key of whiteKeys) {
    const keyElement = createKeyElement(key);
    keyElements.set(key.id, keyElement);
    whiteKeyLayer.append(keyElement);
  }

  for (const key of blackKeys) {
    const keyElement = createKeyElement(key);
    const semitone = key.note.midiNumber % 12;
    const octaveStartIndex = Math.floor((key.note.midiNumber - 60) / 12) * 7;
    const offset = blackKeyOffsetsBySemitone.get(semitone) ?? 0;

    keyElement.style.left = `${((octaveStartIndex + offset) / whiteKeys.length) * 100}%`;
    keyElements.set(key.id, keyElement);
    blackKeyLayer.append(keyElement);
  }

  const disclaimer = document.createElement('p');
  disclaimer.className = 'piano-disclaimer';
  disclaimer.textContent = 'Uses physical QWERTY key positions; labels may differ on non-US layouts.';

  keyboard.append(whiteKeyLayer, blackKeyLayer);
  root.append(keyboard, disclaimer);

  function update(state: PianoState) {
    for (const key of state.keys) {
      const keyElement = keyElements.get(key.id);

      if (!keyElement) {
        continue;
      }

      keyElement.classList.toggle('is-pressed', state.pressedKeyIds.has(key.id));
      keyElement.ariaPressed = String(state.pressedKeyIds.has(key.id));
    }
  }

  update(initialState);

  return {
    update,
  };
}

function createKeyElement(key: PianoKey) {
  const keyElement = document.createElement('button');
  keyElement.type = 'button';
  keyElement.className = `piano-key piano-key-${key.color}`;
  keyElement.ariaLabel = `${key.note.name}, keyboard ${key.keyboardLabel}`;
  keyElement.disabled = true;

  const noteLabel = document.createElement('span');
  noteLabel.className = 'piano-note-label';
  noteLabel.textContent = key.note.name;

  const keyboardLabel = document.createElement('span');
  keyboardLabel.className = 'piano-keyboard-label';
  keyboardLabel.textContent = key.keyboardLabel;

  keyElement.append(noteLabel, keyboardLabel);

  return keyElement;
}
