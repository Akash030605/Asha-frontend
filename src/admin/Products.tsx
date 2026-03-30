import { useEffect, useState } from "react";
import { apiFetch, apiFetchForm, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  public_id?: string | null;
  // Legacy schema (backend might still store a filename)
  image?: string | null;
  isNew?: boolean;
  isSale?: boolean;
  isSold?: boolean;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || undefined;
    apiFetch<{ status: string; data: { products: Product[] } }>("/api/products?limit=100", { token })
      .then((res) => setProducts(res.data.products || []))
      .catch((err: any) => setError(err?.message || "Failed to load products"));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setError(null);
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      await apiFetch(`/api/products/${id}`, { method: "DELETE", token });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err?.message || "Failed to delete product");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Products</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="mb-6 border rounded-lg p-4 bg-card">
        <h3 className="font-semibold mb-3">Add Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <Button onClick={async () => {
            setError(null);
            try {
              const token = localStorage.getItem("admin_token") || undefined;
              if (imageFile) {
                const fd = new FormData();
                fd.append("name", form.name);
                fd.append("price", form.price);
                fd.append("category", form.category);
                fd.append("image", imageFile);
                await apiFetchForm("/api/products", { method: "POST", token, formData: fd });
              } else {
                await apiFetch("/api/products", { method: "POST", token, body: { name: form.name, price: Number(form.price), category: form.category } });
              }
              const res: any = await apiFetch("/api/products?limit=100", { token });
              setProducts(res.data?.products || res.data?.data?.products || []);
              setForm({ name: "", price: "", category: "" });
              setImageFile(null);
            } catch (err: any) {
              setError(err?.message || "Failed to add product");
            }
          }}>Add</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg overflow-hidden bg-card">
            {(p.public_id || p.image) && (
              <img
                src={
                  buildCloudinaryImageUrl(p.public_id) ||
                  (p.image ? buildUploadUrl(p.image) : undefined) ||
                  "/placeholder.svg"
                }
                alt={p.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-xs text-muted-foreground uppercase">{p.category}</p>
              <p className="font-medium">{p.name}</p>
              <p className="text-primary font-semibold">₹{p.price.toLocaleString('en-IN')}</p>
              <div className="mt-3">
                <Button onClick={() => handleDelete(p._id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
