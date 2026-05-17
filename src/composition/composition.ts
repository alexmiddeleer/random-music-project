import type { Control, ControlId, InstrumentConfig, VoiceId } from '../instrument/instrument';
import type { Note } from '../music/music';

export type PartId = string;

export type Composition = {
  id: string;
  title: string;
  scores: Score[];
};

export type PerformanceAction = {
  id: string;
  scoreEventId?: string;
  time: number;
  kind: 'start-control' | 'stop-control';
  partId: PartId;
  controlId: ControlId;
};

export type Performance = {
  actions: PerformanceAction[];
};

export type Beat = {
  count: number;
  unit: number;
};

export type ScoreEvent = {
  id: string;
  kind: 'note' | 'rest';
  note?: Note;
  position: {
    measureIndex: number;
    beat: Beat;
  };
  duration: Beat;
};

export type ScorePart = {
  id: PartId;
  label: string;
  events: ScoreEvent[];
};

export type Score = {
  tempo: {
    beatsPerMinute: number;
    beatUnit: number;
  };
  timeSignature: {
    beatsPerMeasure: number;
    beatUnit: number;
  };
  measures: Array<{ duration?: Beat }>;
  parts: ScorePart[];
};

type PlaybackSetup = {
  partInstrumentConfigs: Record<PartId, InstrumentConfig>;
};

type CompileWarning = {
  partId: PartId;
  eventId: string;
  message: string;
};

type TransportInstrument = {
  startControl(controlId: ControlId): VoiceId | undefined;
  stopVoice(voiceId: VoiceId): void;
};

type TransportState = {
  status: 'idle' | 'playing' | 'paused';
  positionSeconds: number;
  playbackRate: number;
};

type TransportScheduler = {
  now?(): number;
  setTimeout(callback: () => void, delay: number): unknown;
  clearTimeout(timeoutId: unknown): void;
};

type TransportOptions = {
  scheduler?: TransportScheduler;
  onStateChange?(state: TransportState): void;
};

export function compileScoreToPerformance(score: Score, setup: PlaybackSetup): { performance: Performance; warnings: CompileWarning[] } {
  const actions: PerformanceAction[] = [];
  const warnings: CompileWarning[] = [];

  for (const part of score.parts) {
    const controls = setup.partInstrumentConfigs[part.id]?.controls ?? [];

    for (const event of part.events) {
      if (event.kind === 'rest' || !event.note) {
        continue;
      }

      const control = controlForNote(controls, event.note);

      if (!control) {
        warnings.push({
          partId: part.id,
          eventId: event.id,
          message: `Part ${part.label}: note ${event.note.name} has no matching Control; it will sound as a rest.`,
        });
        continue;
      }

      const startTime = secondsForPosition(score, event.position.measureIndex, event.position.beat);
      const stopTime = startTime + secondsForBeat(event.duration, score.tempo);

      actions.push(
        {
          id: `${event.id}-start`,
          scoreEventId: event.id,
          time: startTime,
          kind: 'start-control',
          partId: part.id,
          controlId: control.id,
        },
        {
          id: `${event.id}-stop`,
          scoreEventId: event.id,
          time: stopTime,
          kind: 'stop-control',
          partId: part.id,
          controlId: control.id,
        },
      );
    }
  }

  return { performance: { actions: actions.sort((a, b) => a.time - b.time) }, warnings };
}

function controlForNote(controls: Control[], note: Note) {
  return controls.find((control) => control.note?.midiNumber === note.midiNumber);
}

function secondsForPosition(score: Score, measureIndex: number, beat: Beat) {
  const previousMeasureBeats = score.measures
    .slice(0, measureIndex)
    .reduce((total, measure) => total + tempoBeatsForBeat(measure.duration ?? defaultMeasureDuration(score), score.tempo), 0);

  return (previousMeasureBeats + tempoBeatsForBeat(beat, score.tempo)) * secondsPerTempoBeat(score.tempo);
}

function secondsForBeat(beat: Beat, tempo: Score['tempo']) {
  return tempoBeatsForBeat(beat, tempo) * secondsPerTempoBeat(tempo);
}

function tempoBeatsForBeat(beat: Beat, tempo: Score['tempo']) {
  return (beat.count / beat.unit) / (1 / tempo.beatUnit);
}

function secondsPerTempoBeat(tempo: Score['tempo']) {
  return 60 / tempo.beatsPerMinute;
}

function defaultMeasureDuration(score: Score): Beat {
  return { count: score.timeSignature.beatsPerMeasure, unit: score.timeSignature.beatUnit };
}

