import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  // Legacy schema
  image?: string | null;
  fabric?: string;
  style?: string;
  occasion?: string;
  work_type?: string;
  color?: string;
  isNew: boolean;
  isFeatured: boolean;
  created_at: string;
}

const CollectionSection = ({ 
  title, 
  items, 
  collectionPath 
}: { 
  title: string; 
  items: any[]; 
  collectionPath: string 
}) => {
  const displayItems = items.slice(0, 4); // Show only 4 items initially

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-muted-foreground">
              Explore our exquisite collection of {title.toLowerCase()}
            </p>
          </div>
          <Link
            to={`/collections/${collectionPath}`}
            className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
          >
            View All
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayItems.map((item) => (
            <ProductCard 
              key={item._id}
              id={item._id}
              name={item.name}
              // Since collections don't have prices, we can set a placeholder or remove price
              price={0} // Or you can modify ProductCard to handle no-price scenario
              image={
                item.public_id
                  ? (buildCloudinaryImageUrl(item.public_id) || "/placeholder.svg")
                  : item.image
                    ? (buildUploadUrl(item.image) || "/placeholder.svg")
                    : "/placeholder.svg"
              }
              category={item.category}
              isNew={item.isNew}
              // You might want to add isFeatured or other props as needed
            />
          ))}
        </div>

        {/* Show More Button for Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to={`/collections/${collectionPath}`}
            className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
          >
            Show More {title}
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Collections = () => {
  const [sarees, setSarees] = useState<CollectionItem[]>([]);
  const [lehengas, setLehengas] = useState<CollectionItem[]>([]);
  const [blouses, setBlouses] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all three collection APIs
        const [sareesRes, lehengasRes, blousesRes] = await Promise.all([
          apiFetch<{ data: { sarees: CollectionItem[] } }>("/api/sarees?limit=8"),
          apiFetch<{ data: { lehengas: CollectionItem[] } }>("/api/lehengas?limit=8"),
          apiFetch<{ data: { blouses: CollectionItem[] } }>("/api/blouses?limit=8")
        ]);

        setSarees(sareesRes.data?.sarees || []);
        setLehengas(lehengasRes.data?.lehengas || []);
        setBlouses(blousesRes.data?.blouses || []);

      } catch (err: any) {
        console.error("Failed to fetch collections:", err);
        setError(err?.message || "Failed to load collections");
        
        // Fallback to empty arrays if API fails
        setSarees([]);
        setLehengas([]);
        setBlouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        
        {/* Hero Section Skeleton */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="h-12 bg-muted rounded-lg mb-6 mx-auto w-64 animate-pulse"></div>
              <div className="h-6 bg-muted rounded mx-auto w-96 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Collection Sections Skeleton */}
        {[1, 2, 3].map((section) => (
          <section key={section} className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="aspect-[4/5] bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              Our Collections
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Exquisite designs handcrafted with love at Asha Boutique. Each piece tells a story of elegance, tradition, and timeless beauty.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  Note: Some data may not be available. {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sarees Collection */}
      <CollectionSection 
        title="Sarees" 
        items={sarees} 
        collectionPath="sarees" 
      />

      {/* Lehengas Collection */}
      <CollectionSection 
        title="Lehengas" 
        items={lehengas} 
        collectionPath="lehengas" 
      />

      {/* Blouses Collection */}
      <CollectionSection 
        title="Blouses" 
        items={blouses} 
        collectionPath="blouses" 
      />

      {/* All Collections CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Explore our complete catalog with hundreds of exclusive designs and custom options.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 text-lg"
          >
            Browse All Products
            <svg 
              className="ml-3 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collections;