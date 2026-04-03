import { useEffect, useRef } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import AshaImg from "@/assets/About/ash.jpg";
import heroImg  from "@/assets/hero-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { icon: "✦", title: "Quality Craftsmanship",  text: "Every stitch, every detail crafted with precision and care." },
  { icon: "◈", title: "Personal Touch",          text: "Customised designs reflecting your unique style and personality." },
  { icon: "◇", title: "Timeless Elegance",       text: "Designs that transcend trends and remain beautiful forever." },
];

export default function About() {
  usePageTitle("About Us | Asha Boutique");
  const heroRef    = useRef<HTMLDivElement>(null);
  const storyRef   = useRef<HTMLElement>(null);
  const valuesRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current?.querySelectorAll(".h-reveal") ?? [],
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, delay: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(".story-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6,
          scrollTrigger: { trigger: storyRef.current, start: "top 80%" } }
      );
      gsap.fromTo(".value-card",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.6,
          scrollTrigger: { trigger: valuesRef.current, start: "top 82%" } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div ref={heroRef} className="relative container mx-auto px-6 md:px-10 pb-14">
          <p className="h-reveal text-xs tracking-[0.4em] uppercase text-white/60 mb-3">Our Story</p>
          <h1 className="h-reveal text-5xl md:text-7xl font-serif font-bold text-white">About Asha Boutique</h1>
          <p className="h-reveal text-white/75 mt-4 text-base md:text-lg max-w-xl">Where tradition meets contemporary elegance</p>
        </div>
      </section>

      {/* Story */}
      <section ref={storyRef} className="section-pad bg-white">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
            <div className="story-reveal relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={AshaImg} alt="Asha Sharma" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-5">
              <p className="story-reveal text-xs tracking-[0.3em] uppercase text-secondary">The Founder</p>
              <h2 className="story-reveal text-3xl md:text-4xl font-serif font-bold">Asha Sharma</h2>
              {["With over 15 years of experience in the fashion industry, Asha Sharma founded Asha Boutique with a vision to bring timeless elegance to every woman's wardrobe.",
                "Her passion for traditional Indian craftsmanship combined with contemporary design sensibilities has made Asha Boutique a trusted name for bespoke tailoring and exquisite collections.",
                "Every piece is crafted with meticulous attention to detail, using the finest fabrics and intricate handwork. We believe every woman deserves to feel extraordinary."
              ].map((p, i) => (
                <p key={i} className="story-reveal text-base text-muted-foreground leading-relaxed">{p}</p>
              ))}
              <div className="story-reveal pt-2">
                <Link to="/shop" className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-full text-sm font-medium tracking-wide hover:bg-primary-light transition-colors">
                  Shop the Collection →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="section-pad bg-surface">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-primary font-sans mb-3">What We Stand For</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7 max-w-4xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="value-card text-center p-8 bg-white rounded-2xl border border-border hover:shadow-md transition-shadow">
                <div className="text-3xl text-primary mb-5">{v.icon}</div>
                <h3 className="font-serif text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
