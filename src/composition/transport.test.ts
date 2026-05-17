import { describe, expect, it, vi } from 'vitest';

import { createTransport, type Performance } from './composition';

describe('createTransport', () => {
  it('pauses a Performance by stopping only the Voices it started', () => {
    const performance: Performance = {
      actions: [
        { id: 'happy-birthday-start-001', time: 0, kind: 'start-control', partId: 'melody', controlId: 'C4' },
        { id: 'happy-birthday-stop-001', time: 1, kind: 'stop-control', partId: 'melody', controlId: 'C4' },
      ],
    };
    const instrument = {
      startControl: vi.fn(() => 'playback-voice-1'),
      stopVoice: vi.fn(),
    };
    const transport = createTransport(performance, { melody: instrument });

    transport.play();
    transport.pause();

    expect(instrument.startControl).toHaveBeenCalledExactlyOnceWith('C4');
    expect(instrument.stopVoice).toHaveBeenCalledExactlyOnceWith('playback-voice-1');
    expect(transport.getState().status).toBe('paused');
  });

  it('schedules stop actions for started Voices', () => {
    const performance: Performance = {
      actions: [
        { id: 'happy-birthday-start-001', scoreEventId: 'hb-melody-001', time: 0, kind: 'start-control', partId: 'melody', controlId: 'C4' },
        { id: 'happy-birthday-stop-001', scoreEventId: 'hb-melody-001', time: 1, kind: 'stop-control', partId: 'melody', controlId: 'C4' },
      ],
    };
    const scheduledCallbacks: Array<() => void> = [];
    let now = 0;
    const scheduler = {
      now: () => now,
      setTimeout: vi.fn((callback: () => void, _delay: number) => {
        scheduledCallbacks.push(callback);
        return scheduledCallbacks.length;
      }),
      clearTimeout: vi.fn(),
    };
    const instrument = {
      startControl: vi.fn(() => 'playback-voice-1'),
      stopVoice: vi.fn(),
    };
    const transport = createTransport(performance, { melody: instrument }, { scheduler });

    transport.play();
    now = 1001;
    scheduledCallbacks[0]();

    expect(scheduler.setTimeout).toHaveBeenCalledExactlyOnceWith(expect.any(Function), 1000);
    expect(instrument.stopVoice).toHaveBeenCalledExactlyOnceWith('playback-voice-1');
    expect(transport.getState().status).toBe('idle');
  });

  it('notifies observers when playback state changes', () => {
    const performance: Performance = { actions: [] };
    const onStateChange = vi.fn();
    const transport = createTransport(performance, {}, { onStateChange });

    transport.toggle();
    transport.toggle();

    expect(onStateChange).toHaveBeenNthCalledWith(1, {
      status: 'playing',
      positionSeconds: 0,
      playbackRate: 1,
    });
    expect(onStateChange).toHaveBeenNthCalledWith(2, {
      status: 'paused',
      positionSeconds: 0,
      playbackRate: 1,
    });
  });

  it('resumes from the paused Performance position', () => {
    const performance: Performance = {
      actions: [
        { id: 'happy-birthday-start-001', scoreEventId: 'hb-melody-001', time: 0, kind: 'start-control', partId: 'melody', controlId: 'C4' },
        { id: 'happy-birthday-stop-001', scoreEventId: 'hb-melody-001', time: 1, kind: 'stop-control', partId: 'melody', controlId: 'C4' },
      ],
    };
    let now = 0;
    const scheduler = {
      now: () => now,
      setTimeout: vi.fn(() => 1),
      clearTimeout: vi.fn(),
    };
    const instrument = {
      startControl: vi.fn(() => 'playback-voice-1'),
      stopVoice: vi.fn(),
    };
    const transport = createTransport(performance, { melody: instrument }, { scheduler });

    transport.play();
    now = 500;
    transport.pause();
    transport.play();

    expect(transport.getState().positionSeconds).toBe(0.5);
    expect(scheduler.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
    expect(instrument.startControl).toHaveBeenCalledTimes(2);
  });
});
