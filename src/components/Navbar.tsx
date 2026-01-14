import { ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-primary">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-foreground" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              tryb
            </span>
            <span className="text-lg font-medium text-primary-foreground/80" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              burger
            </span>
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
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold border-2 border-white">
              0
            </span>
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
