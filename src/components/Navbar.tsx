import { ShoppingCart, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">🍔</span>
          </div>
          <span className="text-xl font-bold text-foreground">FoodRush</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Entregar en:</span>
          <span className="text-sm text-muted-foreground">Tu ubicación</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="icon" size="icon" className="rounded-full relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 gradient-primary rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold">
              0
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
