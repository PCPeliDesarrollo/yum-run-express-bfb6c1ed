import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Truck, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useKitchenStatus } from "@/hooks/useKitchenStatus";
import { z } from "zod";

// Solo domicilio por ahora
type OrderType = "delivery";

const customerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  phone: z.string().trim().min(9, "El teléfono debe tener al menos 9 dígitos").max(15, "El teléfono es demasiado largo"),
  email: z.string().trim().email("Email inválido").max(255, "El email es demasiado largo").optional().or(z.literal("")),
});

const deliverySchema = z.object({
  address: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").max(200, "La dirección es demasiado larga"),
  city: z.string().trim().min(2, "La ciudad debe tener al menos 2 caracteres").max(100, "La ciudad es demasiado larga"),
  postalCode: z.string().trim().min(4, "El código postal debe tener al menos 4 dígitos").max(10, "El código postal es demasiado largo"),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, setIsOpen } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOpen: kitchenOpen, loading: kitchenLoading } = useKitchenStatus();

  const orderType: OrderType = "delivery";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Customer data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Delivery data
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  

  // Load profile data to pre-fill fields
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city, postal_code")
        .eq("id", user.id)
        .single();
      if (data) {
        if (data.full_name) setName(data.full_name);
        if (data.phone) setPhone(data.phone);
        if (data.address) setAddress(data.address);
        if (data.city) setCity(data.city);
        if (data.postal_code) setPostalCode(data.postal_code);
      }
      
    };
    loadProfile();
  }, [user]);

  // Notes
  const [orderNotes, setOrderNotes] = useState("");

  const deliveryFee = orderType === "delivery" ? 1.80 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate customer data
    const customerResult = customerSchema.safeParse({ name, phone, email });
    if (!customerResult.success) {
      customerResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
    }

    // Validate delivery data if delivery type
    if (orderType === "delivery") {
      const deliveryResult = deliverySchema.safeParse({ address, city, postalCode });
      if (!deliveryResult.success) {
        deliveryResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
      if (!addressConfirmed) {
        newErrors.addressConfirmed = "Debes confirmar que la dirección es correcta";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!kitchenOpen) {
      toast({
        title: "Cocina cerrada",
        description: "En este momento no estamos aceptando pedidos. Inténtalo más tarde.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, revisa los campos marcados en rojo",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Añade productos antes de realizar el pedido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        options: item.selectedOptions.map((o) => ({ name: o.name, price: o.price })),
        notes: item.notes,
        totalPrice: item.totalPrice,
      }));

      const { error } = await supabase.from("orders").insert({
        user_id: user?.id || null,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || null,
        order_type: orderType,
        delivery_address: orderType === "delivery" ? address.trim() : null,
        delivery_city: orderType === "delivery" ? city.trim() : null,
        delivery_postal_code: orderType === "delivery" ? postalCode.trim() : null,
        items: orderItems,
        subtotal: totalPrice,
        delivery_fee: deliveryFee,
        total: finalTotal,
        notes: orderNotes.trim() || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "¡Pedido realizado! 🎉",
        description: "Recibirás tu pedido pronto. ¡Gracias!",
      });

      clearCart();
      navigate("/");
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error al realizar el pedido",
        description: error.message || "Inténtalo de nuevo más tarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-4">Añade algunos productos para continuar</p>
          <Button onClick={() => navigate("/")} className="rounded-full">
            Volver al menú
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border safe-top">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 safe-x">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(true);
              navigate(-1);
            }}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Finalizar pedido</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Kitchen Closed Banner */}
        {!kitchenLoading && !kitchenOpen && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive">Cocina cerrada</p>
              <p className="text-sm text-muted-foreground">No estamos aceptando pedidos en este momento.</p>
            </div>
          </div>
        )}
        {/* Order Type Selection */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">¿Cómo quieres tu pedido?</h2>
          <RadioGroup
            value={orderType}
            onValueChange={(value) => setOrderType(value as OrderType)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <Label
              htmlFor="delivery"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                orderType === "delivery"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
              <Truck className={`w-8 h-8 ${orderType === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">A domicilio</span>
              <span className="text-xs text-muted-foreground">+€1,80</span>
            </Label>

            <Label
              htmlFor="pickup"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                orderType === "pickup"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
              <Store className={`w-8 h-8 ${orderType === "pickup" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">Recoger</span>
              <span className="text-xs text-muted-foreground">Gratis</span>
            </Label>

            <Label
              htmlFor="dine_in"
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                orderType === "dine_in"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <RadioGroupItem value="dine_in" id="dine_in" className="sr-only" />
              <UtensilsCrossed className={`w-8 h-8 ${orderType === "dine_in" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">En local</span>
              <span className="text-xs text-muted-foreground">Gratis</span>
            </Label>
          </RadioGroup>
        </section>

        <Separator className="my-6" />

        {/* Customer Data */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Tus datos</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Tu teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>
        </section>

        {/* Delivery Address */}
        {orderType === "delivery" && (
          <>
            <Separator className="my-6" />
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Dirección de entrega
              </h2>

              {/* Warning to verify address */}
              <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Verifica que la dirección es correcta. Si hoy estás en otro sitio, modifícala antes de confirmar.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, piso..."
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setAddressConfirmed(false); }}
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      placeholder="Tu ciudad"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); setAddressConfirmed(false); }}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Código postal *</Label>
                    <Input
                      id="postalCode"
                      placeholder="12345"
                      value={postalCode}
                      onChange={(e) => { setPostalCode(e.target.value); setAddressConfirmed(false); }}
                      className={errors.postalCode ? "border-destructive" : ""}
                    />
                    {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                {/* Address confirmation checkbox */}
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={addressConfirmed}
                    onChange={(e) => setAddressConfirmed(e.target.checked)}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <span className="text-sm font-medium">Confirmo que la dirección de entrega es correcta</span>
                </label>
                {errors.addressConfirmed && <p className="text-xs text-destructive mt-1">{errors.addressConfirmed}</p>}
              </div>
            </section>
          </>
        )}

        <Separator className="my-6" />

        {/* Order Notes */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Notas del pedido</h2>
          <Textarea
            placeholder="¿Alguna indicación especial para el repartidor o la cocina?"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
        </section>

        <Separator className="my-6" />

        {/* Order Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                  {item.selectedOptions.length > 0 && (
                    <span className="block text-xs">
                      + {item.selectedOptions.map((o) => o.name).join(", ")}
                    </span>
                  )}
                </span>
                <span className="font-medium">€{item.totalPrice.toFixed(2)}</span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>

            {orderType === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gastos de envío</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">€{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <div className="container mx-auto max-w-2xl">
          <Button
            variant="destructive"
            size="xl"
            className="w-full rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : `Confirmar pedido · €${finalTotal.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
