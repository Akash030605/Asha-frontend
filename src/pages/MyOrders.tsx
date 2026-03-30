import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";

type Order = {
  _id: string;
  product_id: string;
  user_id: string;
  price: number;
  quantity: number;
  date?: string;
  status: string;
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;
    setLoading(true);
    apiFetch<{ status: string; data: Order[] }>("/api/orders", { token })
      .then((res) => setOrders(res.data || []))
      .catch((e) => setError(e?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">My Orders</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-muted-foreground">You have no orders yet.</p>
        )}
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{o._id.slice(-6)}</p>
                <p className="text-sm text-muted-foreground">Status: {o.status}</p>
                {o.date && <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleString()}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(o.price * o.quantity).toLocaleString('en-IN')}</p>
                <p className="text-sm text-muted-foreground">Qty: {o.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;


