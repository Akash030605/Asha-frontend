import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiFetch<{ status: string; data: any }>(
        `/api/products?limit=1&page=1&search=${id}`
      );
      return (res as any).data?.products?.[0] || null;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[4/5] rounded-lg bg-muted animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-8 w-1/4 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-serif font-bold mb-3">Product not found</h2>
          <p className="text-muted-foreground mb-6">This product may no longer be available.</p>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <img
                src={
                  buildCloudinaryImageUrl(product.public_id) ||
                  (product.image ? buildUploadUrl(product.image) : undefined) ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category || ""}
              </p>
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground">New Arrival</Badge>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ₹{(product.price || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || ""}
            </p>

            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-light text-primary-foreground"
                onClick={async () => {
                  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
                  if (!token) { navigate("/login"); return; }
                  try {
                    const res: any = await apiFetch("/api/payment/create-order", {
                      method: "POST",
                      token,
                      body: { product_id: product._id, quantity },
                    });
                    const key_id = res.data.key_id;
                    const data = res.data;
                    const options: any = {
                      key: key_id,
                      amount: data.amount,
                      currency: data.currency,
                      name: "Asha Boutique",
                      description: product.name,
                      order_id: data.razorpay_order.id,
                      handler: async function (response: any) {
                        try {
                          await apiFetch("/api/payment/verify", { method: "POST", token, body: response });
                          navigate("/my-orders");
                        } catch {
                          alert("Payment verification failed. Please contact support with your order details.");
                        }
                      },
                      prefill: {},
                      theme: { color: "#C026D3" },
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                  } catch {
                    alert("Could not initiate payment. Please try again.");
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-muted">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {product.details?.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((detail: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
