import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const MenuSection = () => {
  const hamburguesas = products.filter(p => p.category === "Hamburguesas");
  const acompañamientos = products.filter(p => p.category === "Acompañamientos");

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Hamburguesas */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            🍔 Hamburguesas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hamburguesas.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Acompañamientos */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            🍟 Acompañamientos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {acompañamientos.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
