import { useEffect } from "react";
import { Bell, Trash2, ArrowLeft, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNotificationsInbox } from "@/hooks/useNotificationsInbox";

const formatWhen = (ts: number) => {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Hoy, ${time}`;
  const date = d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
  return `${date} ${time}`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const { items, markAllRead, clear, unreadCount } = useNotificationsInbox();

  useEffect(() => {
    if (unreadCount > 0) {
      const t = setTimeout(markAllRead, 600);
      return () => clearTimeout(t);
    }
  }, [unreadCount, markAllRead]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground safe-top">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Bell className="w-5 h-5" />
          <h1 className="text-lg font-bold flex-1">Notificaciones</h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="p-2 rounded-lg hover:bg-white/10"
              aria-label="Borrar todas"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
            <Bell className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-semibold text-foreground">No tienes notificaciones</p>
            <p className="text-sm mt-1">
              Aquí verás los avisos sobre el estado de tus pedidos.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl border p-4 bg-card ${
                  n.read ? "border-border" : "border-primary/60 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      n.read ? "bg-muted" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{n.title}</p>
                    <p className="text-sm text-foreground/80 mt-0.5">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatWhen(n.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
