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
  const controlIdByVoiceId = new Map<VoiceId, ControlId>();

  function startControl(controlId: ControlId) {
    const element = elementById.get(controlId);

    if (!element) {
      return undefined;
    }

    const voiceId = sound.startVoice(element);
    controlIdByVoiceId.set(voiceId, controlId);
    return voiceId;
  }

  function stopControl(controlId: ControlId) {
    const voiceId = [...controlIdByVoiceId.entries()].find(([, activeControlId]) => activeControlId === controlId)?.[0];

    if (!voiceId) {
      return;
    }

    stopVoice(voiceId);
  }

  function stopVoice(voiceId: VoiceId) {
    if (!controlIdByVoiceId.has(voiceId)) {
      return;
    }

    controlIdByVoiceId.delete(voiceId);
    sound.stopVoice(voiceId);
  }

  function getState(): InstrumentState {
    return {
      controls: config.controls,
      activeControlIds: new Set(controlIdByVoiceId.values()),
    };
  }

  return {
    startControl,
    stopControl,
    stopVoice,
    getState,
  };
}
