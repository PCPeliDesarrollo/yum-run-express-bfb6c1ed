import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    rating: 4.8,
    deliveryTime: "20-30 min",
    cuisine: "Hamburguesas • Americana",
    discount: "-20%",
  },
  {
    name: "Pizza Italia",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop",
    rating: 4.6,
    deliveryTime: "25-35 min",
    cuisine: "Pizza • Italiana",
  },
  {
    name: "Taquería El Rey",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop",
    rating: 4.7,
    deliveryTime: "15-25 min",
    cuisine: "Tacos • Mexicana",
    discount: "-15%",
  },
  {
    name: "Sushi Express",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop",
    rating: 4.9,
    deliveryTime: "30-40 min",
    cuisine: "Sushi • Japonesa",
  },
];

const RestaurantSection = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            RESTAURANTES CERCA DE TI
          </h2>
          <button className="text-primary font-bold hover:underline">
            Ver todos →
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} {...restaurant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
