import { describe, expect, it } from 'vitest';

import { createInputMapping } from './input-mapping';
import { createInstrumentView } from './instrument-view';
import type { InstrumentState } from './instrument';
import type { InstrumentLayout } from './instrument-layout';

const state: InstrumentState = {
  controls: [{ id: 'element-c4', label: 'C4' }],
  activeControlIds: new Set(),
};
const layout: InstrumentLayout = {
  label: 'Test instrument',
  baseControlCount: 1,
  controls: [{ controlId: 'element-c4', layer: 'base' }],
};
const inputMapping = createInputMapping([{ inputCode: 'KeyA', inputLabel: 'a', controlId: 'element-c4' }]);

describe('createInstrumentView', () => {
  it('renders Controls and updates active state', () => {
    const root = document.createElement('main');
    const view = createInstrumentView(root, { initialState: state, layout, inputMapping });

    const element = root.querySelector<HTMLButtonElement>('[data-instrument-control-id="element-c4"]');
    const instrument = root.querySelector<HTMLElement>('.instrument-ui');
    expect(instrument?.style.getPropertyValue('--instrument-base-control-count')).toBe('1');
    expect(element?.textContent).toContain('C4');
    expect(element?.textContent).toContain('a');
    expect(element?.ariaPressed).toBe('false');

    view.update({ ...state, activeControlIds: new Set(['element-c4']) });

    expect(element?.classList.contains('is-active')).toBe(true);
    expect(element?.ariaPressed).toBe('true');
  });
});
