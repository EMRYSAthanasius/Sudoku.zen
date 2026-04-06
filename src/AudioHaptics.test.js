import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { preloadAudio, playSound, playHaptic } from './AudioHaptics.js';

// Singleton mocks so they persist across tests because the module caches `audioCtx` globally
const mockOscillator = {
  type: '',
  frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};
const mockGain = {
  gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
};
const mockAudioContext = {
  state: 'running',
  currentTime: 0,
  resume: vi.fn().mockResolvedValue(undefined),
  createOscillator: vi.fn().mockReturnValue(mockOscillator),
  createGain: vi.fn().mockReturnValue(mockGain),
  destination: {},
};

describe('AudioHaptics', () => {
  beforeEach(() => {
    // Reset vi mocks
    vi.clearAllMocks();

    // Also clear the singleton mocks manually
    mockOscillator.frequency.setValueAtTime.mockClear();
    mockOscillator.frequency.exponentialRampToValueAtTime.mockClear();
    mockOscillator.connect.mockClear();
    mockOscillator.start.mockClear();
    mockOscillator.stop.mockClear();

    mockGain.gain.setValueAtTime.mockClear();
    mockGain.gain.exponentialRampToValueAtTime.mockClear();
    mockGain.connect.mockClear();

    mockAudioContext.resume.mockClear();
    mockAudioContext.createOscillator.mockClear();
    mockAudioContext.createGain.mockClear();

    // Mock window.Audio
    class MockAudio {
      constructor(url) {
        this.url = url;
        this.preload = '';
        this.currentTime = 0;
        this.playbackRate = 1;
        this.volume = 1;
        this.play = vi.fn().mockResolvedValue(undefined);
        MockAudio.instances.push(this);
      }
    }
    MockAudio.instances = [];
    window.Audio = MockAudio;

    // Mock window.Audio constructor tracking
    vi.spyOn(window, 'Audio');

    // Mock AudioContext
    window.AudioContext = function() { return mockAudioContext; };
    vi.spyOn(window, 'AudioContext');
    window.webkitAudioContext = window.AudioContext;

    // Mock navigator.vibrate
    Object.defineProperty(window.navigator, 'vibrate', {
      value: vi.fn(),
      configurable: true,
      writable: true,
    });
  });

  describe('preloadAudio', () => {
    it('should initialize audio objects for all assets', () => {
      preloadAudio();
      expect(window.Audio).toHaveBeenCalledTimes(8);
      expect(window.Audio).toHaveBeenCalledWith('/audio/sound_button.ogg');
    });
  });

  describe('playSound', () => {
    beforeEach(() => {
      // Clear instances before preload to get fresh ones
      window.Audio.instances = [];
      preloadAudio();
    });

    it('should not play sound if settings.sounds is false', () => {
      const audioInstance = window.Audio.instances.find(i => i.url === '/audio/sound_button.ogg') || { play: vi.fn() };
      playSound('click', { sounds: false });
      expect(audioInstance.play).not.toHaveBeenCalled();
    });

    it('should play sound if settings.sounds is true', () => {
      playSound('click', { sounds: true });
      const audioInstance = window.Audio.instances.find(i => i.url === '/audio/sound_button.ogg');
      if (audioInstance) {
        expect(audioInstance.play).toHaveBeenCalled();
      }
    });

    it('should fallback to synthesized sound if audio element is missing', () => {
      playSound('unknown_type_to_force_fallback', { sounds: true });
      expect(window.AudioContext).toHaveBeenCalled();
    });

  });

  describe('playHaptic', () => {
    it('should not vibrate if settings.vibration is false', () => {
      playHaptic('tap', { vibration: false });
      expect(window.navigator.vibrate).not.toHaveBeenCalled();
    });

    it('should not vibrate if navigator.vibrate is undefined', () => {
      delete window.navigator.vibrate;
      playHaptic('tap', { vibration: true });
      // If it throws, the test fails, but it should safely return
    });

    it('should call vibrate with correct pattern for tap', () => {
      playHaptic('tap', { vibration: true });
      expect(window.navigator.vibrate).toHaveBeenCalledWith([80, 20, 80]);
    });

    it('should call vibrate with correct pattern for mistake', () => {
      playHaptic('mistake', { vibration: true });
      expect(window.navigator.vibrate).toHaveBeenCalledWith([250, 50, 250, 50, 300]);
    });

    it('should call vibrate with correct pattern for success', () => {
      playHaptic('success', { vibration: true });
      expect(window.navigator.vibrate).toHaveBeenCalledWith([150, 50, 200]);
    });

    it('should call vibrate with correct pattern for victory', () => {
      playHaptic('victory', { vibration: true });
      expect(window.navigator.vibrate).toHaveBeenCalledWith([200, 50, 200, 50, 500, 50, 400]);
    });
  });
});