export function createTransport(
  performance: Performance,
  instrumentByPartId: Record<PartId, TransportInstrument>,
  { scheduler = globalThis, onStateChange }: TransportOptions = {},
) {
  const state: TransportState = {
    status: 'idle',
    positionSeconds: 0,
    playbackRate: 1,
  };
  const scheduledActions = [...performance.actions].sort((a, b) => a.time - b.time);
  const finalAction = scheduledActions.at(-1);
  const startedVoiceByActionId = new Map<string, { partId: PartId; voiceId: VoiceId }>();
  const startedVoiceByScoreEventId = new Map<string, { partId: PartId; voiceId: VoiceId }>();
  const timeoutIds: unknown[] = [];
  let runStartedAt: number | undefined;

  function play() {
    state.status = 'playing';
    runStartedAt = now();
    notifyStateChange();

    if (state.positionSeconds > 0) {
      restartSoundingEventsAtCurrentPosition();
    }

    for (const action of remainingActions()) {
      const delay = Math.max(0, ((action.time - state.positionSeconds) / state.playbackRate) * 1000);

      if (delay === 0) {
        applyAction(action);
      } else {
        timeoutIds.push(scheduler.setTimeout(() => applyAction(action), delay));
      }
    }
  }

  function pause() {
    updatePosition();
    clearScheduledActions();

    for (const { partId, voiceId } of startedVoiceByActionId.values()) {
      instrumentByPartId[partId]?.stopVoice(voiceId);
    }

    startedVoiceByActionId.clear();
    startedVoiceByScoreEventId.clear();
    state.status = 'paused';
    notifyStateChange();
  }

  function toggle() {
    if (state.status === 'playing') {
      pause();
    } else {
      play();
    }
  }

  function dispose() {
    pause();
    state.status = 'idle';
    state.positionSeconds = 0;
    notifyStateChange();
  }

  function getState(): TransportState {
    return { ...state };
  }

  function remainingActions() {
    return scheduledActions
      .filter((action) => action.time >= state.positionSeconds)
      .sort((a, b) => a.time - b.time);
  }

  function applyAction(action: PerformanceAction) {
    updatePosition();

    if (action.kind === 'start-control') {
      const voiceId = instrumentByPartId[action.partId]?.startControl(action.controlId);

      if (voiceId) {
        const startedVoice = { partId: action.partId, voiceId };
        startedVoiceByActionId.set(action.id, startedVoice);

        if (action.scoreEventId) {
          startedVoiceByScoreEventId.set(action.scoreEventId, startedVoice);
        }
      }

      return;
    }

    const startedVoice = action.scoreEventId ? startedVoiceByScoreEventId.get(action.scoreEventId) : undefined;

    if (startedVoice) {
      instrumentByPartId[startedVoice.partId]?.stopVoice(startedVoice.voiceId);
      startedVoiceByScoreEventId.delete(action.scoreEventId!);
      startedVoiceByActionId.delete(action.id);
    }

    if (isLastAction(action)) {
      clearScheduledActions();
      state.status = 'idle';
      state.positionSeconds = 0;
      runStartedAt = undefined;
      notifyStateChange();
    }
  }

  function clearScheduledActions() {
    for (const timeoutId of timeoutIds) {
      scheduler.clearTimeout(timeoutId);
    }

    timeoutIds.length = 0;
  }

  function isLastAction(action: PerformanceAction) {
    return action.id === finalAction?.id;
  }

  function restartSoundingEventsAtCurrentPosition() {
    for (const action of startActionsSoundingAtCurrentPosition()) {
      applyAction(action);
    }
  }

  function startActionsSoundingAtCurrentPosition() {
    return scheduledActions.filter((action) => {
      if (action.kind !== 'start-control' || !action.scoreEventId || action.time > state.positionSeconds) {
        return false;
      }

      const stopAction = scheduledActions.find(
        (candidate) => candidate.kind === 'stop-control' && candidate.scoreEventId === action.scoreEventId,
      );

      return !stopAction || stopAction.time > state.positionSeconds;
    });
  }

  function notifyStateChange() {
    onStateChange?.(getState());
  }

  function updatePosition() {
    if (state.status !== 'playing' || runStartedAt === undefined) {
      return;
    }

    state.positionSeconds += ((now() - runStartedAt) / 1000) * state.playbackRate;
    runStartedAt = now();
  }

  function now() {
    return scheduler.now?.() ?? Date.now();
  }

  return {
    play,
    pause,
    toggle,
    dispose,
    getState,
  };
}
