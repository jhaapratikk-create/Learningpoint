import { AlarmTone, CustomRingtone } from "../types";

class AlarmSoundEngine {
  private audioCtx: AudioContext | null = null;
  private currentInterval: number | null = null;
  private customAudioEl: HTMLAudioElement | null = null;
  private wakeLockSentinel: any = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playTone(tone: AlarmTone = "bell", customDataUrl?: string) {
    // If tone is custom or has customDataUrl, play custom audio
    if ((tone === "custom" || customDataUrl) && customDataUrl) {
      this.playCustomAudioOnce(customDataUrl);
      return;
    }

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (tone === "bell") {
        // School / Temple bell with rich harmonics
        const freqs = [587.33, 880, 1174.66, 1760]; // D5 major harmonics
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.3 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.8);
        });
      } else if (tone === "chime") {
        // Melodic ascending study arpeggio: C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + i * 0.15;

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 1.2);
        });
      } else if (tone === "zen") {
        // Deep Tibetan singing bowl tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(216, now); // 432Hz harmonic
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      } else {
        // Digital loud buzzer
        [0, 0.2, 0.4].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + offset;
          osc.type = "square";
          osc.frequency.setValueAtTime(920, noteStart);

          gain.gain.setValueAtTime(0.18, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 0.12);
        });
      }
    } catch (e) {
      console.warn("AudioContext error on alarm tone:", e);
    }
  }

  private playCustomAudioOnce(dataUrl: string) {
    try {
      const audio = new Audio(dataUrl);
      audio.volume = 0.9;
      audio.play().catch((e) => console.warn("Custom audio play error:", e));
    } catch (err) {
      console.warn("Error playing custom audio preview:", err);
    }
  }

  async startRepeating(tone: AlarmTone = "bell", customDataUrl?: string) {
    this.stopRepeating();

    // Request wake lock so device does not sleep while alarm is ringing
    this.requestWakeLock();

    // Trigger physical vibration on mobile devices
    this.triggerVibration();

    if ((tone === "custom" || customDataUrl) && customDataUrl) {
      try {
        this.customAudioEl = new Audio(customDataUrl);
        this.customAudioEl.loop = true;
        this.customAudioEl.volume = 1.0;
        await this.customAudioEl.play();
        return;
      } catch (err) {
        console.warn("Could not play custom audio element, falling back to tone:", err);
      }
    }

    // Fallback or tone-based repeating
    this.playTone(tone);
    this.currentInterval = window.setInterval(() => {
      this.playTone(tone);
      this.triggerVibration();
    }, 2500);
  }

  stopRepeating() {
    if (this.currentInterval !== null) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    if (this.customAudioEl) {
      try {
        this.customAudioEl.pause();
        this.customAudioEl.currentTime = 0;
      } catch (e) {}
      this.customAudioEl = null;
    }
    this.releaseWakeLock();
    this.stopVibration();
  }

  private async requestWakeLock() {
    try {
      if ("wakeLock" in navigator && (navigator as any).wakeLock) {
        this.wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
      }
    } catch (e) {
      // Non-critical, ignore
    }
  }

  private releaseWakeLock() {
    if (this.wakeLockSentinel) {
      try {
        this.wakeLockSentinel.release();
      } catch (e) {}
      this.wakeLockSentinel = null;
    }
  }

  private triggerVibration() {
    try {
      if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate([400, 150, 400, 150, 600]);
      }
    } catch (e) {}
  }

  private stopVibration() {
    try {
      if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
        navigator.vibrate(0);
      }
    } catch (e) {}
  }
}

export const alarmSound = new AlarmSoundEngine();

// System Notification & Service Worker Notification
export const requestAlarmNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  try {
    const perm = await Notification.requestPermission();
    return perm === "granted";
  } catch (e) {
    return false;
  }
};

export const sendSystemAlarmNotification = async (title: string, body: string, customSoundName?: string) => {
  const notificationTitle = `⏰ ${title}`;
  const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
    body: customSoundName ? `${body}\n🎵 Ringtone: ${customSoundName}` : body,
    icon: "/pwa-192x192.png",
    badge: "/favicon.ico",
    tag: `alarm-${Date.now()}`,
    requireInteraction: true,
    silent: false,
    vibrate: [500, 200, 500, 200, 800],
  };

  // Try service worker background notification first (works even when tab is backgrounded/minimized!)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(notificationTitle, notificationOptions);
        return;
      }
    } catch (e) {
      console.warn("ServiceWorker notification failed, using window.Notification fallback:", e);
    }
  }

  // Fallback to standard window Notification
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const n = new Notification(notificationTitle, notificationOptions);
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch (e) {
      console.warn("Window notification error:", e);
    }
  }
};

// Custom Ringtone Management Utilities
const STORAGE_KEY_RINGTONES = "ai_study_custom_ringtones";

export const getStoredCustomRingtones = (): CustomRingtone[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RINGTONES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load custom ringtones from localStorage:", e);
  }
  // Default sample ringtones
  return [
    {
      id: "ringtone_preset_1",
      name: "Gentle Morning Chime (Online MP3)",
      dataUrl: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
      sourceType: "url",
      fileSize: "68 KB",
      createdAt: "2026-09-01",
    },
    {
      id: "ringtone_preset_2",
      name: "Energetic Wakeup Beep (Online MP3)",
      dataUrl: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
      sourceType: "url",
      fileSize: "84 KB",
      createdAt: "2026-09-01",
    },
  ];
};

export const saveCustomRingtone = (ringtone: CustomRingtone): CustomRingtone[] => {
  const current = getStoredCustomRingtones();
  const updated = [ringtone, ...current.filter((r) => r.id !== ringtone.id)];
  try {
    localStorage.setItem(STORAGE_KEY_RINGTONES, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save custom ringtone to localStorage (storage full?):", e);
  }
  return updated;
};

export const deleteCustomRingtone = (id: string): CustomRingtone[] => {
  const current = getStoredCustomRingtones();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_RINGTONES, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to delete custom ringtone from localStorage:", e);
  }
  return updated;
};

export const convertAudioFileToDataUrl = (file: File): Promise<{ dataUrl: string; fileSizeStr: string }> => {
  return new Promise((resolve, reject) => {
    // Check max size: 8MB to prevent local storage freeze
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("Audio file exceeds 8 MB limit. Please select a shorter ringtone file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        resolve({ dataUrl: reader.result, fileSizeStr: sizeStr });
      } else {
        reject(new Error("Could not read audio file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read audio file"));
    reader.readAsDataURL(file);
  });
};
