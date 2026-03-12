import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-foreground text-background py-12 safe-bottom">
      <div className="container mx-auto px-4 safe-x">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
              tryb <span className="text-secondary">burger</span>
            </h3>
            <p className="text-background/70 text-sm">
              Las mejores hamburguesas de la ciudad, hechas con amor y los ingredientes más frescos.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>📍 Calle San Blas 58</li>
              <li>📞 924 40 16 89</li>
              <li>📞 722 78 18 09</li>
              <li>✉️ hola@trybburger.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Horario</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>Lun - Jue: 12:00 - 22:00</li>
              <li>Vie - Sáb: 12:00 - 00:00</li>
              <li>Dom: 13:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">© 2026 Tryb Burger. Todos los derechos reservados.</p>
          <p className="text-background/50 text-sm">© PcPeli Desarrollo</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/trybburger/?hl=es"
              className="text-background/70 hover:text-secondary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/TrybBurgerAlburquerque/?locale=es_LA"
              className="text-background/70 hover:text-secondary transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
