import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  XCircle,
  Package,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Power,
  Printer
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useKitchenStatus } from '@/hooks/useKitchenStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
type OrderType = 'delivery' | 'pickup' | 'dine_in' | 'preorder';

interface Order {
  id: string;
  order_number: number;
  status: OrderStatus;
  order_type: OrderType;
  items: any[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  scheduled_for: string | null;
  created_at: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'bg-orange-500', icon: ChefHat },
  ready: { label: 'Listo', color: 'bg-green-500', icon: Package },
  delivered: { label: 'Entregado', color: 'bg-gray-500', icon: Truck },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
};

const orderTypeLabels: Record<OrderType, string> = {
  delivery: '🛵 Domicilio',
  pickup: '🏃 Recoger',
  dine_in: '🍽️ Local',
  preorder: '📅 Encargo',
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const { isOpen: kitchenOpen, toggleKitchen } = useKitchenStatus();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast({
        title: 'Acceso denegado',
        description: 'No tienes permisos de administrador',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAdmin, adminLoading, user, navigate, toast]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pedidos',
        variant: 'destructive',
      });
    } else {
      setOrders((data || []) as Order[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();

      // Real-time subscription
      const channel = supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Actualizado',
        description: `Pedido marcado como ${statusConfig[newStatus].label}`,
      });
      fetchOrders();
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    today: orders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today;
    }).length,
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-foreground text-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="text-background hover:bg-background/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-background/70">Tryb Burger</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchOrders}
              className="text-background hover:bg-background/10"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Kitchen Toggle */}
        <div className="container mx-auto px-4 pb-3">
          <button
            onClick={async () => {
              try {
                await toggleKitchen(!kitchenOpen);
                toast({
                  title: kitchenOpen ? '🔴 Cocina cerrada' : '🟢 Cocina abierta',
                  description: kitchenOpen ? 'Ya no se reciben pedidos' : 'Ahora se aceptan pedidos',
                });
              } catch {
                toast({ title: 'Error', description: 'No se pudo cambiar el estado', variant: 'destructive' });
              }
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
              kitchenOpen ? 'bg-green-600/20 border border-green-500/40' : 'bg-red-600/20 border border-red-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Power className={`w-5 h-5 ${kitchenOpen ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`font-semibold text-sm ${kitchenOpen ? 'text-green-300' : 'text-red-300'}`}>
                {kitchenOpen ? 'Cocina ABIERTA — Recibiendo pedidos' : 'Cocina CERRADA — No se reciben pedidos'}
              </span>
            </div>
            <Switch checked={kitchenOpen} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ShoppingBag} label="Total pedidos" value={stats.total} />
          <StatCard icon={Clock} label="Pendientes" value={stats.pending} color="text-yellow-600" />
          <StatCard icon={ChefHat} label="En preparación" value={stats.preparing} color="text-orange-600" />
          <StatCard icon={TrendingUp} label="Hoy" value={stats.today} color="text-green-600" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          <FilterButton 
            active={selectedStatus === 'all'} 
            onClick={() => setSelectedStatus('all')}
          >
            Todos
          </FilterButton>
          {(Object.keys(statusConfig) as OrderStatus[]).map(status => (
            <FilterButton
              key={status}
              active={selectedStatus === status}
              onClick={() => setSelectedStatus(status)}
            >
              {statusConfig[status].label}
            </FilterButton>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando pedidos...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No hay pedidos</p>
            <p className="text-sm text-muted-foreground/70">
              Los pedidos aparecerán aquí cuando los clientes ordenen
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = 'text-foreground' 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number;
  color?: string;
}) => (
  <div className="bg-card rounded-xl p-4 border border-border">
    <div className="flex items-center gap-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </div>
);

const FilterButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
      active 
        ? 'bg-primary text-primary-foreground' 
        : 'bg-card text-foreground border border-border hover:bg-muted'
    }`}
  >
    {children}
  </button>
);

const printOrder = (order: Order) => {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) return;

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const itemsHtml = order.items.map((item: any) => 
    `<tr>
      <td style="padding:4px 0;border-bottom:1px dashed #ddd;">${item.quantity}x ${item.name || item.productName}</td>
      <td style="padding:4px 0;border-bottom:1px dashed #ddd;text-align:right;">€${((item.price || item.unitPrice || item.totalPrice / item.quantity) * item.quantity).toFixed(2)}</td>
    </tr>
    ${item.options?.length ? `<tr><td colspan="2" style="padding:2px 0 4px 16px;font-size:11px;color:#666;">+ ${item.options.map((o: any) => o.name).join(', ')}</td></tr>` : ''}
    ${item.notes ? `<tr><td colspan="2" style="padding:2px 0 4px 16px;font-size:11px;color:#666;">📝 ${item.notes}</td></tr>` : ''}`
  ).join('');

  printWindow.document.write(`<!DOCTYPE html><html><head><title>Pedido #${order.order_number}</title>
    <style>
      body { font-family: 'Courier New', monospace; max-width: 420px; margin: 0 auto; padding: 16px; font-size: 13px; }
      h1 { text-align: center; font-size: 18px; margin: 0 0 4px; }
      .subtitle { text-align: center; color: #666; margin-bottom: 12px; }
      .divider { border-top: 2px dashed #000; margin: 10px 0; }
      table { width: 100%; border-collapse: collapse; }
      .total-row { font-weight: bold; font-size: 16px; }
      @media print { body { margin: 0; } }
    </style></head><body>
    <h1>TRYB BURGER</h1>
    <p class="subtitle">Pedido #${order.order_number}</p>
    <div class="divider"></div>
    <p><strong>Fecha:</strong> ${formattedDate} ${formattedTime}</p>
    <p><strong>Tipo:</strong> ${orderTypeLabels[order.order_type]}</p>
    ${order.customer_name ? `<p><strong>Cliente:</strong> ${order.customer_name}</p>` : ''}
    ${order.customer_phone ? `<p><strong>Teléfono:</strong> ${order.customer_phone}</p>` : ''}
    ${order.order_type === 'delivery' && order.delivery_address ? `<p><strong>Dirección:</strong> ${order.delivery_address}, ${order.delivery_city}</p>` : ''}
    <div class="divider"></div>
    <table>${itemsHtml}</table>
    <div class="divider"></div>
    <table>
      <tr><td>Subtotal</td><td style="text-align:right;">€${order.subtotal.toFixed(2)}</td></tr>
      ${order.delivery_fee > 0 ? `<tr><td>Envío</td><td style="text-align:right;">€${order.delivery_fee.toFixed(2)}</td></tr>` : ''}
      <tr class="total-row"><td>TOTAL</td><td style="text-align:right;">€${order.total.toFixed(2)}</td></tr>
    </table>
    ${order.notes ? `<div class="divider"></div><p><strong>Notas:</strong> ${order.notes}</p>` : ''}
    <div class="divider"></div>
    <p style="text-align:center;color:#666;font-size:11px;">¡Gracias por tu pedido!</p>
  </body></html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

const OrderCard = ({ 
  order, 
  onUpdateStatus 
}: { 
  order: Order; 
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const [expanded, setExpanded] = useState(false);

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
    delivered: null,
    cancelled: null,
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">#{order.order_number}</span>
            <Badge className={`${status.color} text-white`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {orderTypeLabels[order.order_type]}
            </span>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">€{order.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.created_at)} {formatTime(order.created_at)}
            </p>
          </div>
        </div>
        
        {order.customer_name && (
          <p className="text-sm text-muted-foreground">
            👤 {order.customer_name} {order.customer_phone && `• ${order.customer_phone}`}
          </p>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Items */}
          <div>
            <h4 className="font-semibold mb-2">Productos</h4>
            {order.items.length > 0 ? (
              <ul className="space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="text-sm flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-muted-foreground">€{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin productos</p>
            )}
          </div>

          {/* Delivery Info */}
          {order.order_type === 'delivery' && order.delivery_address && (
            <div>
              <h4 className="font-semibold mb-1">📍 Dirección</h4>
              <p className="text-sm text-muted-foreground">
                {order.delivery_address}, {order.delivery_city}
              </p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div>
              <h4 className="font-semibold mb-1">📝 Notas</h4>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Scheduled */}
          {order.scheduled_for && (
            <div>
              <h4 className="font-semibold mb-1">📅 Programado para</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(order.scheduled_for).toLocaleString('es-ES')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {nextStatus[order.status] && (
              <Button 
                className="flex-1"
                onClick={() => onUpdateStatus(order.id, nextStatus[order.status]!)}
              >
                Marcar como {statusConfig[nextStatus[order.status]!].label}
              </Button>
            )}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button 
                variant="outline"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
              >
                Cancelar
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                printOrder(order);
              }}
              title="Imprimir pedido"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
