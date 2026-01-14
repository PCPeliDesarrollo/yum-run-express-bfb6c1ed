import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Interior del restaurante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 flex items-center min-h-[500px] md:min-h-[600px]">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Hamburguesas
            <br />
            <span className="text-secondary">de verdad</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-md">
            Ingredientes frescos, carne 100% de res y el sabor que te mereces. ¡Pide ahora!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-full px-8"
            >
              Ver menú
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold rounded-full px-8"
            >
              Ofertas del día
            </Button>
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
