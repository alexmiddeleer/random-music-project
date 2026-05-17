import type { ControlId } from '../instrument/instrument';

export type MusicalAction = {
  time: number;
  kind: 'start-voice' | 'stop-voice';
  controlId: ControlId;
};

export type Composition = {
  actions: MusicalAction[];
};

type PlayableInstrument = {
  startControl(controlId: ControlId): unknown;
  stopControl(controlId: ControlId): void;
};

export function playCompositionActions(composition: Composition, instrument: PlayableInstrument) {
  for (const action of [...composition.actions].sort((a, b) => a.time - b.time)) {
    if (action.kind === 'start-voice') {
      instrument.startControl(action.controlId);
    } else {
      instrument.stopControl(action.controlId);
    }
  }
}
