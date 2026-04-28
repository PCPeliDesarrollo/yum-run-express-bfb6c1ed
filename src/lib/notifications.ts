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
