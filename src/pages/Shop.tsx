import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { useInfiniteQuery } from "@tanstack/react-query";

type Product = {
  _id: string; name: string; price: number; category: string;
  public_id?: string | null; image?: string | null; isNew?: boolean; isSale?: boolean;
};

const CATEGORIES = ["All", "Sarees", "Lehengas", "Blouses", "Gowns", "Bridal", "Suits"];
const PAGE_SIZE = 24;

export default function Shop() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["shopProducts", selectedCategory],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(pageParam) });
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      const r = await apiFetch<{ data: { products: Product[] } }>(`/api/products?${params}`);
      return r.data.products || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const products = useMemo(() => data?.pages.flat() || [], [data]);

  const cards = useMemo(() => products.map((p) => (
    <ProductCard key={p._id} id={p._id} name={p.name} price={p.price}
      image={buildCloudinaryImageUrl(p.public_id) || (p.image ? buildUploadUrl(p.image) : undefined)}
      category={p.category} isNew={p.isNew} isSale={p.isSale} />
  )), [products]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
      <div ref={headerRef} className="pt-28 pb-10 bg-surface border-b border-border">
        <div className="container mx-auto px-6 md:px-10">
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-sans mb-2">Asha Boutique</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">Shop Collection</h1>
          <p className="text-muted-foreground mt-3 text-sm">Discover our curated selection of luxury Indian fashion</p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-10 py-10">
        <div className="flex gap-10">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs tracking-[0.25em] uppercase font-medium text-muted-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setSelectedCategory(c)}
                      className={cn("block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === c ? "bg-primary/[0.08] text-primary font-medium" : "text-foreground hover:bg-muted"
                      )}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter button */}
          <button
            className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-full shadow-lg text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            Filter
          </button>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t border-border rounded-t-2xl p-6 shadow-lg">
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((c) => (
                  <button key={c}
                    onClick={() => { setSelectedCategory(c); setShowFilters(false); }}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-medium border transition-colors",
                      selectedCategory === c ? "bg-primary text-white border-primary" : "border-border hover:border-primary"
                    )}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-7">
              <p className="text-sm text-muted-foreground">{products.length} products</p>
            </div>
            {isError ? (
              <div className="py-24 text-center">
                <p className="text-muted-foreground mb-4">Failed to load products. Please try again.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">{cards}</div>
            )}
            {!isError && <div className="mt-12 flex justify-center">
              {hasNextPage
                ? <Button variant="outline" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}
                    className="px-8 rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                    {isFetchingNextPage ? "Loading…" : "Load More"}
                  </Button>
                : <p className="text-sm text-muted-foreground">{products.length === 0 && !isLoading ? "No products found." : products.length > 0 ? "You've seen everything ✦" : ""}</p>
              }
            </div>}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
