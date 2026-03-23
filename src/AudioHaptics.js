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

  // A triangle or sine wave with a rapid pitch drop simulates percussive wood
  osc.type = 'triangle';

  // Start high and drop very fast, scaled by the randomized rate
  osc.frequency.setValueAtTime(400 * rate, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50 * rate, audioCtx.currentTime + 0.03);

  // Very fast attack and decay for a sharp, dead "knock"
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
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
    window.navigator.vibrate(70);
  } else if (type === 'mistake') {
    window.navigator.vibrate([150, 50, 150]);
  } else if (type === 'success') {
    window.navigator.vibrate(50);
  } else if (type === 'victory') {
    window.navigator.vibrate([100, 30, 100, 30, 300]);
  }
};

// Initialize preload
preloadAudio();
