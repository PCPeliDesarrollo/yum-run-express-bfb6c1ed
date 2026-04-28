import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { showNativeNotification, playBeep, ensureNotificationPermission } from "@/lib/notifications";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  pending: "recibido",
  confirmed: "confirmado",
  preparing: "en preparación",
  ready: "listo",
  delivered: "entregado",
  cancelled: "cancelado",
};

export const useOrderNotifications = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const lastStatusRef = useRef<Record<string, string>>({});

  // Request permission once user is logged in
  useEffect(() => {
    if (user) {
      ensureNotificationPermission();
    }
  }, [user]);

  // Admin: notify on new INSERT
  useEffect(() => {
    if (!isAdmin) return;
    console.log("[OrderNotif] Subscribing as ADMIN to new orders");
    const channel = supabase
      .channel("global-admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("[OrderNotif] New order received:", payload);
          const o: any = payload.new;
          if (!o) return;
          playBeep();
          const title = "🔔 ¡Nuevo pedido!";
          const body = `Pedido #${o.order_number} — €${Number(o.total).toFixed(2)}`;
          showNativeNotification(title, body, o.order_number);
          toast(title, { description: body });
        }
      )
      .subscribe((status) => {
        console.log("[OrderNotif] Admin channel status:", status);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // Customer: notify on status change of their orders
  useEffect(() => {
    if (!user || isAdmin) return;
    const channel = supabase
      .channel(`global-user-orders-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const o: any = payload.new;
          const old: any = payload.old;
          if (!o || !o.status) return;
          const prev = lastStatusRef.current[o.id] ?? old?.status;
          if (prev === o.status) return;
          lastStatusRef.current[o.id] = o.status;
          const label = statusLabels[o.status] ?? o.status;
          const title = `📦 Pedido #${o.order_number}`;
          const body = `Tu pedido está ${label}`;
          playBeep();
          showNativeNotification(title, body, o.order_number);
          toast(title, { description: body });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);
};
