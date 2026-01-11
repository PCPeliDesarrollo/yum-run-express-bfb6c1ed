import { Button } from "@/components/ui/button";

const PromoSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-primary-foreground mb-2">
              ¡PRIMERA ORDEN GRATIS!
            </h3>
            <p className="text-primary-foreground/90 text-lg">
              Usa el código <span className="font-bold bg-primary-foreground/20 px-2 py-1 rounded">NUEVO</span> en tu primer pedido
            </p>
          </div>
          <Button 
            size="lg" 
            variant="secondary"
            className="font-bold text-base rounded-full px-8 whitespace-nowrap"
          >
            Ordenar ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
