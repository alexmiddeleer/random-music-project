import type { PianoKeyId } from '../domain/piano';

type BrowserKeyboardInputOptions = {
  keyMap: Record<string, PianoKeyId>;
  onPress(keyId: PianoKeyId): void;
  onRelease(keyId: PianoKeyId): void;
};

export function createBrowserKeyboardInput({ keyMap, onPress, onRelease }: BrowserKeyboardInputOptions) {
  function handleKeyDown(event: KeyboardEvent) {
    const keyId = keyMap[event.code];

    if (!keyId || event.repeat) {
      return;
    }

    event.preventDefault();
    onPress(keyId);
  }

  function handleKeyUp(event: KeyboardEvent) {
    const keyId = keyMap[event.code];

    if (!keyId) {
      return;
    }

    event.preventDefault();
    onRelease(keyId);
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}
