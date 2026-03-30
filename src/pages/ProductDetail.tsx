import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { apiFetch, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch<{ status: string; data: any }>(`/api/products?limit=1&page=1&search=${id}`)
      .then((res) => {
        const p = (res as any).data?.products?.[0];
        setProduct(p || null);
      })
      .catch((e) => setError(e?.message || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <img
                src={
                  buildCloudinaryImageUrl(product?.public_id) ||
                  (product?.image ? buildUploadUrl(product.image) : undefined) ||
                  "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product?.category || ""}
              </p>
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground">New Arrival</Badge>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {product?.name || ""}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ₹{(product?.price || 0).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product?.description || ""}
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex gap-3">
                {["S","M","L","XL"].map((size) => (
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

            {/* Quantity */}
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

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary-light text-primary-foreground"
                onClick={async () => {
                  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
                  if (!token) { navigate("/login"); return; }
                  try {
                    const res: any = await apiFetch("/api/payment/create-order", { method: "POST", token, body: { product_id: product._id, quantity } });
                    const { key_id, data } = { key_id: res.data.key_id, data: res.data } as any;
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
                        } catch {}
                      },
                      prefill: {},
                      theme: { color: "#C026D3" },
                    };
                    // @ts-ignore
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                  } catch (e) {}
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-muted"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
