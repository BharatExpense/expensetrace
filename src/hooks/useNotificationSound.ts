import { useCallback, useRef } from 'react';

const SOUND_ENABLED_KEY = 'expense-tracker-sound-enabled';

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const isSoundEnabled = useCallback(() => {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY);
    return stored === null ? true : stored === 'true';
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    if (!isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  }, [isSoundEnabled]);

  const playExpenseAdded = useCallback(() => {
    if (!isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Pleasant two-note chime (ascending)
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.3);
      });
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  }, [isSoundEnabled]);

  const playBudgetExceeded = useCallback(() => {
    if (!isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Warning descending two-tone
      [880, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.35);
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.35);
      });
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  }, [isSoundEnabled]);

  return {
    isSoundEnabled,
    setSoundEnabled,
    playExpenseAdded,
    playBudgetExceeded,
  };
};
