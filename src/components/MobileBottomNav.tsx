import { Home, ShoppingCart, Package, User, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useCart } from "@/contexts/CartContext";

const MobileBottomNav = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Inicio</span>
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors text-muted-foreground relative"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 right-0 w-4 h-4 bg-primary rounded-full text-[9px] text-primary-foreground flex items-center justify-center font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
          <span className="text-[10px] font-semibold">Carrito</span>
        </button>

        {user && (
          <button
            onClick={() => navigate("/mis-pedidos")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
              isActive("/mis-pedidos") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Pedidos</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
              isActive("/admin") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Admin</span>
          </button>
        )}

        <button
          onClick={() => navigate(user ? "/perfil" : "/auth")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            isActive("/perfil") || isActive("/auth") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{user ? "Perfil" : "Entrar"}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
