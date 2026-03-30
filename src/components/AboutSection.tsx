import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-1.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Meet Asha Sharma
            </h2>
            <p className="text-lg text-muted-foreground">
              With over 15 years of experience in the fashion industry, Asha Sharma founded Asha Boutique with a vision to bring timeless elegance to every woman's wardrobe.
            </p>
            <p className="text-lg text-muted-foreground">
              Her passion for traditional Indian craftsmanship combined with contemporary design sensibilities has made Asha Boutique a trusted name for bespoke tailoring and exquisite collections.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-light" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg animate-fade-in">
            <img
              src={heroImage}
              alt="Asha Sharma - Founder of Asha Boutique"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
