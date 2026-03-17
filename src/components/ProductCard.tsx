import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import OptimizedImage from "@/components/OptimizedImage";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const hasOptions = product.options && product.options.length > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasOptions) {
      navigate(`/producto/${product.id}`);
    } else {
      addItem(product);
    }
  };

  if (compact) {
    return (
      <Link 
        to={`/producto/${product.id}`}
        className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-border"
      >
        <div className="relative aspect-square overflow-hidden">
          <OptimizedImage
            src={product.image}
            alt={product.name}
            width={160}
            height={160}
            sizes="(max-width: 640px) 44vw, 22vw"
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-secondary-foreground" />
          </button>
        </div>
        
        <div className="p-3">
          <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2rem]">
            {product.description}
          </p>
          <p className="text-base font-bold text-primary mt-2">€{product.price.toFixed(2)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/producto/${product.id}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-border"
    >
      <div className="relative h-36 overflow-hidden">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          width={400}
          height={144}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
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
