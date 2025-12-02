import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import RestaurantSection from "@/components/RestaurantSection";
import PromoSection from "@/components/PromoSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <RestaurantSection />
      <PromoSection />
      <Footer />
    </main>
  );
};

export default Index;
