// CollectionCard.tsx
import React, { memo } from "react";
import { Link } from "react-router-dom";

interface CollectionCardProps {
  id: number;
  name: string;
  image: string;
  category: string;
  description?: string;
  itemCount: number;
}

const CollectionCard = memo(({
  id,
  name,
  image,
  category,
  description,
  itemCount,
}: CollectionCardProps) => {
  return (
    <div className="group relative animate-fade-in">
      <Link to={`/collections/${category.toLowerCase()}`} aria-label={`View ${category}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-4">
          {/* Image */}
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              // avoid infinite loop: only set fallback once
              if (img.dataset.errored === "true") return;
              img.dataset.errored = "true";
              img.src = "/placeholder.svg";

              // remove further handlers to be safe
              img.onerror = null;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider text-white/80">Collection</span>
            </div>

            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-2xl md:text-3xl font-serif mb-3">{name}</h3>

            {description && (
              <p className="text-white/90 text-sm mb-4 max-w-md">{description}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">{itemCount} pieces</span>
              <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                Explore
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default CollectionCard;