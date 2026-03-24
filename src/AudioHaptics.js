// Web Audio API Synthesizer and Asset Player for UI Sounds

const SOUND_ASSETS = {
  click: '/audio/sound_button.ogg',
  input: '/audio/sound_edit_value.ogg',
  undo: '/audio/sound_undo.ogg',
  pencil: '/audio/sound_pencil_off.ogg',
  mistake: '/audio/sound_error.ogg',
  success: '/audio/sound_dc_coin.ogg',
  victory: '/audio/sound_dc_win.ogg',
  continue: '/audio/sound_dc_continue.ogg'
};

const audioCache = {};

export const preloadAudio = () => {
  if (typeof window === 'undefined') return;
  Object.keys(SOUND_ASSETS).forEach(key => {
    const audio = new Audio(SOUND_ASSETS[key]);
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
};

export const playSound = (type, settings) => {
  if (!settings?.sounds) return;

  const audio = audioCache[type];

  let rate = 1.0;
  if (type === 'click' || type === 'input' || type === 'pencil' || type === 'undo' || type === 'mistake') {
    rate = 0.95 + Math.random() * 0.1;
  }

  if (audio) {
    audio.currentTime = 0;
    audio.playbackRate = rate;
    if (type === 'mistake') {
      audio.volume = 1.0;
    }
    audio.play().catch(e => {
      // Fallback to synthesized sounds if the assets are not present
      playSynthFallback(type, rate);
    });
  } else {
    playSynthFallback(type, rate);
  }
};

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

const playWoodTap = (rate = 1.0) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // A sine wave produces a softer, rounder tone than a triangle wave
  osc.type = 'sine';

  // Start lower and drop slightly slower for a more hollow, subtle thud
  osc.frequency.setValueAtTime(300 * rate, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40 * rate, audioCtx.currentTime + 0.04);

  // Softer attack and decay for a less aggressive knock
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.07);
};

const playSynthFallback = (type, rate = 1.0) => {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  if (type === 'click' || type === 'input' || type === 'pencil' || type === 'undo' || type === 'mistake' || type === 'continue') {
    playWoodTap(rate);
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
  if (!settings?.vibration || !window.navigator.vibrate) return;
  if (type === 'tap' || type === 'input' || type === 'pencil' || type === 'undo') {
    // Increase base vibration for standard interactions to feel more pronounced
    window.navigator.vibrate([80, 20, 80]);
  } else if (type === 'mistake') {
    window.navigator.vibrate([250, 50, 250, 50, 300]);
  } else if (type === 'success') {
    window.navigator.vibrate([150, 50, 200]);
  } else if (type === 'victory') {
    window.navigator.vibrate([200, 50, 200, 50, 500, 50, 400]);
  }
};

// Initialize preload
preloadAudio();
