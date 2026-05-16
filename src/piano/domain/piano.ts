export type PianoKeyId = string;

export type PianoKeyColor = 'white' | 'black';

export type PianoNote = {
  name: string;
  midiNumber: number;
};

export type PianoKey = {
  id: PianoKeyId;
  note: PianoNote;
  keyboardCode: string;
  keyboardLabel: string;
  color: PianoKeyColor;
};

export type PianoTuning = {
  a4Frequency: number;
  a4MidiNumber: number;
};

export type PianoConfig = {
  keys: PianoKey[];
  tuning: PianoTuning;
  keyboardMap: Record<string, PianoKeyId>;
};

export type PianoState = {
  keys: PianoKey[];
  pressedKeyIds: Set<PianoKeyId>;
};

export type PianoSound = {
  start(note: PianoNote): void;
  stop(note: PianoNote): void;
};

export function createPiano(config: PianoConfig, sound: PianoSound) {
  const keyById = new Map(config.keys.map((key) => [key.id, key]));
  const pressedKeyIds = new Set<PianoKeyId>();

  function pressKey(keyId: PianoKeyId) {
    const key = keyById.get(keyId);

    if (!key || pressedKeyIds.has(keyId)) {
      return;
    }

    pressedKeyIds.add(keyId);
    sound.start(key.note);
  }

  function releaseKey(keyId: PianoKeyId) {
    const key = keyById.get(keyId);

    if (!key || !pressedKeyIds.has(keyId)) {
      return;
    }

    pressedKeyIds.delete(keyId);
    sound.stop(key.note);
  }

  function getState(): PianoState {
    return {
      keys: config.keys,
      pressedKeyIds: new Set(pressedKeyIds),
    };
  }

  return {
    pressKey,
    releaseKey,
    getState,
  };
}
