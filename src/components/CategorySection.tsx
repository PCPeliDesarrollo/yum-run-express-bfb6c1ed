const categories = [
  { name: "Pizza", emoji: "🍕", color: "from-orange-400 to-red-500" },
  { name: "Hamburguesas", emoji: "🍔", color: "from-yellow-400 to-orange-500" },
  { name: "Sushi", emoji: "🍣", color: "from-pink-400 to-rose-500" },
  { name: "Tacos", emoji: "🌮", color: "from-green-400 to-emerald-500" },
  { name: "Pollo", emoji: "🍗", color: "from-amber-400 to-orange-500" },
  { name: "Pasta", emoji: "🍝", color: "from-red-400 to-rose-500" },
  { name: "Postres", emoji: "🍰", color: "from-pink-300 to-purple-400" },
  { name: "Bebidas", emoji: "🥤", color: "from-blue-400 to-cyan-500" },
];

const CategorySection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Explora por categoría
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col items-center p-4 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 group-hover:scale-105">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                  {category.emoji}
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
