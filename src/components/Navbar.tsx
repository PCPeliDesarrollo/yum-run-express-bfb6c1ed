import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-primary">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-primary-foreground tracking-tight">
            FOODRUSH
          </span>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Menú
            </a>
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Ofertas
            </a>
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground font-semibold text-sm transition-colors">
              Restaurantes
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            className="hidden sm:flex font-bold rounded-full"
          >
            Iniciar sesión
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs text-accent-foreground flex items-center justify-center font-bold">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
