import { defaultTuning, frequencyForNote, type Tuning } from '../music/music';
import type { InstrumentSound, Control, VoiceId } from './instrument';

type ActiveVoice = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

type WebAudioInstrumentSoundOptions = {
  tuning?: Tuning;
  createAudioContext?: () => AudioContext;
};

export function createWebAudioInstrumentSound({
  tuning = defaultTuning,
  createAudioContext = () => new AudioContext(),
}: WebAudioInstrumentSoundOptions = {}): InstrumentSound {
  let audioContext: AudioContext | undefined;
  let nextVoiceNumber = 1;
  const activeVoices = new Map<VoiceId, ActiveVoice>();

  function getAudioContext() {
    audioContext ??= createAudioContext();
    return audioContext;
  }

  function startVoice(element: Control): VoiceId {
    const context = getAudioContext();
    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.value = element.note ? frequencyForNote(element.note, tuning) : 220;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.12);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);

    const voiceId = `voice-${nextVoiceNumber++}`;
    activeVoices.set(voiceId, { oscillator, gain });
    return voiceId;
  }

  function stopVoice(voiceId: VoiceId) {
    const voice = activeVoices.get(voiceId);

    if (!voice || !audioContext) {
      return;
    }

    const now = audioContext.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    voice.oscillator.stop(now + 0.09);
    activeVoices.delete(voiceId);
  }

  return { startVoice, stopVoice };
}
