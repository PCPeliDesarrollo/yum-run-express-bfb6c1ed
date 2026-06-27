import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
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
  Printer,
  Pencil,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import AdminMenuManager from '@/components/AdminMenuManager';
import { Switch } from '@/components/ui/switch';
import { useKitchenStatus } from '@/hooks/useKitchenStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePromo } from '@/hooks/usePromo';
import type { PromoData } from '@/hooks/usePromo';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'promo' | 'horario' | 'historial'>('orders');
  const { isOpen: kitchenOpen, toggleKitchen, schedule, scheduleLoading, updateSchedule } = useKitchenStatus();
  const { promo, updatePromo, loading: promoLoading } = usePromo();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      // Create a beep sound using Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // 3 beeps
      playBeep(880, ctx.currentTime, 0.15);
      playBeep(880, ctx.currentTime + 0.2, 0.15);
      playBeep(1100, ctx.currentTime + 0.4, 0.3);
    } catch (e) {
      console.warn('Could not play notification sound', e);
    }
  }, []);

  const showOrderNotification = useCallback((order: Order) => {
    playNotificationSound();

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 ¡Nuevo pedido!', {
        body: `Pedido #${order.order_number} — €${Number(order.total).toFixed(2)}`,
        icon: '/logo_tryb.jpg',
        tag: `order-${order.id}`,
      });
    }

    // In-app toast
    toast({
      title: '🔔 ¡Nuevo pedido!',
      description: `Pedido #${order.order_number} — €${Number(order.total).toFixed(2)}`,
    });
  }, [playNotificationSound, toast]);

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
          { event: 'INSERT', schema: 'public', table: 'orders' },
          (payload) => {
            const newOrder = payload.new as Order;
            fetchOrders();
            // Notify admin
            if (newOrder) {
              showOrderNotification(newOrder);
              // Auto-print
              setTimeout(() => printOrder(newOrder), 1000);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders' },
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
        <div className="container mx-auto px-4 pb-3 space-y-2">
          <button
            onClick={async () => {
              try {
                await toggleKitchen(!kitchenOpen);
                toast({
                  title: kitchenOpen ? '🔴 Cocina cerrada' : '🟢 Cocina abierta',
                  description: kitchenOpen
                    ? 'Ya no se reciben pedidos (override manual activo)'
                    : 'Ahora se aceptan pedidos (override manual activo)',
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
          {/* Schedule info */}
          {!scheduleLoading && schedule.slots.length > 0 && (
            <div className="flex items-center gap-2 px-2">
              <Clock className="w-3.5 h-3.5 text-background/50" />
              <span className="text-xs text-background/50">
                Horario: {schedule.slots.map(s => `${s.open}–${s.close}`).join(' y ')}
              </span>
            </div>
          )}
        </div>
        {/* Tab Navigation */}
        <div className="container mx-auto px-4 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              📦 Pedidos
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'menu' ? 'bg-primary text-primary-foreground' : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              🍽️ Carta
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'promo' ? 'bg-primary text-primary-foreground' : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              📢 Ofertas
            </button>
            <button
              onClick={() => setActiveTab('horario')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'horario' ? 'bg-primary text-primary-foreground' : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              🕐 Horario
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'historial' ? 'bg-primary text-primary-foreground' : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              🗂️ Historial
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeTab === 'horario' ? (
          <ScheduleEditor schedule={schedule} onSave={updateSchedule} loading={scheduleLoading} toast={toast} />
        ) : activeTab === 'promo' ? (
          <PromoEditor promo={promo} onSave={updatePromo} loading={promoLoading} toast={toast} />
        ) : activeTab === 'menu' ? (
          <AdminMenuManager />
        ) : activeTab === 'historial' ? (
          <OrdersHistory orders={orders} onRefresh={fetchOrders} toast={toast} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard icon={ShoppingBag} label="Total pedidos" value={stats.total} />
              <StatCard icon={Clock} label="Pendientes" value={stats.pending} color="text-yellow-600" />
              <StatCard icon={ChefHat} label="En preparación" value={stats.preparing} color="text-orange-600" />
              <StatCard icon={TrendingUp} label="Hoy" value={stats.today} color="text-green-600" />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Leyenda:</span>
              {(['preparing', 'ready'] as OrderStatus[]).map(status => {
                const Icon = statusConfig[status].icon;
                const label = status === 'preparing' ? 'Recibido en cocina' : 'En reparto';
                return (
                  <span key={status} className="inline-flex items-center gap-1.5">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${statusConfig[status].color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </span>
                    <span>{label}</span>
                  </span>
                );
              })}
              <span className="text-muted-foreground/80">· Se cierra automáticamente 20 min después de pasar a reparto.</span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
              <FilterButton
                active={selectedStatus === 'all'}
                onClick={() => setSelectedStatus('all')}
                activeClasses="bg-foreground text-background border-foreground"
                inactiveClasses="bg-card text-foreground border-border hover:bg-muted"
                count={orders.length}
              >
                📋 Todos
              </FilterButton>
              {(['preparing', 'ready', 'cancelled'] as OrderStatus[]).map(status => {
                const Icon = statusConfig[status].icon;
                const count = orders.filter(o => o.status === status).length;
                const colorMap: Record<OrderStatus, { active: string; inactive: string }> = {
                  pending:   { active: 'bg-yellow-500 text-white border-yellow-500',  inactive: 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800' },
                  confirmed: { active: 'bg-blue-500 text-white border-blue-500',      inactive: 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' },
                  preparing: { active: 'bg-orange-500 text-white border-orange-500',  inactive: 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' },
                  ready:     { active: 'bg-green-500 text-white border-green-500',    inactive: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800' },
                  delivered: { active: 'bg-gray-500 text-white border-gray-500',      inactive: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' },
                  cancelled: { active: 'bg-red-500 text-white border-red-500',        inactive: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-800' },
                };
                return (
                  <FilterButton
                    key={status}
                    active={selectedStatus === status}
                    onClick={() => setSelectedStatus(status)}
                    activeClasses={colorMap[status].active}
                    inactiveClasses={colorMap[status].inactive}
                    count={count}
                  >
                    <Icon className="w-4 h-4" />
                    {statusConfig[status].label}
                  </FilterButton>
                );
              })}
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
              <OrdersByDay orders={filteredOrders} onUpdateStatus={updateOrderStatus} />
            )}
          </>
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
  onClick,
  activeClasses = 'bg-primary text-primary-foreground border-primary',
  inactiveClasses = 'bg-card text-foreground border-border hover:bg-muted',
  count,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  activeClasses?: string;
  inactiveClasses?: string;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border-2 inline-flex items-center gap-1.5 shadow-sm ${
      active ? `${activeClasses} scale-105 shadow-md` : inactiveClasses
    }`}
  >
    {children}
    {typeof count === 'number' && (
      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
        active ? 'bg-white/25' : 'bg-black/10 dark:bg-white/10'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const PromoEditor = ({ 
  promo, 
  onSave, 
  loading, 
  toast 
}: { 
  promo: PromoData; 
  onSave: (p: PromoData) => Promise<{ error: any }>; 
  loading: boolean;
  toast: any;
}) => {
  const [form, setForm] = useState<PromoData>(promo);
  const [saving, setSaving] = useState(false);
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; category: string; price: number }[]>([]);

  useEffect(() => {
    setForm(promo);
  }, [promo]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, category, price')
        .eq('available', true)
        .order('category')
        .order('name');
      if (data) setAllProducts(data);
    };
    fetchProducts();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await onSave(form);
    setSaving(false);
    toast({
      title: error ? 'Error' : '✅ Guardado',
      description: error ? 'No se pudo guardar la oferta' : 'La oferta se ha actualizado',
      variant: error ? 'destructive' : 'default',
    });
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📢 Gestión de Ofertas</h2>
      </div>

      <div className="bg-card rounded-2xl p-6 space-y-4 border border-border">
        {/* Enabled toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Oferta activa</Label>
          <Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
        </div>

        <div className="space-y-2">
          <Label>Etiqueta (badge)</Label>
          <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="OFERTA ESPECIAL" />
        </div>

        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="¡Combo por solo €9.99!" />
        </div>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Hamburguesa + Patatas + Bebida..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Producto vinculado</Label>
          <select
            value={form.productId || ''}
            onChange={(e) => setForm({ ...form, productId: e.target.value || undefined })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Sin producto (solo enlace)</option>
            {allProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.category} — {p.name} ({p.price.toFixed(2)}€)
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Si seleccionas un producto, el botón lo añadirá directamente al carrito.</p>
        </div>

        {/* Extras fuera de carta */}
        {form.productId && (
          <div className="space-y-2">
            <Label>Extras (fuera de carta)</Label>
            <p className="text-xs text-muted-foreground">Añade cosas que no están en la carta para incluir en esta oferta</p>
            <div className="flex gap-2">
              <Input
                id="extra-input"
                placeholder="Ej: Patatas, Bebida, Pan de ajo..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.currentTarget;
                    const val = input.value.trim();
                    if (val && !(form.extras || []).includes(val)) {
                      setForm({ ...form, extras: [...(form.extras || []), val] });
                      input.value = '';
                    }
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.getElementById('extra-input') as HTMLInputElement;
                  const val = input?.value.trim();
                  if (val && !(form.extras || []).includes(val)) {
                    setForm({ ...form, extras: [...(form.extras || []), val] });
                    input.value = '';
                  }
                }}
              >
                Añadir
              </Button>
            </div>
            {(form.extras || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {(form.extras || []).map((extra) => (
                  <span key={extra} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {extra}
                    <button
                      onClick={() => setForm({ ...form, extras: (form.extras || []).filter(e => e !== extra) })}
                      className="hover:text-destructive ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Texto del botón</Label>
            <Input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Pedir ahora" />
          </div>
          {!form.productId && (
            <div className="space-y-2">
              <Label>Enlace del botón</Label>
              <Input value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} placeholder="/menu" />
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full py-6 text-lg font-bold rounded-xl">
          {saving ? 'Guardando...' : '💾 Guardar oferta'}
        </Button>
      </div>

      {/* Preview */}
      {form.enabled && (
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-6 text-center">
          {form.badge && <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">{form.badge}</span>}
          <h3 className="text-xl font-bold text-secondary-foreground mb-2">{form.title}</h3>
          <p className="text-secondary-foreground/80 text-sm">{form.description}</p>
          {form.productId && <p className="text-xs text-secondary-foreground/60 mt-2">🔗 Vinculado a producto</p>}
        </div>
      )}
    </div>
  );
};

const ScheduleEditor = ({
  schedule,
  onSave,
  loading,
  toast,
}: {
  schedule: import('@/hooks/useKitchenStatus').KitchenSchedule;
  onSave: (s: import('@/hooks/useKitchenStatus').KitchenSchedule) => Promise<void>;
  loading: boolean;
  toast: any;
}) => {
  const [slots, setSlots] = useState(schedule.slots.length > 0 ? schedule.slots : [{ open: '12:00', close: '15:30' }, { open: '20:00', close: '23:30' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule.slots.length > 0) {
      setSlots(schedule.slots);
    }
  }, [schedule]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ slots });
      toast({ title: '✅ Horario guardado', description: 'El horario se ha actualizado correctamente' });
    } catch {
      toast({ title: 'Error', description: 'No se pudo guardar el horario', variant: 'destructive' });
    }
    setSaving(false);
  };

  const updateSlot = (index: number, field: 'open' | 'close', value: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { open: '12:00', close: '15:00' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground">Cargando...</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold">🕐 Horario de Cocina</h2>
      <p className="text-sm text-muted-foreground">
        La cocina se abrirá y cerrará automáticamente según este horario. El botón manual sigue funcionando para cerrar antes si hace falta.
      </p>

      <div className="bg-card rounded-2xl p-6 space-y-4 border border-border">
        {slots.map((slot, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Apertura</Label>
              <Input
                type="time"
                value={slot.open}
                onChange={(e) => updateSlot(index, 'open', e.target.value)}
              />
            </div>
            <span className="text-muted-foreground mt-5">—</span>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Cierre</Label>
              <Input
                type="time"
                value={slot.close}
                onChange={(e) => updateSlot(index, 'close', e.target.value)}
              />
            </div>
            {slots.length > 1 && (
              <button
                onClick={() => removeSlot(index)}
                className="mt-5 text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addSlot}
          className="w-full py-2 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          + Añadir turno
        </button>

        <Button onClick={handleSave} disabled={saving} className="w-full py-6 text-lg font-bold rounded-xl">
          {saving ? 'Guardando...' : '💾 Guardar horario'}
        </Button>
      </div>
    </div>
  );
};

const buildTicketHtml = (order: Order): string => {
  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const formatOption = (name: string) => {
    const lower = name.toLowerCase().trim();
    // Special: removals ("sin X") or extras ("extra X", "+X") -> UPPERCASE BOLD UNDERLINE
    const isSpecial = lower.startsWith('sin ') || lower.startsWith('extra ') || lower.startsWith('+') || lower.startsWith('con extra');
    if (isSpecial) {
      return `<span style="text-transform:uppercase;font-weight:900;text-decoration:underline;">${name}</span>`;
    }
    return name;
  };

  const itemsHtml = order.items.map((item: any) => {
    const qty = item.quantity || 1;
    const unit = item.unitPrice || item.price || 0;
    const isGF = item.isGlutenFree === true || (typeof item.category === 'string' && item.category.toLowerCase().includes('sin gluten'));
    const nameCell = isGF
      ? `<span style="text-transform:uppercase;font-weight:900;font-size:20px;background:#000;color:#fff;padding:2px 6px;">🌾 SIN GLUTEN · ${item.productName || item.name}</span>`
      : `${item.productName || item.name}`;
    const optsRow = item.options?.length
      ? `<tr><td colspan="2" style="padding:2px 0 4px 16px;font-size:13px;color:#000;font-weight:bold;">▸ ${item.options.map((o: any) => formatOption(o.name)).join(', ')}</td></tr>`
      : '';
    const notesRow = item.notes
      ? `<tr><td colspan="2" style="padding:2px 0 4px 16px;font-size:12px;color:#000;font-weight:bold;">📝 ${item.notes}</td></tr>`
      : '';
    // Desglose: una línea por unidad
    return Array.from({ length: qty }).map((_, i) => `
      <tr>
        <td style="padding:4px 0;border-bottom:1px dashed #ddd;">1x ${nameCell}${qty > 1 ? ` <span style="font-size:11px;color:#000;">(${i + 1}/${qty})</span>` : ''}</td>
        <td style="padding:4px 0;border-bottom:1px dashed #ddd;text-align:right;">€${unit.toFixed(2)}</td>
      </tr>
      ${optsRow}
      ${notesRow}
    `).join('');
  }).join('');

  return `<!DOCTYPE html><html><head><title>Pedido #${order.order_number}</title>
    <style>
      body { font-family: 'Courier New', monospace; max-width: 420px; margin: 0 auto; padding: 16px; font-size: 14px; color: #000; font-weight: bold; }
      h1 { text-align: center; font-size: 20px; margin: 0 0 4px; font-weight: 900; }
      .subtitle { text-align: center; color: #000; margin-bottom: 12px; font-weight: bold; font-size: 15px; }
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
    ${order.customer_name ? `<p style="font-size:18px;font-weight:900;margin:6px 0;">👤 ${order.customer_name}</p>` : ''}
    ${order.customer_phone ? `<p style="font-size:22px;font-weight:900;margin:6px 0;border:2px solid #000;padding:6px 8px;text-align:center;">📞 ${order.customer_phone}</p>` : ''}
    ${order.order_type === 'delivery' && order.delivery_address ? `<p style="font-size:20px;font-weight:900;margin:6px 0;border:2px solid #000;padding:8px;text-align:center;line-height:1.3;">📍 ${order.delivery_address}<br/>${order.delivery_city || ''}</p>` : ''}
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
    <p style="text-align:center;color:#000;font-size:12px;font-weight:bold;">¡Gracias por tu pedido!</p>
  </body></html>`;
};

// Auto-print using a hidden iframe — works without popup blocker / user gesture
const printOrder = (order: Order) => {
  const html = buildTicketHtml(order);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('[Print] failed:', e);
    }
    setTimeout(() => {
      try { document.body.removeChild(iframe); } catch {}
    }, 60000);
  };

  if (iframe.contentWindow?.document.readyState === 'complete') {
    setTimeout(triggerPrint, 200);
  } else {
    iframe.onload = () => setTimeout(triggerPrint, 200);
  }
};

const OrdersByDay = ({ 
  orders, 
  onUpdateStatus 
}: { 
  orders: Order[]; 
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) => {
  const groupedOrders = useMemo(() => {
    const groups: Record<string, Order[]> = {};
    orders.forEach(order => {
      const dateKey = new Date(order.created_at).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(order);
    });
    return Object.entries(groups);
  }, [orders]);

  // First group (today) open by default, rest collapsed
  const [openDays, setOpenDays] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const todayKey = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    initial[todayKey] = true;
    return initial;
  });

  const toggleDay = (dateLabel: string) => {
    setOpenDays(prev => ({ ...prev, [dateLabel]: !prev[dateLabel] }));
  };

  return (
    <div className="space-y-4">
      {groupedOrders.map(([dateLabel, dayOrders]) => {
        const isOpen = openDays[dateLabel] ?? false;
        return (
          <div key={dateLabel} className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => toggleDay(dateLabel)}
              className="w-full flex items-center gap-2 bg-card hover:bg-muted/50 transition-colors py-3 px-4"
            >
              {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <CalendarDays className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm capitalize text-foreground">{dateLabel}</h3>
              <Badge variant="secondary" className="ml-auto text-xs">{dayOrders.length} pedido{dayOrders.length !== 1 ? 's' : ''}</Badge>
            </button>
            {isOpen && (
              <div className="p-4 space-y-4 bg-muted/20">
                {dayOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={onUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
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
  const [editOpen, setEditOpen] = useState(false);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const openEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItems(JSON.parse(JSON.stringify(order.items || [])));
    setEditAddress(order.delivery_address || '');
    setEditPhone(order.customer_phone || '');
    setEditNotes(order.notes || '');
    setEditOpen(true);
  };

  const changeQty = (idx: number, delta: number) => {
    setEditItems((prev) => {
      const next = [...prev];
      const newQty = (next[idx].quantity || 0) + delta;
      if (newQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], quantity: newQty };
      }
      return next;
    });
  };

  const removeItem = (idx: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const newSubtotal = editItems.reduce(
    (s, it) => s + (it.unitPrice || it.price || 0) * (it.quantity || 0),
    0
  );
  const newTotal = newSubtotal + Number(order.delivery_fee || 0);

  const saveEdit = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('orders')
      .update({
        items: editItems,
        subtotal: newSubtotal,
        total: newTotal,
        delivery_address: editAddress || null,
        customer_phone: editPhone || null,
        notes: editNotes || null,
      })
      .eq('id', order.id);
    setSaving(false);
    if (error) {
      alert('Error al guardar: ' + error.message);
      return;
    }
    setEditOpen(false);
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
              {order.order_type === 'delivery' && order.status === 'ready' ? 'En reparto' : status.label}
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
                  <li key={idx} className="text-sm">
                    <div className="flex justify-between">
                      <span>{item.quantity}x {item.productName || item.name}</span>
                      <span className="text-muted-foreground">€{((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.options?.length > 0 && (
                      <div className="ml-4 text-xs font-semibold text-orange-600">
                        ▸ {item.options.map((o: any) => o.name).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="ml-4 text-xs text-muted-foreground">📝 {item.notes}</div>
                    )}
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

          {/* Status Flow Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Simplified 2-step flow */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="grid grid-cols-2 gap-3">
                {/* En Cocina button */}
                {(order.status === 'pending' || order.status === 'confirmed') ? (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'preparing')}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center transition-all bg-orange-500 text-white font-bold shadow-lg hover:bg-orange-600 active:scale-95"
                  >
                    <span className="text-2xl">👨‍🍳</span>
                    <span className="text-sm font-bold">En Cocina</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center bg-orange-500/20 border-2 border-orange-500">
                    <span className="text-2xl">👨‍🍳</span>
                    <span className="text-sm font-bold text-orange-600">En Cocina ✓</span>
                  </div>
                )}

                {/* Reparto / Listo para recoger button */}
                {order.order_type === 'pickup' || order.order_type === 'dine_in' ? (
                  <>
                    {order.status === 'preparing' ? (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'ready')}
                        className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center transition-all bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 active:scale-95"
                      >
                        <span className="text-2xl">🔔</span>
                        <span className="text-sm font-bold">Avisar al cliente</span>
                      </button>
                    ) : order.status === 'ready' ? (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'delivered')}
                        className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center transition-all bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 active:scale-95"
                      >
                        <span className="text-2xl">✅</span>
                        <span className="text-sm font-bold">Entregado</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center bg-muted border-2 border-border">
                        <span className="text-2xl">🔔</span>
                        <span className="text-sm font-bold text-muted-foreground">Avisar al cliente</span>
                      </div>
                    )}
                  </>
                ) : order.status === 'preparing' ? (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'ready')}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center transition-all bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 active:scale-95"
                  >
                    <span className="text-2xl">🚀</span>
                    <span className="text-sm font-bold">Reparto</span>
                  </button>
                ) : order.status === 'ready' ? (
                  <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center bg-green-600/20 border-2 border-green-500">
                    <span className="text-2xl">🚀</span>
                    <span className="text-sm font-bold text-green-700">En reparto</span>
                    <span className="text-[10px] text-muted-foreground">Se cierra en 20 min</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl text-center bg-muted border-2 border-border">
                    <span className="text-2xl">🚀</span>
                    <span className="text-sm font-bold text-muted-foreground">Reparto</span>
                  </div>
                )}

              </div>
            )}

            {/* Delivered state */}
            {order.status === 'delivered' && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/20 border-2 border-green-500">
                <span className="text-xl">✅</span>
                <span className="text-sm font-bold text-green-600">Pedido Entregado</span>
              </div>
            )}

            {/* Cancelled state */}
            {order.status === 'cancelled' && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600/20 border-2 border-red-500">
                <span className="text-xl">❌</span>
                <span className="text-sm font-bold text-red-600">Pedido Cancelado</span>
              </div>
            )}

            {/* Edit + Cancel + Print row */}
            <div className="flex gap-2">
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 py-3 text-base font-bold border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={openEdit}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 py-3 text-base font-bold"
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  >
                    ❌ Cancelar
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-border text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  printOrder(order);
                }}
                title="Imprimir pedido"
              >
                <Printer className="w-5 h-5" />
              </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Editar Pedido #{order.order_number}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Productos</Label>
                    {editItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">Sin productos</p>
                    ) : (
                      <ul className="space-y-2 mt-2">
                        {editItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 p-2 rounded-lg border border-border">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{item.productName || item.name}</p>
                              <p className="text-xs text-muted-foreground">€{(item.unitPrice || item.price || 0).toFixed(2)} c/u</p>
                            </div>
                            <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => changeQty(idx, -1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center font-bold">{item.quantity}</span>
                            <Button type="button" size="icon" variant="outline" className="h-8 w-8" onClick={() => changeQty(idx, 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => removeItem(idx)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Subtotal</span><span>€{newSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span><span>€{Number(order.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span><span className="text-primary">€{newTotal.toFixed(2)}</span>
                  </div>

                  {order.order_type === 'delivery' && (
                    <div>
                      <Label>Dirección</Label>
                      <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                    </div>
                  )}
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>Notas</Label>
                    <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                  <Button onClick={saveEdit} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const OrdersHistory = ({
  orders,
  onRefresh,
  toast,
}: {
  orders: Order[];
  onRefresh: () => void;
  toast: any;
}) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const map = new Map<string, { key: string; label: string; year: number; month: number; orders: Order[]; total: number }>();
    for (const o of orders) {
      const d = new Date(o.created_at);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { key, label: `${MONTH_NAMES[m]} ${y}`, year: y, month: m, orders: [], total: 0 });
      }
      const g = map.get(key)!;
      g.orders.push(o);
      g.total += Number(o.total || 0);
    }
    return Array.from(map.values()).sort((a, b) =>
      a.year !== b.year ? b.year - a.year : b.month - a.month
    );
  }, [orders]);

  const deleteMonth = async (g: { key: string; year: number; month: number; label: string }) => {
    setDeleting(g.key);
    const start = new Date(g.year, g.month, 1).toISOString();
    const end = new Date(g.year, g.month + 1, 1).toISOString();
    const { error } = await supabase
      .from('orders')
      .delete()
      .gte('created_at', start)
      .lt('created_at', end);
    setDeleting(null);
    setConfirmKey(null);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Eliminado', description: `Pedidos de ${g.label} borrados` });
      onRefresh();
    }
  };

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay pedidos en el historial todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
        Los pedidos se guardan agrupados por mes. Pulsa <strong>Borrar mes</strong> para eliminar todos los pedidos de ese mes de forma permanente.
      </div>
      {groups.map((g) => {
        const isOpen = expanded[g.key];
        const isConfirming = confirmKey === g.key;
        return (
          <div key={g.key} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-3">
              <button
                className="flex-1 flex items-center gap-2 text-left"
                onClick={() => setExpanded((s) => ({ ...s, [g.key]: !s[g.key] }))}
              >
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <div>
                  <p className="font-bold capitalize">{g.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.orders.length} pedido{g.orders.length === 1 ? '' : 's'} · €{g.total.toFixed(2)}
                  </p>
                </div>
              </button>
              {isConfirming ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleting === g.key}
                    onClick={() => deleteMonth(g)}
                  >
                    {deleting === g.key ? 'Borrando...' : 'Confirmar'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirmKey(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirmKey(g.key)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Borrar mes
                </Button>
              )}
            </div>
            {isOpen && (
              <div className="border-t border-border divide-y divide-border">
                {g.orders.map((o) => (
                  <div key={o.id} className="px-4 py-2 text-sm flex justify-between items-center">
                    <div>
                      <span className="font-semibold">#{o.order_number}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(o.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">{statusConfig[o.status]?.label}</span>
                    </div>
                    <span className="font-bold text-primary">€{Number(o.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Admin;
