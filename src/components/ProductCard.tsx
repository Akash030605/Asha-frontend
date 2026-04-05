import { memo, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  className?: string;
}

const WHATSAPP = "919900669011";

function ProductCard({ id, name, price, image, category, isNew, isSale, className }: ProductCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const waUrl = useMemo(() => {
    const msg = encodeURIComponent(`Hi, I'm interested in:\n\n${name}\n₹${price.toLocaleString("en-IN")}\n${category}`);
    return `https://wa.me/${WHATSAPP}?text=${msg}`;
  }, [name, price, category]);

  return (
    <article className={cn("group product-card-wrap", className)}>
      <Link to={`/product/${id}`} className="block">

        {/* ── Image container ── */}
        <div className="relative aspect-[3/4] overflow-hidden mb-4">

          {/* Badges */}
          <div className="absolute top-0 left-0 z-10 flex flex-col gap-0">
            {isNew && (
              <span
                className="text-[8px] font-semibold tracking-[0.25em] uppercase px-3 py-1.5"
                style={{ background: "hsl(248 46% 40%)", color: "#fff" }}
              >
                New
              </span>
            )}
            {isSale && (
              <span
                className="text-[8px] font-semibold tracking-[0.25em] uppercase px-3 py-1.5"
                style={{ background: "hsl(310 68% 38%)", color: "#fff" }}
              >
                Sale
              </span>
            )}
          </div>

          {/* Image */}
          <img
            ref={imgRef}
            src={image || "/placeholder.svg"}
            alt={name || "Product"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            onError={(e) => {
              if (!e.currentTarget.src.includes("/placeholder.svg"))
                e.currentTarget.src = "/placeholder.svg";
            }}
          />

          {/* Hover overlay — gradient from bottom */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "linear-gradient(0deg, hsl(248 28% 9% / 0.45) 0%, transparent 50%)" }}
          />

          {/* ── Hover action bar ── */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-3 pb-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <button
              onClick={(e) => { e.preventDefault(); window.open(waUrl, "_blank"); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[9px] font-semibold tracking-[0.18em] uppercase transition-colors duration-200"
              style={{
                background: "hsl(0 0% 100% / 0.92)",
                backdropFilter: "blur(8px)",
                color: "hsl(248 28% 9%)",
              }}
            >
              <MessageCircle className="w-3 h-3" />
              Enquire
            </button>

            <span
              className="w-8 h-8 flex items-center justify-center"
              style={{
                background: "hsl(0 0% 100% / 0.92)",
                backdropFilter: "blur(8px)",
                color: "hsl(248 28% 9%)",
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ── Product info ── */}
        <div className="flex flex-col gap-1">
          {/* Category label */}
          <p
            className="text-[9px] font-medium tracking-[0.28em] uppercase"
            style={{ color: "hsl(248 12% 56%)" }}
          >
            {category}
          </p>

          {/* Product name */}
          <h3
            className="text-[14px] font-serif font-semibold leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary"
            style={{ color: "hsl(248 28% 9%)" }}
          >
            {name}
          </h3>

          {/* Price row */}
          {price > 0 && (
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className="text-[13px] font-semibold tabular-nums"
                style={{ color: "hsl(310 68% 38%)" }}
              >
                ₹{price.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: "hsl(248 12% 60%)" }}>
                INR
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
