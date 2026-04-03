import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import FeaturedProducts from "@/components/FeaturedProducts";
import Collections from "@/components/Collections";
import MarqueeStrip from "@/components/MarqueeStrip";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  usePageTitle("Asha Boutique | Handcrafted Sarees, Lehengas & Custom Tailoring");
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CategoryNav />
      <FeaturedProducts />
      <MarqueeStrip />
      <Collections />
      <ProcessSection />
      <AboutSection />
      <MarqueeStrip direction="right" dark />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
