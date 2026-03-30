import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import FeaturedProducts from "@/components/FeaturedProducts";
import ReviewsSection from "@/components/ReviewsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import Collections from "@/components/Collections";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CategoryNav />
      <FeaturedProducts />
      <Collections />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
