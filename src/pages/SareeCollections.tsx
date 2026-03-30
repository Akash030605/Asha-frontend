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
  image?: string | null;
  fabric?: string;
  work_type?: string;
  color?: string;
  isNew: boolean;
  isFeatured: boolean;
}

const SareesCollection = () => {
  const [sarees, setSarees] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSarees = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<{ data: { sarees: CollectionItem[] } }>("/api/sarees?limit=50");
        setSarees(response.data?.sarees || []);
      } catch (err: any) {
        console.error("Failed to fetch sarees:", err);
        setError(err?.message || "Failed to load sarees collection");
      } finally {
        setLoading(false);
      }
    };

    fetchSarees();
  }, []);

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
                <li className="text-foreground">Sarees</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
              Sarees Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our exquisite range of traditional and contemporary sarees, crafted with premium fabrics and intricate designs.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Sarees Grid */}
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
          ) : sarees.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {sarees.map((saree) => (
                <ProductCard 
                  key={saree._id}
                  id={saree._id}
                  name={saree.name}
                  price={0} // Collections don't have prices
                  image={
                    saree.public_id
                      ? (buildCloudinaryImageUrl(saree.public_id) || "/placeholder.svg")
                      : saree.image
                        ? (buildUploadUrl(saree.image) || "/placeholder.svg")
                        : "/placeholder.svg"
                  }
                  category={saree.category}
                  isNew={saree.isNew}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No sarees found in the collection.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SareesCollection;