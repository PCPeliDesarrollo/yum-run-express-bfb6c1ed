const categories = [
  { name: "Hamburguesas", emoji: "🍔" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Pollo", emoji: "🍗" },
  { name: "Tacos", emoji: "🌮" },
  { name: "Sushi", emoji: "🍣" },
  { name: "Postres", emoji: "🍰" },
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-foreground text-center mb-8">
          ¿QUÉ SE TE ANTOJA?
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-center p-4 bg-muted rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 group cursor-pointer"
            >
              <span className="text-4xl mb-2">{category.emoji}</span>
              <span className="text-sm font-bold group-hover:text-primary-foreground">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
