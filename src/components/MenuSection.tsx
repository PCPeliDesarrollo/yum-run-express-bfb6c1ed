import { Link } from "react-router-dom";
import { categories } from "@/data/products";

// Import category images
import hamburguesasImg from "@/assets/categories/hamburguesas.jpg";
import bocadillosImg from "@/assets/categories/bocadillos.jpg";
import pizzasImg from "@/assets/categories/pizzas.jpg";
import perritosImg from "@/assets/categories/perritos.jpg";
import sandwichesImg from "@/assets/categories/sandwiches.jpg";
import durumImg from "@/assets/categories/durum.jpg";
import paninisImg from "@/assets/categories/paninis.jpg";
import menuNinosImg from "@/assets/categories/menu-ninos.jpg";
import complementosImg from "@/assets/categories/complementos.jpg";
import combinadosImg from "@/assets/categories/combinados.jpg";
import racionesImg from "@/assets/categories/raciones.jpg";
import exquisitosImg from "@/assets/categories/exquisitos.jpg";
import paraCompartirImg from "@/assets/categories/para-compartir.jpg";

const categoryImages: Record<string, string> = {
  "Hamburguesas": hamburguesasImg,
  "Bocadillos Caseros": bocadillosImg,
  "Más Bocadillos": bocadillosImg,
  "Para Compartir": paraCompartirImg,
  "Pizzas": pizzasImg,
  "Perritos": perritosImg,
  "Sandwiches": sandwichesImg,
  "Durum": durumImg,
  "Paninis": paninisImg,
  "Menú Niños": menuNinosImg,
  "Complementos": complementosImg,
  "Combinados": combinadosImg,
  "Raciones": racionesImg,
  "Exquisitos": exquisitosImg,
};

// Convert category name to URL slug
const getCategorySlug = (category: string) => {
  return category
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n');
};

const MenuSection = () => {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          Nuestra Carta
        </h2>
        
        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categoria/${getCategorySlug(category)}`}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden aspect-square flex flex-col transition-all hover:shadow-lg hover:border-primary hover:scale-[1.02] cursor-pointer">
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={categoryImages[category] || "/placeholder.svg"}
                    alt={category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <span className="text-xs md:text-sm font-semibold text-white text-center block leading-tight drop-shadow-lg">
                      {category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
