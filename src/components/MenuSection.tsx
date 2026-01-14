import { useState } from "react";
import ProductCard from "./ProductCard";
import { products, categories } from "@/data/products";
import { cn } from "@/lib/utils";

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

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const filteredProducts = products.filter(p => p.category === activeCategory);

  return (
    <section className="py-8 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Category Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
            Nuestra Carta
          </h2>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                )}
              >
                <span>{categoryEmojis[category] || "🍴"}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            {categoryEmojis[activeCategory]} {activeCategory}
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredProducts.length} productos)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No hay productos en esta categoría
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
