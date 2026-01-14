import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Hamburguesas
              <br />
              <span className="text-secondary">de verdad</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-md mx-auto md:mx-0">
              Ingredientes frescos, carne 100% de res y el sabor que te mereces. ¡Pide ahora!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full px-8"
              >
                Ver menú
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold rounded-full px-8"
              >
                Ofertas del día
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-secondary/30 rounded-full animate-pulse" />
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop"
                alt="Hamburguesa Tryb"
                className="relative z-10 w-full h-full object-cover rounded-full border-4 border-secondary shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
