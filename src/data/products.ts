export interface ProductOption {
  id: string;
  name: string;
  price: number;
  category: 'extra' | 'remove' | 'size';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  options: ProductOption[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Tryb Clásica",
    description: "Deliciosa hamburguesa con carne 100% res, lechuga fresca, tomate, cebolla y nuestra salsa especial",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    price: 8.99,
    category: "Hamburguesas",
    options: [
      { id: "extra-cheese", name: "Extra queso", price: 1.50, category: "extra" },
      { id: "extra-bacon", name: "Bacon", price: 2.00, category: "extra" },
      { id: "extra-egg", name: "Huevo frito", price: 1.00, category: "extra" },
      { id: "extra-jalapeño", name: "Jalapeños", price: 0.75, category: "extra" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
      { id: "no-tomato", name: "Sin tomate", price: 0, category: "remove" },
      { id: "no-lettuce", name: "Sin lechuga", price: 0, category: "remove" },
    ],
  },
  {
    id: "2",
    name: "Tryb Doble",
    description: "El doble de carne, el doble de sabor. Con queso cheddar derretido, bacon crujiente y aros de cebolla",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
    price: 12.99,
    category: "Hamburguesas",
    options: [
      { id: "extra-cheese", name: "Extra queso", price: 1.50, category: "extra" },
      { id: "extra-bacon", name: "Bacon extra", price: 2.00, category: "extra" },
      { id: "extra-meat", name: "Carne extra", price: 3.50, category: "extra" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
      { id: "no-bacon", name: "Sin bacon", price: 0, category: "remove" },
    ],
  },
  {
    id: "3",
    name: "Tryb Veggie",
    description: "Hamburguesa vegetariana con medallón de garbanzos, aguacate, tomate y mayonesa vegana",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop",
    price: 9.99,
    category: "Hamburguesas",
    options: [
      { id: "extra-avocado", name: "Extra aguacate", price: 1.50, category: "extra" },
      { id: "extra-cheese-vegan", name: "Queso vegano", price: 1.50, category: "extra" },
      { id: "no-mayo", name: "Sin mayonesa", price: 0, category: "remove" },
      { id: "no-tomato", name: "Sin tomate", price: 0, category: "remove" },
    ],
  },
  {
    id: "4",
    name: "Tryb BBQ",
    description: "Hamburguesa con salsa BBQ ahumada, bacon, queso gouda y aros de cebolla caramelizada",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
    price: 11.49,
    category: "Hamburguesas",
    options: [
      { id: "extra-cheese", name: "Extra queso gouda", price: 1.50, category: "extra" },
      { id: "extra-bacon", name: "Bacon extra", price: 2.00, category: "extra" },
      { id: "extra-bbq", name: "Extra salsa BBQ", price: 0.50, category: "extra" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
    ],
  },
  {
    id: "5",
    name: "Patatas Tryb",
    description: "Crujientes patatas fritas con sal marina y nuestra salsa especial",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 3.99,
    category: "Acompañamientos",
    options: [
      { id: "extra-cheese", name: "Con queso", price: 1.00, category: "extra" },
      { id: "extra-bacon", name: "Con bacon", price: 1.50, category: "extra" },
      { id: "size-large", name: "Tamaño grande", price: 1.50, category: "size" },
    ],
  },
  {
    id: "6",
    name: "Aros de Cebolla",
    description: "Aros de cebolla rebozados, crujientes por fuera y tiernos por dentro",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop",
    price: 4.49,
    category: "Acompañamientos",
    options: [
      { id: "extra-sauce", name: "Salsa ranch", price: 0.50, category: "extra" },
      { id: "size-large", name: "Tamaño grande", price: 1.50, category: "size" },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
