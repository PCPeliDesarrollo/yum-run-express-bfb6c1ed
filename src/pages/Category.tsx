import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Category = () => {
  const { slug } = useParams();
  
  // Convert slug back to category name
  const categoryName = categories.find(
    cat => cat.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n') === slug
  );

  const filteredProducts = categoryName 
    ? products.filter(p => p.category === categoryName)
    : [];

  if (!categoryName) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
            <Link to="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la carta</span>
          </Link>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <span className="text-4xl">{categoryEmojis[categoryName] || "🍴"}</span>
              {categoryName}
            </h1>
            <p className="text-muted-foreground mt-2">
              {filteredProducts.length} productos disponibles
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay productos en esta categoría
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
