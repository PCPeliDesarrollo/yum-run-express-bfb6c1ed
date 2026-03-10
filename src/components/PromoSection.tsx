import { Button } from "@/components/ui/button";
import { usePromo } from "@/hooks/usePromo";
import { useNavigate } from "react-router-dom";

const PromoSection = () => {
  const { promo, loading } = usePromo();
  const navigate = useNavigate();

  if (loading || !promo.enabled) return null;

  return (
    <section id="ofertas" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            {promo.badge && (
              <span className="inline-block bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full mb-4">
                {promo.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              {promo.title}
            </h2>
            <p className="text-secondary-foreground/80 mb-6 max-w-lg mx-auto">
              {promo.description}
            </p>
            {promo.buttonText && (
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8"
                onClick={() => navigate(promo.buttonLink || "/menu")}
              >
                {promo.buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
