import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "La Pizzería Italiana",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "$25",
    cuisine: "Pizza • Italiana",
    discount: "-20%",
  },
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    rating: 4.6,
    deliveryTime: "20-30 min",
    deliveryFee: "$30",
    cuisine: "Hamburguesas • Americana",
  },
  {
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop",
    rating: 4.9,
    deliveryTime: "30-40 min",
    deliveryFee: "$35",
    cuisine: "Sushi • Japonesa",
    discount: "-15%",
  },
  {
    name: "Taquería El Mexicano",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop",
    rating: 4.7,
    deliveryTime: "15-25 min",
    deliveryFee: "$20",
    cuisine: "Tacos • Mexicana",
  },
  {
    name: "Pollo Loco",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&h=300&fit=crop",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: "$25",
    cuisine: "Pollo • Asados",
  },
  {
    name: "Pasta Fresca",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "$28",
    cuisine: "Pasta • Italiana",
    discount: "-10%",
  },
];

const RestaurantSection = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Restaurantes cerca de ti
            </h2>
            <p className="text-muted-foreground mt-1">
              Los mejores restaurantes con entrega rápida
            </p>
          </div>
          <button className="text-primary font-semibold hover:underline">
            Ver todos
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RestaurantCard {...restaurant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
