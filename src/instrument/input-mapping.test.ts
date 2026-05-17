import { describe, expect, it } from 'vitest';

import { createInputMapping, type InputBinding } from './input-mapping';

const bindings: InputBinding[] = [
  { inputCode: 'Digit1', inputLabel: '1', controlId: 'element-c4' },
  { inputCode: 'Digit2', inputLabel: '2', controlId: 'element-d4' },
];

describe('createInputMapping', () => {
  it('maps physical input positions to Controls', () => {
    const map = createInputMapping(bindings);

    expect(map.controlIdForInput('Digit1')).toBe('element-c4');
    expect(map.labelForControl('element-d4')).toBe('2');
    expect(map.controlIdForInput('KeyQ')).toBeUndefined();
  });
});
