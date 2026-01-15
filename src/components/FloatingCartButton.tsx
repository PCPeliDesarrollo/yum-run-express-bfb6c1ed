import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

const FloatingCartButton = () => {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // En checkout ya existe el botón principal de pagar
  if (location.pathname === "/checkout") return null;

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:w-auto">
      <Button
        onClick={() => navigate("/checkout")}
        className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-6 px-6 rounded-full shadow-2xl flex items-center justify-center gap-3 text-lg"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        </div>
        <span>Pagar</span>
        <span className="bg-primary/20 px-3 py-1 rounded-full">€{totalPrice.toFixed(2)}</span>
      </Button>
    </div>
  );
};

export default FloatingCartButton;
