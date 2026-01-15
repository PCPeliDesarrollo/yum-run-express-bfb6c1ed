import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getProductById, ProductOption } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = getProductById(id || "");
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Producto no encontrado</p>
      </div>
    );
  }

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotal = () => {
    const optionsTotal = product.options
      .filter(opt => selectedOptions.includes(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
    return ((product.price + optionsTotal) * quantity).toFixed(2);
  };

  const extraOptions = product.options.filter(opt => opt.category === "extra");
  const removeOptions = product.options.filter(opt => opt.category === "remove");
  const sizeOptions = product.options.filter(opt => opt.category === "size");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">{product.name}</h1>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative h-64 md:h-80">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Product Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-3">
            {product.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {product.name}
          </h2>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</p>
        </div>

        {/* Options Sections */}
        <div className="space-y-6">
          {/* Extras */}
          {extraOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Plus className="w-5 h-5 text-secondary" />
                Añadir extras
              </h3>
              <div className="space-y-2">
                {extraOptions.map(option => (
                  <OptionButton 
                    key={option.id}
                    option={option}
                    isSelected={selectedOptions.includes(option.id)}
                    onToggle={() => toggleOption(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {sizeOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Tamaño
              </h3>
              <div className="space-y-2">
                {sizeOptions.map(option => (
                  <OptionButton 
                    key={option.id}
                    option={option}
                    isSelected={selectedOptions.includes(option.id)}
                    onToggle={() => toggleOption(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Remove Ingredients */}
          {removeOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Minus className="w-5 h-5 text-primary" />
                Quitar ingredientes
              </h3>
              <div className="space-y-2">
                {removeOptions.map(option => (
                  <OptionButton 
                    key={option.id}
                    option={option}
                    isSelected={selectedOptions.includes(option.id)}
                    onToggle={() => toggleOption(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              Peticiones especiales
            </h3>
            <Textarea
              placeholder="¿Alguna alergia o petición especial? Escríbela aquí..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl border-2 border-border focus:border-primary"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {specialNotes.length}/500 caracteres
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="container mx-auto">
          <Button 
            className="w-full h-14 text-lg font-bold rounded-full bg-primary hover:bg-primary/90"
            size="lg"
            onClick={() => {
              const options = product.options.filter(opt => selectedOptions.includes(opt.id));
              addItem(product, quantity, options, specialNotes.trim() || undefined);
              navigate(-1);
            }}
          >
            Añadir al carrito · €{calculateTotal()}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface OptionButtonProps {
  option: ProductOption;
  isSelected: boolean;
  onToggle: () => void;
}

const OptionButton = ({ option, isSelected, onToggle }: OptionButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-secondary bg-secondary/10' 
          : 'border-border hover:border-muted-foreground/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected 
            ? 'border-secondary bg-secondary' 
            : 'border-muted-foreground/30'
        }`}>
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="font-medium text-foreground">{option.name}</span>
      </div>
      {option.price > 0 && (
        <span className="font-bold text-primary">+€{option.price.toFixed(2)}</span>
      )}
    </button>
  );
};

export default ProductDetail;
