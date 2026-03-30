import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-1.jpg";
import AshaImage from "@/assets/About/ash.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              About Asha Boutique
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Where tradition meets contemporary elegance
            </p>
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={AshaImage}
                alt="Asha Sharma - Founder of Asha Boutique"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Meet Asha Sharma
              </h2>
              <p className="text-lg text-muted-foreground">
                With over 15 years of experience in the fashion industry, Asha Sharma founded Asha Boutique with a vision to bring timeless elegance to every woman's wardrobe.
              </p>
              <p className="text-lg text-muted-foreground">
                Her passion for traditional Indian craftsmanship combined with contemporary design sensibilities has made Asha Boutique a trusted name for bespoke tailoring and exquisite ready-to-wear collections.
              </p>
              <p className="text-lg text-muted-foreground">
                Every piece at Asha Boutique is crafted with meticulous attention to detail, using the finest fabrics and intricate handwork. We believe that every woman deserves to feel confident and beautiful in what she wears.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary-light" asChild>
                <Link to="/shop">Shop Our Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-foreground">
              Our Mission & Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground">Quality Craftsmanship</h3>
                <p className="text-muted-foreground">
                  Every stitch, every detail is crafted with precision and care
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground">Personal Touch</h3>
                <p className="text-muted-foreground">
                  Customized designs that reflect your unique style and personality
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground">Timeless Elegance</h3>
                <p className="text-muted-foreground">
                  Designs that transcend trends and remain beautiful forever
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
