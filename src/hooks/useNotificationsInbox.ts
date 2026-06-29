import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getNotifications,
  subscribeNotifications,
  markAllRead as _markAllRead,
  clearNotifications as _clear,
  InboxNotification,
} from "@/lib/notificationsStore";

export const useNotificationsInbox = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxNotification[]>([]);

  const refresh = useCallback(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setItems(getNotifications(user.id));
  }, [user]);

  useEffect(() => {
    refresh();
    const unsub = subscribeNotifications(refresh);
    return unsub;
  }, [refresh]);

  const unreadCount = items.filter((n) => !n.read).length;

  return {
    items,
    unreadCount,
    markAllRead: () => user && _markAllRead(user.id),
    clear: () => user && _clear(user.id),
  };
};
