import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromo } from "@/hooks/usePromo";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, X } from "lucide-react";

const PromoSection = () => {
  const { promo, loading } = usePromo();
  const { addItem, setIsOpen } = useCart();
  const { getProductById } = useProducts();
  const [extras, setExtras] = useState<string[]>([]);
  const [newExtra, setNewExtra] = useState("");

  if (loading || !promo.enabled) return null;

  const product = promo.productId ? getProductById(promo.productId) : null;

  const handleAddExtra = () => {
    const trimmed = newExtra.trim();
    if (trimmed && !extras.includes(trimmed)) {
      setExtras([...extras, trimmed]);
      setNewExtra("");
    }
  };

  const handleRemoveExtra = (extra: string) => {
    setExtras(extras.filter(e => e !== extra));
  };

  const handleOrder = () => {
    if (!product) {
      toast({ title: "Producto no disponible", variant: "destructive" });
      return;
    }

    const notes = extras.length > 0 ? `Extras: ${extras.join(", ")}` : undefined;
    addItem(product, 1, [], notes);
    setIsOpen(true);
    toast({ title: "✅ Añadido al carrito", description: product.name });
    setExtras([]);
  };

  return (
    <section id="ofertas" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {promo.badge && (
              <span className="inline-block bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full mb-4">
                {promo.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              {promo.title}
            </h2>
            <p className="text-secondary-foreground/80 mb-6 max-w-lg mx-auto md:mx-0">
              {promo.description}
            </p>

            {/* Product details card */}
            {product && (
              <div className="bg-background/95 backdrop-blur rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start max-w-2xl mx-auto md:mx-0 shadow-lg">
                {/* Product image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Product info */}
                <div className="flex-1 text-center md:text-left w-full">
                  <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="text-2xl font-bold text-primary mb-4">
                    {product.price.toFixed(2)} €
                  </div>

                  {/* Extras input */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      ¿Quieres añadir algo más?
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={newExtra}
                        onChange={(e) => setNewExtra(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddExtra()}
                        placeholder="Ej: Extra de queso, pan de ajo..."
                        className="text-sm bg-muted border-border"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleAddExtra}
                        disabled={!newExtra.trim()}
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {extras.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {extras.map((extra) => (
                          <span
                            key={extra}
                            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                          >
                            {extra}
                            <button onClick={() => handleRemoveExtra(extra)} className="hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleOrder}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 w-full md:w-auto"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {promo.buttonText || "Pedir ahora"}
                  </Button>
                </div>
              </div>
            )}

            {/* Fallback if no product linked */}
            {!product && promo.buttonText && (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8"
                onClick={() => window.location.href = promo.buttonLink || "/menu"}
              >
                {promo.buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
