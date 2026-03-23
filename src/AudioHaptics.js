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
  if (audio) {
    audio.currentTime = 0;
    audio.playbackRate = 1.0;
    audio.play().catch(e => {
      // Fallback to synthesized sounds if the assets are not present
      playSynthFallback(type);
    });
  } else {
    playSynthFallback(type);
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

const playSynthFallback = (type) => {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  if (type === 'click' || type === 'input' || type === 'pencil' || type === 'undo') {
    playTone(200, 'square', 0.05, 0.05); // Deeper tap
  } else if (type === 'success') {
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
  } else if (type === 'victory') {
    playTone(523.25, 'triangle', 0.15, 0.2); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.2), 150); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.4, 0.2), 300); // G5
  } else if (type === 'continue') {
    playTone(440, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(554.37, 'sine', 0.1, 0.1), 100);
  }
};

export const playHaptic = (type, settings) => {
  if (!settings?.vibration || !window.navigator.vibrate) return;
  if (type === 'tap' || type === 'input' || type === 'pencil' || type === 'undo') {
    window.navigator.vibrate(50);
  } else if (type === 'mistake') {
    window.navigator.vibrate([100, 50, 100]);
  } else if (type === 'success') {
    window.navigator.vibrate(50);
  } else if (type === 'victory') {
    window.navigator.vibrate([100, 50, 100, 50, 200]);
  }
};

// Initialize preload
preloadAudio();
