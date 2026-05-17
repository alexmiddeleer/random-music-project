import type { ControlId } from './instrument';
import type { createInputMapping } from './input-mapping';

type BrowserInstrumentInputOptions = {
  inputMapping: ReturnType<typeof createInputMapping>;
  onStartControl(controlId: ControlId): void;
  onStopControl(controlId: ControlId): void;
};

export function createBrowserInstrumentInput({ inputMapping, onStartControl, onStopControl }: BrowserInstrumentInputOptions) {
  function handleKeyDown(event: KeyboardEvent) {
    const controlId = inputMapping.controlIdForInput(event.code);

    if (!controlId || event.repeat) {
      return;
    }

    event.preventDefault();
    onStartControl(controlId);
  }

  function handleKeyUp(event: KeyboardEvent) {
    const controlId = inputMapping.controlIdForInput(event.code);

    if (!controlId) {
      return;
    }

    event.preventDefault();
    onStopControl(controlId);
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}
