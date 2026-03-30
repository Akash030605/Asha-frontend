import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-1.jpg";
import AshabgImage from "@/assets/background image/Ashabg.jpg";
import HeroImg from "@/assets/background image/img.png";


const Hero = () => {
  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Hero Image with Ken Burns effect */}
      <div className="absolute inset-0">
        <img
          src={HeroImg}
          alt="Luxury Fashion Collection"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance">
            Timeless Elegance
            <span className="block text-accent">Crafted for You</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-lg">
            Discover exquisite handcrafted pieces and bespoke tailoring that celebrates your unique style
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-light text-primary-foreground"
              asChild
            >
              <Link to="/shop">Shop Collection</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground backdrop-blur-sm"
              asChild
            >
              <Link to="/custom">Book Tailoring</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
