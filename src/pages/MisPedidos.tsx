import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

const statusConfig: Record<string, { label: string; emoji: string; color: string }> = {
  pending: { label: 'Pendiente', emoji: '🕐', color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmado', emoji: '✅', color: 'bg-blue-500' },
  preparing: { label: 'Preparando', emoji: '👨‍🍳', color: 'bg-orange-500' },
  ready: { label: 'Listo', emoji: '📦', color: 'bg-green-500' },
  delivered: { label: 'Entregado', emoji: '🚀', color: 'bg-gray-500' },
  cancelled: { label: 'Cancelado', emoji: '❌', color: 'bg-red-500' },
};

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

const orderTypeLabels: Record<string, string> = {
  delivery: '🛵 Domicilio',
  pickup: '🏪 Recoger',
  dine_in: '🍽️ En local',
  preorder: '📅 Reserva',
};

const OrderStatusTracker = ({ status }: { status: string }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-red-50 dark:bg-red-950/30 rounded-xl">
        <span className="text-2xl">❌</span>
        <span className="font-bold text-red-600 dark:text-red-400">Pedido cancelado</span>
      </div>
    );
  }

  const currentIdx = statusSteps.indexOf(status);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-muted rounded-full" />
        <div
          className="absolute top-5 left-6 h-1 bg-primary rounded-full transition-all duration-500"
          style={{ width: `calc(${(currentIdx / (statusSteps.length - 1)) * 100}% - 48px)` }}
        />

        {statusSteps.map((step, idx) => {
          const cfg = statusConfig[step];
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step} className="flex flex-col items-center gap-1 z-10 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  isCompleted
                    ? `${cfg.color} text-white shadow-md`
                    : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}`}
              >
                {isCompleted ? cfg.emoji : idx + 1}
              </div>
              <span
                className={`text-[10px] font-semibold text-center leading-tight ${
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MisPedidos = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setIsLoading(false);
    };

    fetchOrders();

    // Realtime subscription
    const channel = supabase
      .channel('my-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
            <Package className="w-5 h-5" />
            Mis Pedidos
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <h2 className="text-lg font-bold text-foreground mb-2">No tienes pedidos aún</h2>
              <p className="text-muted-foreground mb-6">¡Haz tu primer pedido!</p>
              <Button onClick={() => navigate('/')} className="rounded-full">
                Ver el menú
              </Button>
            </div>
          ) : (
            <>
              {/* Active orders */}
              {activeOrders.length > 0 && (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}

              {/* Past orders collapsible */}
              {pastOrders.length > 0 && (
                <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3 mt-2">
                    <span className="font-semibold text-sm text-muted-foreground">
                      📋 Pedidos anteriores ({pastOrders.length})
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${pastOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {pastOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;
