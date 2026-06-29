// Simple per-user notifications inbox backed by localStorage.
// Persists customer-facing notifications so they can be reviewed later.

export interface InboxNotification {
  id: string;
  title: string;
  body: string;
  orderNumber?: number | string;
  createdAt: number; // epoch ms
  read: boolean;
}

const KEY_PREFIX = "tryb_notifications_v1_";
const EVENT_NAME = "tryb-notifications-changed";
const MAX_ITEMS = 100;

const keyFor = (userId: string) => `${KEY_PREFIX}${userId}`;

const emitChange = () => {
  try {
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {}
};

export const getNotifications = (userId: string): InboxNotification[] => {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const arr = JSON.parse(raw) as InboxNotification[];
    if (!Array.isArray(arr)) return [];
    return arr.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
};

export const addNotification = (
  userId: string,
  n: Omit<InboxNotification, "id" | "createdAt" | "read"> & { read?: boolean }
) => {
  if (!userId) return;
  const list = getNotifications(userId);
  const item: InboxNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    read: n.read ?? false,
    title: n.title,
    body: n.body,
    orderNumber: n.orderNumber,
  };
  const next = [item, ...list].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(next));
    emitChange();
  } catch {}
};

export const markAllRead = (userId: string) => {
  const list = getNotifications(userId).map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(list));
    emitChange();
  } catch {}
};

export const clearNotifications = (userId: string) => {
  try {
    localStorage.removeItem(keyFor(userId));
    emitChange();
  } catch {}
};

export const subscribeNotifications = (cb: () => void) => {
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
};
