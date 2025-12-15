let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const createOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  return { osc, gain };
};

export const playMoveSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const { osc, gain } = createOscillator(ctx, 'sine', 800, now, 0.1);

  // Frequency sweep for a "laser" blip
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
  
  // Envelope
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
};

export const playWinSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C Major Arpeggio (C5, E5, G5, C6)
  const notes = [523.25, 659.25, 783.99, 1046.50]; 

  notes.forEach((freq, i) => {
    const startTime = now + i * 0.08;
    const { osc, gain } = createOscillator(ctx, 'triangle', freq, startTime, 0.3);
    
    // Envelope for a bell-like synth
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
};

export const playDrawSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const { osc, gain } = createOscillator(ctx, 'sawtooth', 150, now, 0.4);

  // Pitch drop "power down"
  osc.frequency.linearRampToValueAtTime(50, now + 0.4);

  // Envelope
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

  osc.start(now);
  osc.stop(now + 0.4);
};