import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-secondary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-secondary-foreground mb-4 leading-tight">
              PIDE TU
              <br />
              <span className="text-primary">COMIDA FAVORITA</span>
            </h1>
            <p className="text-lg text-secondary-foreground/80 mb-8 max-w-md">
              Entrega rápida de los mejores restaurantes directo a tu puerta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" className="font-bold text-base rounded-full px-8">
                Ordenar ahora
              </Button>
              <Button size="lg" variant="outline" className="font-bold text-base rounded-full px-8 border-2 border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                Ver menú
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop"
                alt="Hamburguesa deliciosa"
                className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
