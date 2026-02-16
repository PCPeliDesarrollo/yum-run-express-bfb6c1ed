import burgerPolloImg from "@/assets/products/burger-pollo.jpg";
import burgerTerneraImg from "@/assets/products/burger-ternera.jpg";
import burgerAngusImg from "@/assets/products/burger-angus.jpg";

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  category: 'extra' | 'remove' | 'size' | 'choice';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  priceMedia?: number; // Para productos con dos tamaños
  category: string;
  options: ProductOption[];
  isGlutenFree?: boolean;
  hasEgg?: boolean;
  hasPork?: boolean;
}

// ========== HAMBURGUESAS ==========
const hamburguesas: Product[] = [
  {
    id: "hamburguesa-cerdo-iberico",
    name: "Hamburguesa de Cerdo Ibérico",
    description: "Carne de cerdo ibérico, queso, tomate, lechuga y cebolla",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    price: 4.50,
    category: "Hamburguesas",
    hasPork: true,
    options: [
      { id: "no-cheese", name: "Sin queso", price: 0, category: "remove" },
      { id: "no-tomato", name: "Sin tomate", price: 0, category: "remove" },
      { id: "no-lettuce", name: "Sin lechuga", price: 0, category: "remove" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
    ],
  },
  {
    id: "hamburguesa-ternera",
    name: "Hamburguesa de Ternera",
    description: "Carne de cerdo ternera, queso, tomate, lechuga y cebolla",
    image: burgerTerneraImg,
    price: 5.00,
    category: "Hamburguesas",
    options: [
      { id: "no-cheese", name: "Sin queso", price: 0, category: "remove" },
      { id: "no-tomato", name: "Sin tomate", price: 0, category: "remove" },
      { id: "no-lettuce", name: "Sin lechuga", price: 0, category: "remove" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
    ],
  },
  {
    id: "hamburguesa-pollo-crujiente",
    name: "Hamburguesa de Pollo Crujiente",
    description: "Carne de pollo empanado, queso, tomate, lechuga y cebolla",
    image: burgerPolloImg,
    price: 5.25,
    category: "Hamburguesas",
    options: [
      { id: "no-cheese", name: "Sin queso", price: 0, category: "remove" },
      { id: "no-tomato", name: "Sin tomate", price: 0, category: "remove" },
      { id: "no-lettuce", name: "Sin lechuga", price: 0, category: "remove" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
    ],
  },
  {
    id: "hamburguesa-angus",
    name: "Hamburguesa de Angus",
    description: "200 gr. de carne de ternera Angus, montada sobre pan brioche, queso cheddar, cebolla crujiente, ensalada gourmet y rulo de cabra, acompañado de patatas",
    image: burgerAngusImg,
    price: 9.70,
    category: "Hamburguesas",
    isGlutenFree: true,
    options: [
      { id: "no-cheese", name: "Sin queso", price: 0, category: "remove" },
      { id: "no-goat-cheese", name: "Sin rulo de cabra", price: 0, category: "remove" },
      { id: "no-onion", name: "Sin cebolla", price: 0, category: "remove" },
    ],
  },
];

// ========== BOCADILLOS CASEROS ==========
const bocadillosCaseros: Product[] = [
  {
    id: "bocadillo-bacon-queso",
    name: "Bocadillo Bacon y Queso",
    description: "Bocadillo casero con lomo o pollo, bacon y queso",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Bocadillos Caseros",
    hasPork: true,
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
  {
    id: "bocadillo-queso-lechuga-tomate",
    name: "Bocadillo Queso, Lechuga y Tomate",
    description: "Bocadillo casero con lomo o pollo, queso, lechuga y tomate",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Bocadillos Caseros",
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
  {
    id: "bocadillo-queso-bacon-tomate",
    name: "Bocadillo Queso, Bacon y Tomate",
    description: "Bocadillo casero con lomo o pollo, queso, bacon y tomate",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 6.00,
    category: "Bocadillos Caseros",
    hasPork: true,
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
  {
    id: "bocadillo-queso-bacon-pimiento",
    name: "Bocadillo Queso, Bacon y Pimiento Verde",
    description: "Bocadillo casero con lomo o pollo, queso, bacon y pimiento verde",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 6.50,
    category: "Bocadillos Caseros",
    hasPork: true,
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
  {
    id: "bocadillo-rulo-cabra-cebolla",
    name: "Bocadillo Rulo de Cabra y Cebolla Caramelizada",
    description: "Bocadillo casero con lomo o pollo, rulo de cabra y cebolla caramelizada",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 7.50,
    category: "Bocadillos Caseros",
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
  {
    id: "bocadillo-bacon-queso-jamon-huevo",
    name: "Bocadillo Bacon, Queso, Jamón y Huevo",
    description: "Bocadillo casero con lomo o pollo, bacon, queso, jamón y huevo",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 7.60,
    category: "Bocadillos Caseros",
    hasPork: true,
    hasEgg: true,
    options: [
      { id: "lomo", name: "Con Lomo", price: 0, category: "choice" },
      { id: "pollo", name: "Con Pollo", price: 0, category: "choice" },
    ],
  },
];

// ========== MÁS BOCADILLOS ==========
const masBocadillos: Product[] = [
  {
    id: "bocadillo-calamares",
    name: "Bocadillo de Calamares",
    description: "Delicioso bocadillo de calamares fritos",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Más Bocadillos",
    options: [],
  },
  {
    id: "bocadillo-bacon-queso-simple",
    name: "Bocadillo Bacon y Queso",
    description: "Bocadillo con bacon y queso",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Más Bocadillos",
    hasPork: true,
    options: [],
  },
  {
    id: "bocadillo-vegetal",
    name: "Bocadillo Vegetal",
    description: "Lechuga, tomate, huevo cocido, espárragos y atún",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Más Bocadillos",
    hasEgg: true,
    isGlutenFree: true,
    options: [],
  },
  {
    id: "bocadillo-pollo-alioli",
    name: "Bocadillo Pollo Empanado con Ali-Oli",
    description: "Pollo empanado con salsa ali-oli",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    price: 5.90,
    category: "Más Bocadillos",
    options: [],
  },
];

// ========== PARA COMPARTIR ==========
const paraCompartir: Product[] = [
  {
    id: "patatas-bacon-cheddar",
    name: "Patatas, Bacon Cheddar",
    description: "Patatas con bacon y queso cheddar",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 5.00,
    priceMedia: 5.00,
    category: "Para Compartir",
    hasPork: true,
    options: [
      { id: "entera", name: "Entera", price: 8.50, category: "size" },
      { id: "media", name: "Media", price: 5.00, category: "size" },
    ],
  },
  {
    id: "patatas-fritas",
    name: "Patatas Fritas",
    description: "Crujientes patatas fritas",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 1.90,
    category: "Para Compartir",
    isGlutenFree: true,
    options: [
      { id: "entera", name: "Entera", price: 3.50, category: "size" },
      { id: "media", name: "Media", price: 1.90, category: "size" },
    ],
  },
  {
    id: "patatas-deluxe",
    name: "Patatas Deluxe",
    description: "Patatas deluxe con especias",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 3.50,
    category: "Para Compartir",
    options: [
      { id: "entera", name: "Entera", price: 5.90, category: "size" },
      { id: "media", name: "Media", price: 3.50, category: "size" },
    ],
  },
  {
    id: "aros-cebolla",
    name: "Aros de Cebolla",
    description: "Crujientes aros de cebolla rebozados",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop",
    price: 3.50,
    category: "Para Compartir",
    options: [
      { id: "entera", name: "Entera", price: 5.90, category: "size" },
      { id: "media", name: "Media", price: 3.50, category: "size" },
    ],
  },
  {
    id: "costillar-barbacoa",
    name: "Costillar de Barbacoa",
    description: "Costillar de cerdo con salsa barbacoa",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    price: 8.00,
    category: "Para Compartir",
    hasPork: true,
    options: [
      { id: "entera", name: "Entera", price: 15.00, category: "size" },
      { id: "media", name: "Media", price: 8.00, category: "size" },
    ],
  },
  {
    id: "patatas-huevos-kebab",
    name: "Patatas, Huevos y Kebab",
    description: "Patatas fritas con huevos y carne de kebab",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 8.50,
    category: "Para Compartir",
    hasEgg: true,
    options: [],
  },
  {
    id: "fingers-pollo",
    name: "Fingers de Pollo",
    description: "Fingers de pollo crujientes",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop",
    price: 7.50,
    category: "Para Compartir",
    options: [],
  },
  {
    id: "ensalada-mixta",
    name: "Ensalada Mixta",
    description: "Ensalada mixta fresca",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    price: 7.00,
    category: "Para Compartir",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "ensalada-cesar",
    name: "Ensalada Cesar",
    description: "Ensalada César con pollo y croutons",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop",
    price: 9.00,
    category: "Para Compartir",
    options: [],
  },
  {
    id: "calamares-romana",
    name: "Calamares a la Romana",
    description: "Calamares rebozados a la romana",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop",
    price: 8.50,
    category: "Para Compartir",
    options: [],
  },
];

// ========== PIZZAS ==========
const pizzas: Product[] = [
  {
    id: "pizza-york-queso",
    name: "Pizza York y Queso",
    description: "Tomate, mozzarella y jamón de york",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    price: 10.50,
    category: "Pizzas",
    hasPork: true,
    options: [
      { id: "extra-ingredient", name: "Ingrediente extra", price: 1.00, category: "extra" },
    ],
  },
  {
    id: "pizza-cuatro-quesos",
    name: "Pizza Cuatro Quesos",
    description: "Tomate, mozzarella, cheddar, gouda y queso azul",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    price: 10.50,
    category: "Pizzas",
    isGlutenFree: true,
    options: [
      { id: "extra-ingredient", name: "Ingrediente extra", price: 1.00, category: "extra" },
    ],
  },
  {
    id: "pizza-barbacoa",
    name: "Pizza Barbacoa",
    description: "Tomate, mozzarella, bacon y salsa barbacoa",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop",
    price: 10.50,
    category: "Pizzas",
    hasPork: true,
    isGlutenFree: true,
    options: [
      { id: "extra-ingredient", name: "Ingrediente extra", price: 1.00, category: "extra" },
    ],
  },
  {
    id: "pizza-bacon-queso",
    name: "Pizza Bacon y Queso",
    description: "Tomate, mozzarella y bacon",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    price: 10.50,
    category: "Pizzas",
    hasPork: true,
    options: [
      { id: "extra-ingredient", name: "Ingrediente extra", price: 1.00, category: "extra" },
    ],
  },
  {
    id: "pizza-carbonara",
    name: "Pizza Carbonara",
    description: "Tomate, mozzarella, bacon, champiñones, cebolla y salsa barbacoa",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
    price: 10.50,
    category: "Pizzas",
    hasPork: true,
    isGlutenFree: true,
    options: [
      { id: "extra-ingredient", name: "Ingrediente extra", price: 1.00, category: "extra" },
    ],
  },
];

// ========== PERRITOS ==========
const perritos: Product[] = [
  {
    id: "perrito-clasico",
    name: "Perrito Clásico",
    description: "Salchichas gigantes, patatas paja y cebolla crujiente. Salsas a elegir: Mahonesa, Ketchup, Tomate Frito, Barbacoa, Mostaza",
    image: "https://images.unsplash.com/photo-1612392062126-2f3c1b6f8e59?w=600&h=400&fit=crop",
    price: 3.75,
    category: "Perritos",
    hasPork: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
      { id: "salsa-barbacoa", name: "Barbacoa", price: 0, category: "choice" },
      { id: "salsa-mostaza", name: "Mostaza", price: 0, category: "choice" },
    ],
  },
  {
    id: "perrito-americano",
    name: "Perrito Americano",
    description: "Salchichas gigantes, patatas paja, topping de bacon y queso mozzarella. Salsas a elegir",
    image: "https://images.unsplash.com/photo-1612392062126-2f3c1b6f8e59?w=600&h=400&fit=crop",
    price: 4.25,
    category: "Perritos",
    hasPork: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
      { id: "salsa-barbacoa", name: "Barbacoa", price: 0, category: "choice" },
      { id: "salsa-mostaza", name: "Mostaza", price: 0, category: "choice" },
    ],
  },
  {
    id: "perrito-especial",
    name: "Perrito Especial",
    description: "Salchichas gigantes, patatas paja, huevo frito, topping de bacon y queso cheddar. Salsas a elegir",
    image: "https://images.unsplash.com/photo-1612392062126-2f3c1b6f8e59?w=600&h=400&fit=crop",
    price: 5.80,
    category: "Perritos",
    hasPork: true,
    hasEgg: true,
    isGlutenFree: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
      { id: "salsa-barbacoa", name: "Barbacoa", price: 0, category: "choice" },
      { id: "salsa-mostaza", name: "Mostaza", price: 0, category: "choice" },
    ],
  },
];

// ========== SANDWICHES ==========
const sandwiches: Product[] = [
  {
    id: "sandwich-mixto",
    name: "Sandwich Mixto",
    description: "Jamón york y queso",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 3.50,
    category: "Sandwiches",
    hasPork: true,
    options: [],
  },
  {
    id: "sandwich-vegetal",
    name: "Sandwich Vegetal",
    description: "Lechuga, tomate, huevo y espárrago",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 4.00,
    category: "Sandwiches",
    hasEgg: true,
    isGlutenFree: true,
    options: [],
  },
  {
    id: "sandwich-especial",
    name: "Sandwich Especial",
    description: "Jamón york, queso, bacon y huevo",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 5.00,
    category: "Sandwiches",
    hasPork: true,
    hasEgg: true,
    options: [],
  },
];

// ========== DURUM ==========
const durum: Product[] = [
  {
    id: "durum",
    name: "Durum",
    description: "Durum de pollo o ternera",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
    price: 5.50,
    category: "Durum",
    options: [
      { id: "pollo", name: "Pollo", price: 0, category: "choice" },
      { id: "ternera", name: "Ternera", price: 0, category: "choice" },
    ],
  },
  {
    id: "durum-solo-carne",
    name: "Durum Solo Carne",
    description: "Durum solo carne de pollo o ternera",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
    price: 6.50,
    category: "Durum",
    options: [
      { id: "pollo", name: "Pollo", price: 0, category: "choice" },
      { id: "ternera", name: "Ternera", price: 0, category: "choice" },
    ],
  },
  {
    id: "kebab-ninos",
    name: "Kebab Niños",
    description: "Carne de kebab, patatas fritas y salsa kebab",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
    price: 3.50,
    category: "Durum",
    options: [],
  },
];

// ========== PANINIS ==========
const paninis: Product[] = [
  {
    id: "panini-bacon",
    name: "Panini Bacon",
    description: "Base de tomate, queso mozzarella y bacon",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 4.50,
    category: "Paninis",
    hasPork: true,
    options: [],
  },
  {
    id: "panini-jamon-york",
    name: "Panini Jamón York",
    description: "Base de tomate, queso mozzarella y jamón york",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 4.50,
    category: "Paninis",
    hasPork: true,
    options: [],
  },
  {
    id: "panini-barbacoa",
    name: "Panini Barbacoa",
    description: "Base de BBQ, queso mozzarella, bacon, pollo y salsa de Barbacoa",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 5.00,
    category: "Paninis",
    hasPork: true,
    options: [],
  },
  {
    id: "panini-rulo-cabra",
    name: "Panini Rulo de Cabra",
    description: "Base de BBQ, tres quesos, rulo y cebolla caramelizada",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 5.00,
    category: "Paninis",
    options: [],
  },
  {
    id: "panini-atun",
    name: "Panini Atún",
    description: "Salsa de tomate, queso mozzarella y atún",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 4.50,
    category: "Paninis",
    options: [],
  },
];

// ========== MENÚ NIÑOS ==========
const menuNinos: Product[] = [
  {
    id: "hamburguesa-cerdo-ninos",
    name: "Hamburguesa de Cerdo (Niños)",
    description: "Carne de cerdo, pan rústico y queso. Salsas a elegir: Mahonesa, Ketchup, Tomate Frito",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    price: 3.50,
    category: "Menú Niños",
    hasPork: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
    ],
  },
  {
    id: "perritos-calientes-ninos",
    name: "Perritos Calientes (Niños)",
    description: "Pan y Salchicha. Salsas a elegir: Mahonesa, Ketchup, Tomate Frito",
    image: "https://images.unsplash.com/photo-1612392062126-2f3c1b6f8e59?w=600&h=400&fit=crop",
    price: 1.50,
    category: "Menú Niños",
    hasPork: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
    ],
  },
  {
    id: "sandwich-mixto-ninos",
    name: "Sandwich Mixto (Niños)",
    description: "Pan de molde, jamón York y queso. Salsas a elegir: Mahonesa, Ketchup, Tomate Frito",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    price: 2.50,
    category: "Menú Niños",
    hasPork: true,
    options: [
      { id: "salsa-mahonesa", name: "Mahonesa", price: 0, category: "choice" },
      { id: "salsa-ketchup", name: "Ketchup", price: 0, category: "choice" },
      { id: "salsa-tomate", name: "Tomate Frito", price: 0, category: "choice" },
    ],
  },
];

// ========== COMPLEMENTOS ==========
const complementos: Product[] = [
  {
    id: "cartucho-patatas-fritas",
    name: "Cartucho de Patatas Fritas",
    description: "Cartucho de patatas fritas crujientes",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 2.00,
    category: "Complementos",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "nuggets-pollo",
    name: "Nuggets de Pollo",
    description: "6 nuggets de pollo crujientes",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop",
    price: 2.50,
    category: "Complementos",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "patatas-cheddar-bacon",
    name: "Patatas Cheddar y Bacon",
    description: "Patatas con queso cheddar y bacon",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop",
    price: 5.00,
    category: "Complementos",
    hasPork: true,
    options: [],
  },
];

// ========== COMBINADOS ==========
const combinados: Product[] = [
  {
    id: "combinado-pollo-huevo-patatas",
    name: "Filetes de Pollo, Huevo Frito y Patatas",
    description: "Filetes de pollo empanado, huevo frito y patatas fritas",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop",
    price: 7.50,
    category: "Combinados",
    hasEgg: true,
    isGlutenFree: true,
    options: [],
  },
  {
    id: "combinado-lomo-huevo-patatas",
    name: "Filetes de Lomo, Huevo Frito y Patatas",
    description: "Filetes de lomo, huevo frito y patatas fritas",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop",
    price: 7.50,
    category: "Combinados",
    hasPork: true,
    hasEgg: true,
    isGlutenFree: true,
    options: [],
  },
];

// ========== RACIONES ==========
const raciones: Product[] = [
  {
    id: "ensalada-pollo",
    name: "Ensalada de Pollo",
    description: "Ensalada fresca con pollo a la plancha",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    price: 8.00,
    category: "Raciones",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "solomillo-pimienta",
    name: "Solomillo a la Pimienta",
    description: "Solomillo de ternera con salsa de pimienta",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    price: 12.00,
    category: "Raciones",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "carne-ajillo",
    name: "Carne al Ajillo",
    description: "Carne de ternera al ajillo",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    price: 10.00,
    category: "Raciones",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "bacalao-dorado",
    name: "Bacalao Dorado",
    description: "Bacalao dorado tradicional",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop",
    price: 11.00,
    category: "Raciones",
    options: [],
  },
  {
    id: "croquetas-caseras",
    name: "Croquetas Caseras",
    description: "Croquetas caseras cremosas",
    image: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=600&h=400&fit=crop",
    price: 8.00,
    category: "Raciones",
    options: [],
  },
  {
    id: "ensalada-campera",
    name: "Ensalada Campera",
    description: "Ensalada campera tradicional",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    price: 7.00,
    category: "Raciones",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "ensaladilla-rusa",
    name: "Ensaladilla Rusa",
    description: "Ensaladilla rusa casera",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    price: 6.00,
    category: "Raciones",
    options: [],
  },
  {
    id: "lasana",
    name: "Lasaña",
    description: "Lasaña casera de carne",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=400&fit=crop",
    price: 9.00,
    category: "Raciones",
    options: [],
  },
  {
    id: "ternera-guisantes",
    name: "Ternera con Guisantes",
    description: "Ternera guisada con guisantes",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    price: 9.00,
    category: "Raciones",
    options: [],
  },
  {
    id: "albondigas",
    name: "Albóndigas",
    description: "Albóndigas caseras en salsa",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=400&fit=crop",
    price: 8.00,
    category: "Raciones",
    options: [],
  },
];

// ========== EXQUISITOS ==========
const exquisitos: Product[] = [
  {
    id: "pollos-asados",
    name: "Pollos Asados",
    description: "Pollo asado entero o medio",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop",
    price: 9.00,
    category: "Exquisitos",
    isGlutenFree: true,
    options: [
      { id: "entero", name: "Entero", price: 9.00, category: "size" },
      { id: "medio", name: "Medio", price: 5.00, category: "size" },
    ],
  },
  {
    id: "pimientos-fritos",
    name: "Pimientos Fritos",
    description: "Pimientos fritos de padrón",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=400&fit=crop",
    price: 6.00,
    category: "Exquisitos",
    isGlutenFree: true,
    options: [],
  },
  {
    id: "carrillera-salsa",
    name: "Carrillera en Salsa",
    description: "Carrillera de cerdo en salsa",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    price: 12.00,
    category: "Exquisitos",
    hasPork: true,
    options: [],
  },
  {
    id: "bacalao-vizcaina",
    name: "Bacalao a la Vizcaína",
    description: "Bacalao tradicional a la vizcaína",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop",
    price: 13.00,
    category: "Exquisitos",
    options: [],
  },
  {
    id: "tortilla-patatas",
    name: "Tortilla de Patatas",
    description: "Tortilla de patatas casera",
    image: "https://images.unsplash.com/photo-1598558267482-8baf18ed73d3?w=600&h=400&fit=crop",
    price: 8.00,
    category: "Exquisitos",
    hasEgg: true,
    isGlutenFree: true,
    options: [],
  },
];

// ========== EXPORTAR TODOS LOS PRODUCTOS ==========
export const products: Product[] = [
  ...hamburguesas,
  ...bocadillosCaseros,
  ...masBocadillos,
  ...paraCompartir,
  ...pizzas,
  ...perritos,
  ...sandwiches,
  ...durum,
  ...paninis,
  ...menuNinos,
  ...complementos,
  ...combinados,
  ...raciones,
  ...exquisitos,
];

export const categories = [
  "Hamburguesas",
  "Bocadillos Caseros",
  "Más Bocadillos",
  "Para Compartir",
  "Pizzas",
  "Perritos",
  "Sandwiches",
  "Durum",
  "Paninis",
  "Menú Niños",
  "Complementos",
  "Combinados",
  "Raciones",
  "Exquisitos",
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
