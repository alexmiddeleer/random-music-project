import type { Note } from '../music/music';

export type ControlId = string;
export type VoiceId = string;

export type Control = {
  id: ControlId;
  label: string;
  note?: Note;
};

export type InstrumentConfig = {
  controls: Control[];
};

export type InstrumentSound = {
  startVoice(element: Control): VoiceId;
  stopVoice(voiceId: VoiceId): void;
};

export type InstrumentState = {
  controls: Control[];
  activeControlIds: Set<ControlId>;
};

export function createInstrument(config: InstrumentConfig, sound: InstrumentSound) {
  const elementById = new Map(config.controls.map((element) => [element.id, element]));
  const voiceByControlId = new Map<ControlId, VoiceId>();

  function startControl(controlId: ControlId) {
    const element = elementById.get(controlId);

    if (!element) {
      return undefined;
    }

    const existingVoiceId = voiceByControlId.get(controlId);

    if (existingVoiceId) {
      return existingVoiceId;
    }

    const voiceId = sound.startVoice(element);
    voiceByControlId.set(controlId, voiceId);
    return voiceId;
  }

  function stopControl(controlId: ControlId) {
    const voiceId = voiceByControlId.get(controlId);

    if (!voiceId) {
      return;
    }

    voiceByControlId.delete(controlId);
    sound.stopVoice(voiceId);
  }

  function getState(): InstrumentState {
    return {
      controls: config.controls,
      activeControlIds: new Set(voiceByControlId.keys()),
    };
  }

  return {
    startControl,
    stopControl,
    getState,
  };
}
