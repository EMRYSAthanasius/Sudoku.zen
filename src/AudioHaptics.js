// Simple Web Audio API Synthesizer for UI Sounds

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playTone = (freq, type, duration, vol) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playSound = (type, settings) => {
  if (!settings?.sounds) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (type === 'click') {
    playTone(200, 'square', 0.05, 0.05); // Deeper, more percussive tap
  } else if (type === 'success') {
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
  } else if (type === 'victory') {
    playTone(523.25, 'triangle', 0.15, 0.2); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.2), 150); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.4, 0.2), 300); // G5
  }
};

export const playHaptic = (type, settings) => {
  if (!settings?.vibration || !navigator.vibrate) return;
  if (type === 'tap') {
    navigator.vibrate(10);
  } else if (type === 'mistake') {
    navigator.vibrate([50, 50, 50]);
  } else if (type === 'success') {
    navigator.vibrate(50);
  } else if (type === 'victory') {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
};
