import { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment-timezone';

/**
 * Custom hook that provides real-time clock data for a given IANA timezone.
 */
export function useClock(timezone, use24Hour = false) {
  const [now, setNow] = useState(() => moment().tz(timezone));

  useEffect(() => {
    setNow(moment().tz(timezone));

    const interval = setInterval(() => {
      setNow(moment().tz(timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  const timeString = use24Hour
    ? now.format('HH:mm:ss')
    : now.format('hh:mm:ss A');

  const dateString = now.format('dddd, MMMM D, YYYY');
  const shortDate = now.format('ddd, MMM D');
  const hour = now.hour();
  const minute = now.minute();
  const second = now.second();

  return {
    timeString,
    dateString,
    shortDate,
    hour,
    minute,
    second,
    momentObj: now,
    timezone,
  };
}

/**
 * Main state manager for clocks + alarms
 */
export function useClocksManager() {
  const STORAGE_KEY = 'world-clock-widget-v1';
  const MAX_CLOCKS = 6;

  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          clocks: parsed.clocks || [],
          use24Hour: parsed.use24Hour ?? false,
        };
      }
    } catch (e) {
      console.warn('Failed to load clocks from localStorage', e);
    }
    return { clocks: [], use24Hour: false };
  };

  const [state, setState] = useState(loadState);
  const { clocks, use24Hour } = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ clocks, use24Hour }));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [clocks, use24Hour]);

  const firedAlarmsRef = useRef(new Set());

  // Reset fired alarms at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 2) {
        firedAlarmsRef.current.clear();
      }
    }, 1000);
    return () => clearInterval(checkMidnight);
  }, []);

  // ========== ALARM SOUND FUNCTION ==========
  const playAlarmSound = () => {
    try {
      // Create a nice multi-tone ringtone using Web Audio API
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Pleasant ringtone pattern (like a soft phone ring)
      const now = ctx.currentTime;
      playTone(880, now, 0.25);          // A5
      playTone(1108.73, now + 0.3, 0.25); // C#6
      playTone(1318.51, now + 0.6, 0.4);  // E6
      playTone(880, now + 1.2, 0.25);
      playTone(1108.73, now + 1.5, 0.25);
      playTone(1318.51, now + 1.8, 0.5);

    } catch (e) {
      console.warn('Could not play alarm sound:', e);
    }
  };

  // Alarm checker
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkAlarms = setInterval(() => {
      clocks.forEach((clock) => {
        if (!clock.alarmTime) return;

        const current = moment().tz(clock.timezone);
        const [alarmH, alarmM] = clock.alarmTime.split(':').map(Number);

        if (
          current.hour() === alarmH &&
          current.minute() === alarmM &&
          current.second() < 2
        ) {
          const key = `${clock.id}-${current.format('YYYY-MM-DD')}`;
          if (firedAlarmsRef.current.has(key)) return;

          firedAlarmsRef.current.add(key);

          // 1. Play ringtone
          playAlarmSound();

          // 2. Show system notification
          if (Notification.permission === 'granted') {
            new Notification(`⏰ Alarm – ${clock.flag} ${clock.region}`, {
              body: `It's ${clock.alarmTime} in ${clock.region}, ${clock.country}`,
              silent: false, // allow system to also make a sound if possible
            });
          }
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [clocks]);

  const addClock = useCallback((country, region, timezone, flag) => {
    setState((prev) => {
      if (prev.clocks.length >= MAX_CLOCKS) return prev;

      const exists = prev.clocks.some(
        (c) => c.country === country && c.region === region
      );
      if (exists) return prev;

      const newClock = {
        id: `${country}-${region}-${Date.now()}`,
        country,
        region,
        timezone,
        flag,
        alarmTime: null,
      };

      return {
        ...prev,
        clocks: [...prev.clocks, newClock],
      };
    });
  }, []);

  const removeClock = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      clocks: prev.clocks.filter((c) => c.id !== id),
    }));
  }, []);

  const setAlarm = useCallback((id, time) => {
    setState((prev) => ({
      ...prev,
      clocks: prev.clocks.map((c) =>
        c.id === id ? { ...c, alarmTime: time || null } : c
      ),
    }));
  }, []);

  const clearAlarm = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      clocks: prev.clocks.map((c) =>
        c.id === id ? { ...c, alarmTime: null } : c
      ),
    }));
  }, []);

  const toggle24Hour = useCallback(() => {
    setState((prev) => ({
      ...prev,
      use24Hour: !prev.use24Hour,
    }));
  }, []);

  return {
    clocks,
    use24Hour,
    maxClocks: MAX_CLOCKS,
    canAddMore: clocks.length < MAX_CLOCKS,
    addClock,
    removeClock,
    setAlarm,
    clearAlarm,
    toggle24Hour,
  };
}