import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import TextReveal from "./TextReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

gsap.registerPlugin(ScrollTrigger);

type Product = {
  _id: string; name: string; price: number; category: string;
  public_id?: string | null; image?: string | null; isNew?: boolean; isSale?: boolean;
};

export default function FeaturedProducts() {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () =>
      apiFetch<{ data: { products: Product[] } }>("/api/products?limit=8").then(
        (r) => r.data.products || []
      ),
  });

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const numRef     = useRef<HTMLSpanElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }
  }, [loading]);

  useEffect(() => {
    if (!sectionRef.current || products.length === 0) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(numRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.inOut",
          scrollTrigger: { trigger: headerRef.current, start: "top 88%" } }
      );

      gsap.fromTo(".fp-divider",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut",
          scrollTrigger: { trigger: headerRef.current, start: "top 86%" } }
      );

      const cards = gridRef.current?.querySelectorAll(".product-card") ?? [];
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { clipPath: "inset(0 0 100% 0)", y: 12 },
          {
            clipPath: "inset(0 0 0% 0)", y: 0,
            duration: 0.85, ease: "power3.out",
            delay: i * 0.06,
            scrollTrigger: { trigger: gridRef.current, start: "top 84%" },
          }
        );

        const img = card.querySelector("img");
        if (img) {
          gsap.fromTo(img,
            { yPercent: -8 },
            { yPercent: 8, ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } }
          );
        }
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [products]);

  return (
    <section ref={sectionRef} className="section-pad" style={{ background: "hsl(248 10% 93%)" }}>
      <div className="container-pad">

        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                ref={numRef}
                className="font-mono text-[10px]"
                style={{ color: "hsl(248 46% 40%)" }}
              >02</span>
              <span className="block w-6 h-px" style={{ background: "hsl(248 46% 40%)" }} />
              <span className="text-[10px] tracking-[0.32em] uppercase font-sans" style={{ color: "hsl(248 46% 40%)" }}>Curated Selection</span>
            </div>
            <TextReveal as="h2" className="text-display-sm font-serif font-bold text-foreground" triggerStart="top 88%">
              New Arrivals
            </TextReveal>
          </div>
          <div className="flex items-center gap-4">
            <span className="fp-divider block w-16 h-px" style={{ background: "hsl(310 10% 87%)" }} />
            <Link
              to="/shop"
              className="text-[11px] font-medium tracking-[0.18em] uppercase pb-0.5 transition-colors duration-200"
              style={{ color: "hsl(310 68% 38%)", borderBottom: "1px solid hsl(310 68% 38% / 0.35)" }}
            >
              View All
            </Link>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="w-full aspect-[3/4]" />
                  <Skeleton className="h-2 w-14 mt-1" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3.5 w-24 mt-0.5" />
                </div>
              ))
            : products.map((p) => (
                <ProductCard
                  key={p._id} id={p._id} name={p.name} price={p.price}
                  image={buildCloudinaryImageUrl(p.public_id) || (p.image ? buildUploadUrl(p.image) : undefined)}
                  category={p.category} isNew={p.isNew} isSale={p.isSale}
                  className="product-card"
                />
              ))
          }
        </div>
      </div>
    </section>
  );
}
