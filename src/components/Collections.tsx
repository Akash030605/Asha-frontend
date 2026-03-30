import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CollectionCard from "./CollectionCard";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

interface CollectionItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  public_id?: string | null;
  image?: string | null;
  fabric?: string;
  style?: string;
  occasion?: string;
  work_type?: string;
  color?: string;
  isNew: boolean;
  isFeatured: boolean;
}

interface CollectionStats {
  sarees: number;
  lehengas: number;
  blouses: number;
}

const Collections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true);
        
        // Fetch items from all three collections
        const [sareesRes, lehengasRes, blousesRes] = await Promise.all([
          apiFetch<{ data: { sarees: CollectionItem[] } }>("/api/sarees?limit=4"),
          apiFetch<{ data: { lehengas: CollectionItem[] } }>("/api/lehengas?limit=4"),
          apiFetch<{ data: { blouses: CollectionItem[] } }>("/api/blouses?limit=4")
        ]);

        // Get counts for each collection
        const [sareesCountRes, lehengasCountRes, blousesCountRes] = await Promise.all([
          apiFetch<{ data: { pagination: { total_items: number } } }>("/api/sarees?limit=1"),
          apiFetch<{ data: { pagination: { total_items: number } } }>("/api/lehengas?limit=1"),
          apiFetch<{ data: { pagination: { total_items: number } } }>("/api/blouses?limit=1")
        ]);

        const stats: CollectionStats = {
          sarees: sareesCountRes.data?.pagination?.total_items || 0,
          lehengas: lehengasCountRes.data?.pagination?.total_items || 0,
          blouses: blousesCountRes.data?.pagination?.total_items || 0
        };

        // Get featured images for each collection
        const featuredSarees = await apiFetch<{ data: { sarees: CollectionItem[] } }>("/api/sarees?isFeatured=true&limit=1");
        const featuredLehengas = await apiFetch<{ data: { lehengas: CollectionItem[] } }>("/api/lehengas?isFeatured=true&limit=1");
        const featuredBlouses = await apiFetch<{ data: { blouses: CollectionItem[] } }>("/api/blouses?isFeatured=true&limit=1");

        // Build collections array with actual data
        const collectionsData = [
          {
            id: 1,
            name: "Exquisite Silk & Banarasi Sarees",
            image:
              buildCloudinaryImageUrl(featuredSarees.data?.sarees?.[0]?.public_id) ||
              (featuredSarees.data?.sarees?.[0]?.image
                ? buildUploadUrl(featuredSarees.data.sarees[0].image)
                : undefined) ||
              "/placeholder.svg",
            category: "Sarees",
            description: "Traditional and contemporary sarees with intricate embroidery and premium fabrics",
            itemCount: stats.sarees,
          },
          {
            id: 2,
            name: "Luxurious Bridal & Party Lehengas",
            image:
              buildCloudinaryImageUrl(featuredLehengas.data?.lehengas?.[0]?.public_id) ||
              (featuredLehengas.data?.lehengas?.[0]?.image
                ? buildUploadUrl(featuredLehengas.data.lehengas[0].image)
                : undefined) ||
              "/placeholder.svg",
            category: "Lehenga",
            description: "Stunning lehengas for weddings and special occasions with detailed craftsmanship",
            itemCount: stats.lehengas,
          },
          {
            id: 3,
            name: "Designer Blouses & Cholis",
            image:
              buildCloudinaryImageUrl(featuredBlouses.data?.blouses?.[0]?.public_id) ||
              (featuredBlouses.data?.blouses?.[0]?.image
                ? buildUploadUrl(featuredBlouses.data.blouses[0].image)
                : undefined) ||
              "/placeholder.svg",
            category: "Blouses",
            description: "Elegant blouses featuring traditional and modern designs with perfect fit",
            itemCount: stats.blouses,
          },
        ];

        setCollections(collectionsData);
      } catch (err: any) {
        console.error("Failed to fetch collections:", err);
        setError(err?.message || "Failed to load collections");
        
        // Fallback to static data if API fails
        setCollections([
          {
            id: 1,
            name: "Exquisite Silk & Banarasi Sarees",
            image: "/placeholder.svg",
            category: "Sarees",
            description: "Traditional and contemporary sarees with intricate embroidery and premium fabrics",
            itemCount: 45,
          },
          {
            id: 2,
            name: "Luxurious Bridal & Party Lehengas",
            image: "/placeholder.svg",
            category: "Lehenga",
            description: "Stunning lehengas for weddings and special occasions with detailed craftsmanship",
            itemCount: 32,
          },
          {
            id: 3,
            name: "Designer Blouses & Cholis",
            image: "/placeholder.svg",
            category: "Blouses",
            description: "Elegant blouses featuring traditional and modern designs with perfect fit",
            itemCount: 28,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
              Shop By Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our carefully curated collections of traditional Indian wear
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-2xl mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && collections.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Shop By Category
          </h2>
          <p className="text-red-600 mb-4">Error loading collections: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Shop By Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections of traditional Indian wear
          </p>
          {error && (
            <p className="text-yellow-600 text-sm mt-2">
              Showing cached data: {error}
            </p>
          )}
        </div>

        {/* Three Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
        </div>

        {/* Optional: View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/collections"
            className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
          >
            View All Categories
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

export default Collections;