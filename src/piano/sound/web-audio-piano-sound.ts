import type { PianoNote, PianoSound, PianoTuning } from '../domain/piano';

type ActiveVoice = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

const defaultTuning: PianoTuning = {
  a4Frequency: 440,
  a4MidiNumber: 69,
};

export function createWebAudioPianoSound(tuning = defaultTuning): PianoSound {
  let audioContext: AudioContext | undefined;
  const activeVoices = new Map<string, ActiveVoice>();

  function getAudioContext() {
    audioContext ??= new AudioContext();
    return audioContext;
  }

  function midiToFrequency(midiNumber: number) {
    return tuning.a4Frequency * 2 ** ((midiNumber - tuning.a4MidiNumber) / 12);
  }

  function start(note: PianoNote) {
    if (activeVoices.has(note.name)) {
      return;
    }

    const context = getAudioContext();
    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.value = midiToFrequency(note.midiNumber);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.12);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);

    activeVoices.set(note.name, { oscillator, gain });
  }

  function stop(note: PianoNote) {
    const voice = activeVoices.get(note.name);

    if (!voice || !audioContext) {
      return;
    }

    const now = audioContext.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    voice.oscillator.stop(now + 0.09);
    activeVoices.delete(note.name);
  }

  return {
    start,
    stop,
  };
}
