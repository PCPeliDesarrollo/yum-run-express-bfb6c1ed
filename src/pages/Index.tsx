import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
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
