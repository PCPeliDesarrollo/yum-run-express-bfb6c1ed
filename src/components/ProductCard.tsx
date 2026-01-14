import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link 
      to={`/producto/${product.id}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-border"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5 text-secondary-foreground" />
        </button>
      </div>
      
      <div className="p-4">
        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-bold text-foreground mt-1 mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <p className="text-lg font-bold text-primary">€{product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
