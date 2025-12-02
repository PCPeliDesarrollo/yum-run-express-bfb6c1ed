import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="gradient-hero py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in">
            Tu comida favorita,{" "}
            <span className="text-primary">en minutos</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Descubre los mejores restaurantes cerca de ti y recibe tu pedido en la puerta de tu casa
          </p>
          
          <div className="relative max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center bg-card rounded-2xl shadow-card p-2 border border-border">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes o platillos..."
                  className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button variant="hero" className="rounded-xl">
                Buscar
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {["Pizza", "Hamburguesas", "Sushi", "Tacos", "Pollo"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-card rounded-full text-sm font-medium text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
