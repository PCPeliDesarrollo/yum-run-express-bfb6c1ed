import { Capacitor } from "@capacitor/core";

let permissionRequested = false;

export const ensureNotificationPermission = async (): Promise<boolean> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const status = await LocalNotifications.checkPermissions();
      if (status.display === "granted") return true;
      if (!permissionRequested) {
        permissionRequested = true;
        const req = await LocalNotifications.requestPermissions();
        return req.display === "granted";
      }
      return false;
    } catch (e) {
      console.warn("LocalNotifications not available:", e);
      return false;
    }
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "default" && !permissionRequested) {
      permissionRequested = true;
      const result = await Notification.requestPermission();
      return result === "granted";
    }
  }
  return false;
};

export const showNativeNotification = async (
  title: string,
  body: string,
  id?: number
) => {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  if (Capacitor.isNativePlatform()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      await LocalNotifications.schedule({
        notifications: [
          {
            id: id ?? Math.floor(Math.random() * 1_000_000),
            title,
            body,
            smallIcon: "ic_stat_icon_config_sample",
            iconColor: "#DF3120",
            sound: undefined,
          },
        ],
      });
    } catch (e) {
      console.warn("Native notification failed:", e);
    }
    return;
  }

  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "/logo_tryb.jpg", tag: id ? `n-${id}` : undefined });
    } catch (e) {
      console.warn("Web notification failed:", e);
    }
  }
};

// Simple short beep (used for status updates to customers)
export const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    beep(880, 0, 0.15);
    beep(1100, 0.18, 0.15);
    beep(880, 0.36, 0.15);
  } catch {
    /* noop */
  }
};

// Restaurant-bell "ding-dong" pattern, repeated 3 times. Used for NEW ORDER alerts in admin/kitchen.
export const playKitchenBell = async () => {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx: AudioContext = new Ctx();
    // Resume in case context is suspended (autoplay policies)
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch { /* noop */ }
    }

    // A "ding-dong": two harmonic tones with a soft decay envelope.
    const ding = (startOffset: number, freq: number, dur = 1.1, vol = 0.55) => {
      const t0 = ctx.currentTime + startOffset;

      // Fundamental
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      // Slight overtone for a "bell" timbre
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2.01;

      const gain = ctx.createGain();
      const gain2 = ctx.createGain();

      // Bell-like envelope: fast attack, long exponential decay
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      gain2.gain.setValueAtTime(0.0001, t0);
      gain2.gain.exponentialRampToValueAtTime(vol * 0.35, t0 + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.7);

      osc.connect(gain).connect(ctx.destination);
      osc2.connect(gain2).connect(ctx.destination);

      osc.start(t0);
      osc2.start(t0);
      osc.stop(t0 + dur + 0.05);
      osc2.stop(t0 + dur + 0.05);
    };

    // Pattern: ding (high) -> dong (low), repeated 3 times
    // Frequencies: E5 (659.25Hz) and C5 (523.25Hz) — classic doorbell interval
    const cycle = 1.4; // seconds between each ding-dong
    for (let i = 0; i < 3; i++) {
      const base = i * cycle;
      ding(base, 659.25, 0.9, 0.55);          // ding
      ding(base + 0.45, 523.25, 1.1, 0.55);   // dong
    }

    // Auto-close context when finished to free resources
    setTimeout(() => {
      try { ctx.close(); } catch { /* noop */ }
    }, (3 * 1.4 + 1.5) * 1000);
  } catch (e) {
    console.warn("playKitchenBell failed:", e);
  }
};
