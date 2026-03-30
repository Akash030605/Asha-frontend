import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
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

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiFetch<{ status: string; data: { products: Product[] } }>("/api/products?limit=8")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked pieces that define timeless elegance and contemporary style
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
    </section>
  );
};

export default FeaturedProducts;
