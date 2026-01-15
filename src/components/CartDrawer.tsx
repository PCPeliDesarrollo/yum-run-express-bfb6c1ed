import { Minus, Plus, Trash2, X, ShoppingBag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="w-5 h-5" />
              Tu pedido
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground text-sm">
              Añade algunos productos deliciosos para empezar
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-muted/30 rounded-xl p-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.selectedOptions.map((o) => o.name).join(", ")}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1">
                        <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="italic line-clamp-2">{item.notes}</span>
                      </p>
                    )}
                    <p className="text-primary font-bold mt-1">
                      €{item.totalPrice.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="pt-4 space-y-4 border-t mt-auto"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
            >
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                  Vaciar carrito
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">€{totalPrice.toFixed(2)}</span>
              </div>

              <Button
                className="w-full h-12 text-base font-bold rounded-full"
                size="lg"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/checkout");
                }}
              >
                Pagar
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
