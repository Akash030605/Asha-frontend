import { useEffect, useRef, useState } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface CollectionItem {
  _id: string; name: string; description: string; category: string;
  public_id?: string | null; image?: string | null;
  isNew: boolean; isFeatured: boolean; created_at: string;
}

function CollectionSection({ title, items, collectionPath }: { title: string; items: CollectionItem[]; collectionPath: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current || items.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".c-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6,
          scrollTrigger: { trigger: ref.current, start: "top 82%" } }
      );
    }, ref);
    return () => ctx.revert();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section ref={ref} className="py-16 border-b border-border last:border-0">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-9">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans mb-2">Collection</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">{title}</h2>
          </div>
          <Link to={`/collections/${collectionPath}`}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            View All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {items.slice(0, 4).map((item) => (
            <ProductCard key={item._id} id={item._id} name={item.name} price={0}
              image={item.public_id ? buildCloudinaryImageUrl(item.public_id) : item.image ? buildUploadUrl(item.image) : undefined}
              category={item.category} isNew={item.isNew} className="c-card" />
          ))}
        </div>
        <div className="mt-7 md:hidden text-center">
          <Link to={`/collections/${collectionPath}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
            View All {title}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Collections() {
  usePageTitle("Collections | Sarees, Lehengas & Blouses | Asha Boutique");
  const [sarees,   setSarees]   = useState<CollectionItem[]>([]);
  const [lehengas, setLehengas] = useState<CollectionItem[]>([]);
  const [blouses,  setBlouses]  = useState<CollectionItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current.querySelectorAll(".h-reveal"),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.65, delay: 0.15, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    Promise.all([
      apiFetch<any>("/api/sarees?limit=8"),
      apiFetch<any>("/api/lehengas?limit=8"),
      apiFetch<any>("/api/blouses?limit=8"),
    ]).then(([s, l, b]) => {
      setSarees(s.data?.sarees || []);
      setLehengas(l.data?.lehengas || []);
      setBlouses(b.data?.blouses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div ref={heroRef} className="pt-28 pb-14 bg-surface border-b border-border">
        <div className="container mx-auto px-6 md:px-10">
          <p className="h-reveal text-xs tracking-[0.35em] uppercase text-primary font-sans mb-3">Asha Boutique</p>
          <h1 className="h-reveal text-5xl md:text-6xl font-serif font-bold">Our Collections</h1>
          <p className="h-reveal text-muted-foreground mt-4 max-w-xl text-base">
            Each piece tells a story of elegance, tradition, and timeless beauty — handcrafted with love.
          </p>
        </div>
      </div>

      {/* Collections */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="py-6">
          <CollectionSection title="Sarees"   items={sarees}   collectionPath="sarees" />
          <CollectionSection title="Lehengas" items={lehengas} collectionPath="lehengas" />
          <CollectionSection title="Blouses"  items={blouses}  collectionPath="blouses" />
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-6 md:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Looking for Something Specific?</h2>
          <p className="text-muted-foreground mb-8 text-base">Browse our complete catalogue or get in touch for custom orders.</p>
          <Link to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full text-sm font-medium tracking-wide hover:bg-primary-light transition-colors">
            Browse All Products →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
