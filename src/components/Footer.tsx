const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-black text-background tracking-tight">
            FOODRUSH
          </span>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-background/70 hover:text-background text-sm font-medium transition-colors">
              Términos
            </a>
            <a href="#" className="text-background/70 hover:text-background text-sm font-medium transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-background/70 hover:text-background text-sm font-medium transition-colors">
              Ayuda
            </a>
          </div>
          
          <p className="text-background/50 text-sm">
            © 2024 FoodRush
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
