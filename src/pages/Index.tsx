import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";
import KitchenClosedBanner from "@/components/KitchenClosedBanner";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <KitchenClosedBanner />
      <HeroSection />
      <section id="menu">
        <MenuSection />
      </section>
      <PromoSection />
      <Footer />
    </main>
  );
};

export default Index;
