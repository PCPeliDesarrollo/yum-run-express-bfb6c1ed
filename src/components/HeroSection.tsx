import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[280px] md:min-h-[350px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Interior del restaurante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 py-10 md:py-14 flex items-center min-h-[280px] md:min-h-[350px]">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Hamburguesas
            <br />
            <span className="text-secondary">de verdad</span>
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-md">
            Ingredientes frescos, carne 100% de res y el sabor que te mereces. ¡Pide ahora!
          </p>
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
