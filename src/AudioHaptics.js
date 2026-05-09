// Web Audio API + OGG assets. Synth fallbacks are tuned for a warm "Midnight Gold" feel:
// soft wood taps for chrome, bell-like gold intervals for rewards, low descending chime for mistakes.

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

/** Soft metallic tick for pencil / note toggles (lighter than full wood tap). */
const playGoldTick = (rate = 1.0) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880 * rate, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440 * rate, audioCtx.currentTime + 0.035);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.055);
};

/** Short descending minor second — clearly distinct from UI taps; not a harsh buzzer. */
const playMistakeChime = (rate = 1.0) => {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220 * rate, t0);
  osc.frequency.exponentialRampToValueAtTime(165 * rate, t0 + 0.12);
  gain.gain.setValueAtTime(0.001, t0);
  gain.gain.exponentialRampToValueAtTime(0.11, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(t0 + 0.2);
};

/** Row/col/box complete: warm major-third + fifth (gold register). */
const playSuccessGold = () => {
  const base = 392; // G4
  playTone(base, 'sine', 0.12, 0.09);
  setTimeout(() => playTone(base * 1.25, 'sine', 0.14, 0.085), 85); // major third
  setTimeout(() => playTone(base * 1.5, 'sine', 0.22, 0.075), 175); // fifth
};

/** Win: slow arpeggio with a bit of shimmer. */
const playVictoryGold = () => {
  const freqs = [392, 494, 587, 784]; // G4 B4 D5 G5
  freqs.forEach((f, i) => {
    setTimeout(() => playTone(f, i === 3 ? 'triangle' : 'sine', i === 3 ? 0.45 : 0.2, 0.11 + i * 0.02), i * 140);
  });
};

const playSynthFallback = (type, rate = 1.0) => {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  if (type === 'click' || type === 'continue') {
    playWoodTap(rate);
  } else if (type === 'input') {
    playWoodTap(rate * 1.02);
    setTimeout(() => playGoldTick(rate * 0.98), 38);
  } else if (type === 'pencil') {
    playGoldTick(rate);
  } else if (type === 'undo') {
    playWoodTap(rate * 0.92);
    setTimeout(() => playTone(330 * rate, 'sine', 0.06, 0.05), 55);
  } else if (type === 'mistake') {
    playMistakeChime(rate);
  } else if (type === 'success') {
    playSuccessGold();
  } else if (type === 'victory') {
    playVictoryGold();
  }
};

export const playHaptic = (type, settings) => {
  if (!settings?.vibration || !window.navigator.vibrate) return;
  // Distinct patterns: selection vs commit vs undo vs error vs celebration
  if (type === 'tap') {
    window.navigator.vibrate(28);
  } else if (type === 'input') {
    window.navigator.vibrate([42, 35, 58]);
  } else if (type === 'pencil') {
    window.navigator.vibrate([18, 22, 22]);
  } else if (type === 'undo') {
    window.navigator.vibrate([55, 45, 75, 40, 95]);
  } else if (type === 'mistake') {
    window.navigator.vibrate([140, 45, 160, 50, 200]);
  } else if (type === 'success') {
    window.navigator.vibrate([35, 40, 55, 45, 85]);
  } else if (type === 'victory') {
    window.navigator.vibrate([55, 45, 70, 50, 90, 55, 120, 60, 200]);
  }
};

// Initialize preload
preloadAudio();
