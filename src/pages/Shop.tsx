import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  public_id?: string | null;
  image?: string | null;
  isNew?: boolean;
  isSale?: boolean;
};


const categories = ["All", "Sarees", "Lehengas", "Blouses", "Gowns", "Bridal", "Suits"];

const Shop = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("limit", "48");
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    apiFetch<{ status: string; data: { products: Product[] } }>(`/api/products?${params.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Shop Collection</h1>
              <p className="text-muted-foreground">Discover our curated selection of luxury fashion</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={60000}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                  <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-4">Sort By</h3>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-light shadow-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X className="mr-2" /> : <Filter className="mr-2" />}
              Filters
            </Button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">{products.length} products</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={p.price}
                  image={
                    buildCloudinaryImageUrl(p.public_id) ||
                    (p.image ? buildUploadUrl(p.image) : undefined)
                  }
                  category={p.category}
                  isNew={p.isNew}
                  isSale={p.isSale}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
