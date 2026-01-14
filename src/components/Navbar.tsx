import { ShoppingCart, Menu, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-primary">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Tryb Burger" className="h-12 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#menu" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Menú
            </a>
            <a href="#ofertas" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Ofertas
            </a>
            <a href="#contacto" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Contacto
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex font-bold text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/admin')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          {user ? (
            <Button 
              variant="secondary" 
              size="sm"
              className="hidden sm:flex font-bold rounded-full"
              onClick={() => navigate('/perfil')}
            >
              <User className="w-4 h-4 mr-2" />
              Mi perfil
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="sm"
              className="hidden sm:flex font-bold rounded-full"
              onClick={() => navigate('/auth')}
            >
              Iniciar sesión
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold border-2 border-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>
          {user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden text-primary-foreground"
              onClick={() => navigate('/perfil')}
            >
              <User className="w-6 h-6" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-primary-foreground"
            >
              <Menu className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
