import { afterEach, describe, expect, it, vi } from 'vitest';

import { createBrowserKeyboardInput } from './browser-keyboard-input';

let cleanup: (() => void) | undefined;

afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

describe('createBrowserKeyboardInput', () => {
  it('calls onPress for mapped non-repeating keydown events', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    cleanup = createBrowserKeyboardInput({
      keyMap: { KeyA: 'C4' },
      onPress,
      onRelease,
    });

    const event = new KeyboardEvent('keydown', { code: 'KeyA', cancelable: true });
    window.dispatchEvent(event);

    expect(onPress).toHaveBeenCalledExactlyOnceWith('C4');
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores repeated and unmapped keydown events', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    cleanup = createBrowserKeyboardInput({
      keyMap: { KeyA: 'C4' },
      onPress,
      onRelease,
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA', repeat: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyB' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('calls onRelease for mapped keyup events', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    cleanup = createBrowserKeyboardInput({
      keyMap: { KeyA: 'C4' },
      onPress,
      onRelease,
    });

    const event = new KeyboardEvent('keyup', { code: 'KeyA', cancelable: true });
    window.dispatchEvent(event);

    expect(onRelease).toHaveBeenCalledExactlyOnceWith('C4');
    expect(event.defaultPrevented).toBe(true);
  });

  it('removes event listeners during cleanup', () => {
    const onPress = vi.fn();
    const onRelease = vi.fn();

    cleanup = createBrowserKeyboardInput({
      keyMap: { KeyA: 'C4' },
      onPress,
      onRelease,
    });

    cleanup();
    cleanup = undefined;
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(onRelease).not.toHaveBeenCalled();
  });
});
