import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;

const statusConfig: Record<string, { label: string; emoji: string }> = {
  pending: { label: 'Pendiente', emoji: '🕐' },
  confirmed: { label: 'Confirmado', emoji: '✅' },
  preparing: { label: 'Preparando', emoji: '👨‍🍳' },
  ready: { label: 'Listo', emoji: '📦' },
  delivered: { label: 'Entregado', emoji: '🚀' },
  cancelled: { label: 'Cancelado', emoji: '❌' },
};

const activeStatuses = ['pending', 'confirmed', 'preparing', 'ready'];

const OrderCard = ({ order }: { order: Order }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const cfg = statusConfig[order.status] || { label: order.status, emoji: '📋' };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-foreground">
            Pedido #{order.order_number}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <Clock className="w-3 h-3" />
            {new Date(order.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
        }`}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-border space-y-1">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-foreground">
              {item.quantity}x {item.productName || item.name || 'Producto'}
            </span>
            <span className="font-semibold text-foreground">
              {((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}€
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3 pt-3 border-t border-border">
        <span className="font-bold text-foreground">Total</span>
        <span className="font-bold text-lg text-primary">
          {Number(order.total).toFixed(2)}€
        </span>
      </div>
    </div>
  );
};

const MisPedidos = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pastOpen, setPastOpen] = useState(false);

  const activeOrders = orders.filter(o => activeStatuses.includes(o.status));
  const pastOrders = orders.filter(o => !activeStatuses.includes(o.status));

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
