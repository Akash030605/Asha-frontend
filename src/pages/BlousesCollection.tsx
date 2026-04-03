import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

interface CollectionItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  public_id?: string | null;
  image?: string | null;
  style?: string;
  work_type?: string;
  color?: string;
  isNew: boolean;
  isFeatured: boolean;
}

import { useQuery } from "@tanstack/react-query";

const BlousesCollection = () => {
  usePageTitle("Designer Blouse Collection | Asha Boutique");
  const { data: blouses = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ["blousesCollection"],
    queryFn: async () => {
      const response = await apiFetch<{ data: { blouses: CollectionItem[] } }>(
        "/api/blouses?limit=50"
      );
      return response.data?.blouses || [];
    },
  });

  const error = queryError?.message || null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Collection Header */}
      <section className="relative py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="flex justify-center mb-6">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li>/</li>
                <li><Link to="/collections" className="hover:text-foreground">Collections</Link></li>
                <li>/</li>
                <li className="text-foreground">Blouses</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
              Blouses Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our elegant collection of designer blouses, featuring traditional and contemporary styles.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Blouses Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="aspect-[4/5] bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : blouses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {blouses.map((blouse) => (
                <ProductCard 
                  key={blouse._id}
                  id={blouse._id}
                  name={blouse.name}
                  price={0} // Collections don't have prices
                  image={
                    blouse.public_id
                      ? (buildCloudinaryImageUrl(blouse.public_id) || "/placeholder.svg")
                      : blouse.image
                        ? (buildUploadUrl(blouse.image) || "/placeholder.svg")
                        : "/placeholder.svg"
                  }
                  category={blouse.category}
                  isNew={blouse.isNew}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blouses found in the collection.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlousesCollection;