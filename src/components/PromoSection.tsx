import { Button } from "@/components/ui/button";
import { Truck, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Entrega rápida",
    description: "Recibe tu comida en menos de 30 minutos",
  },
  {
    icon: Clock,
    title: "Abierto 24/7",
    description: "Ordena a cualquier hora del día",
  },
  {
    icon: Shield,
    title: "Pago seguro",
    description: "Tus datos siempre protegidos",
  },
];

const PromoSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Promo Banner */}
        <div className="gradient-primary rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjLTIgMC00IDItNCAyczIgMiA0IDJjMiAwIDQtMiA0LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium text-primary-foreground mb-4">
                🎉 Oferta especial
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-2">
                ¡Primer pedido GRATIS!
              </h3>
              <p className="text-primary-foreground/80 text-lg">
                Usa el código <span className="font-bold">BIENVENIDO</span> y obtén envío gratis
              </p>
            </div>
            <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Ordenar ahora
            </Button>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
