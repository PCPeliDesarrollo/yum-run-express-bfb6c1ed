import { createContext, useContext, useState, ReactNode } from "react";
import { Product, ProductOption } from "@/data/products";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: ProductOption[];
  totalPrice: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, options?: ProductOption[], notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, quantity = 1, options: ProductOption[] = [], notes?: string) => {
    const optionsPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const itemPrice = (product.price + optionsPrice) * quantity;
    
    // Generate unique ID based on product, options and notes
    const optionsKey = options.map(o => o.id).sort().join("-");
    const notesKey = notes ? `-${notes.substring(0, 20)}` : "";
    const itemId = `${product.id}-${optionsKey || "default"}${notesKey}`;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * (product.price + optionsPrice),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: itemId,
          product,
          quantity,
          selectedOptions: options,
          totalPrice: itemPrice,
          notes,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === itemId) {
          const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
          return {
            ...item,
            quantity,
            totalPrice: quantity * (item.product.price + optionsPrice),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
