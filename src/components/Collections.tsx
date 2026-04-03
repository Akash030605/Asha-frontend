import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

const fallback = [
  { id: 1, name: "Silk Sarees",      path: "sarees",   label: "01", image: "" },
  { id: 2, name: "Bridal Lehengas",  path: "lehengas", label: "02", image: "" },
  { id: 3, name: "Designer Blouses", path: "blouses",  label: "03", image: "" },
];
import { useQuery } from "@tanstack/react-query";

export default function CollectionsSection() {
  const { data: cols = fallback, isLoading: loading } = useQuery({
    queryKey: ["collectionsImages"],
    queryFn: async () => {
      const [sRes, lRes, bRes] = await Promise.all([
        apiFetch<any>("/api/sarees?isFeatured=true&limit=1"),
        apiFetch<any>("/api/lehengas?isFeatured=true&limit=1"),
        apiFetch<any>("/api/blouses?isFeatured=true&limit=1"),
      ]);
      const g = (res: any, key: string) => {
        const item = res?.data?.[key]?.[0];
        return buildCloudinaryImageUrl(item?.public_id) || (item?.image ? buildUploadUrl(item.image) : "");
      };
      return [
        { ...fallback[0], image: g(sRes, "sarees") },
        { ...fallback[1], image: g(lRes, "lehengas") },
        { ...fallback[2], image: g(bRes, "blouses") },
      ];
    },
  });

  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }
  }, [loading]);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;
    xTo.current = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      gsap.fromTo(".coll-line",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 84%" } }
      );

      gsap.fromTo(".coll-row",
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, [cols]);

  return (
    <section ref={sectionRef} className="section-pad overflow-hidden" style={{ background: "hsl(30 18% 99%)" }}>
      <div className="container-pad">

        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px]" style={{ color: "hsl(310 68% 38%)" }}>03</span>
              <span className="block w-6 h-px" style={{ background: "hsl(310 68% 38%)" }} />
              <span className="text-[10px] tracking-[0.32em] uppercase font-sans" style={{ color: "hsl(310 68% 38%)" }}>Shop by Category</span>
            </div>
            <TextReveal as="h2" className="text-display-sm font-serif font-bold text-foreground" triggerStart="top 84%">
              Our Collections
            </TextReveal>
          </div>
          <Link
            to="/collections"
            className="hidden md:block text-[11px] tracking-[0.18em] uppercase pb-0.5 transition-colors duration-200"
            style={{ color: "hsl(248 46% 40%)", borderBottom: "1px solid hsl(248 46% 40% / 0.35)" }}
          >
            View All
          </Link>
        </div>

        <span className="coll-line block w-full h-px mb-0" style={{ background: "hsl(310 10% 87%)" }} />

        <div>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-8 md:py-10 border-b border-border last:border-b-0">
                  <div className="flex items-baseline gap-5">
                    <Skeleton className="h-3 w-5" />
                    <Skeleton className="h-9 w-48 md:w-72" />
                  </div>
                  <Skeleton className="h-px w-8" />
                </div>
              ))
            : cols.map((c, i) => (
            <Link
              key={c.id}
              to={`/collections/${c.path}`}
              className="coll-row group flex items-center justify-between py-8 md:py-10 border-b last:border-b-0"
              style={{ borderColor: "hsl(310 10% 87%)" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-[11px] text-muted-foreground">{c.label}</span>
                <span className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-none">
                  {c.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore
                </span>
                <span className="block w-6 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-primary transition-all duration-400" />
              </div>
            </Link>
          ))}
        </div>

        <div
          ref={floatRef}
          className="fixed top-0 left-0 z-[200] hidden md:block pointer-events-none"
          style={{
            width: "260px",
            aspectRatio: "3/4",
            transform: "translate(-50%, -60%)",
            opacity: hovered !== null ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          {cols.map((c, i) => (
            <div
              key={c.id}
              className="absolute inset-0 overflow-hidden"
              style={{
                opacity: hovered === i ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              {c.image
                ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-surface-2" />
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
