import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const categories = [
  { id: "Hamburguesas", name: "Hamburguesas", emoji: "🍔" },
  { id: "Bocadillos", name: "Bocadillos", emoji: "🥖" },
  { id: "Platos para compartir", name: "Platos para compartir", emoji: "🍽️" },
  { id: "Pizzas", name: "Pizzas", emoji: "🍕" },
  { id: "Perritos", name: "Perritos", emoji: "🌭" },
  { id: "Paninis", name: "Paninis", emoji: "🥪" },
  { id: "Menú Infantil", name: "Menú Infantil", emoji: "👶" },
  { id: "Acompañamientos", name: "Acompañamientos", emoji: "🍟" },
  { id: "Combos", name: "Combos", emoji: "🎁" },
  { id: "Raciones", name: "Raciones", emoji: "🍖" },
  { id: "Platos Especiales", name: "Platos Especiales", emoji: "⭐" },
];

const MenuSection = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category.id);
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {category.emoji} {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MenuSection;
