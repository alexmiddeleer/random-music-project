import { afterEach, describe, expect, it, vi } from 'vitest';

import { createInputMapping } from './input-mapping';
import { createBrowserInstrumentInput } from './browser-instrument-input';

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe('createBrowserInstrumentInput', () => {
  it('starts and stops Controls from mapped browser keyboard events', () => {
    const onStartControl = vi.fn();
    const onStopControl = vi.fn();
    const inputMapping = createInputMapping([{ inputCode: 'KeyA', inputLabel: 'a', controlId: 'element-c4' }]);

    cleanup = createBrowserInstrumentInput({ inputMapping, onStartControl, onStopControl });

    const downEvent = new KeyboardEvent('keydown', { code: 'KeyA', cancelable: true });
    const upEvent = new KeyboardEvent('keyup', { code: 'KeyA', cancelable: true });
    window.dispatchEvent(downEvent);
    window.dispatchEvent(upEvent);

    expect(onStartControl).toHaveBeenCalledExactlyOnceWith('element-c4');
    expect(onStopControl).toHaveBeenCalledExactlyOnceWith('element-c4');
    expect(downEvent.defaultPrevented).toBe(true);
    expect(upEvent.defaultPrevented).toBe(true);
  });

  it('ignores repeated starts and unmapped inputs', () => {
    const onStartControl = vi.fn();
    const onStopControl = vi.fn();
    const inputMapping = createInputMapping([{ inputCode: 'KeyA', inputLabel: 'a', controlId: 'element-c4' }]);

    cleanup = createBrowserInstrumentInput({ inputMapping, onStartControl, onStopControl });

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA', repeat: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));

    expect(onStartControl).not.toHaveBeenCalled();
  });
});
