import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const categoryEmojis: Record<string, string> = {
  "Hamburguesas": "🍔",
  "Bocadillos Caseros": "🥖",
  "Más Bocadillos": "🥪",
  "Para Compartir": "🍽️",
  "Pizzas": "🍕",
  "Perritos": "🌭",
  "Sandwiches": "🥪",
  "Durum": "🌯",
  "Paninis": "🫓",
  "Menú Niños": "👶",
  "Complementos": "🍟",
  "Combinados": "🎁",
  "Raciones": "🍖",
  "Exquisitos": "⭐",
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
              <div className="bg-card border border-border rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-2 transition-all hover:shadow-lg hover:border-primary hover:scale-[1.02] cursor-pointer">
                <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                  {categoryEmojis[category] || "🍴"}
                </span>
                <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">
                  {category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
