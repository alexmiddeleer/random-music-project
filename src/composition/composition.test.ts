import { describe, expect, it, vi } from 'vitest';

import { playCompositionActions, type Composition } from './composition';

describe('playCompositionActions', () => {
  it('replays Musical Actions in time order against an Instrument', () => {
    const composition: Composition = {
      actions: [
        { time: 1, kind: 'stop-voice', controlId: 'element-c4' },
        { time: 0, kind: 'start-voice', controlId: 'element-c4' },
      ],
    };
    const instrument = { startControl: vi.fn(), stopControl: vi.fn() };

    playCompositionActions(composition, instrument);

    expect(instrument.startControl).toHaveBeenCalledBefore(instrument.stopControl);
    expect(instrument.startControl).toHaveBeenCalledExactlyOnceWith('element-c4');
    expect(instrument.stopControl).toHaveBeenCalledExactlyOnceWith('element-c4');
  });
});
