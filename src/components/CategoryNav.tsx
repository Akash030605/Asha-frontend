import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "All",      slug: "" },
  { name: "Sarees",   slug: "sarees" },
  { name: "Lehengas", slug: "lehengas" },
  { name: "Blouses",  slug: "blouses" },
  { name: "Bridal",   slug: "bridal" },
  { name: "Gowns",    slug: "gowns" },
  { name: "Suits",    slug: "suits" },
];

export default function CategoryNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.querySelectorAll(".cat-item"),
      { opacity: 0, y: 10 },
      {
        opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%" },
      }
    );
  }, []);

  return (
    <section ref={ref} className="border-y border-border bg-white">
      <div className="container-pad">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to={c.slug ? `/shop?category=${c.slug}` : "/shop"}
              className={cn(
                "cat-item flex-shrink-0 px-5 py-4 text-[11px] font-medium tracking-[0.22em] uppercase",
                "border-r border-border last:border-r-0",
                "text-muted-foreground hover:text-foreground hover:bg-surface transition-colors duration-200",
                i === 0 && "text-foreground"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
