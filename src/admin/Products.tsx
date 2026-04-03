import { useState } from "react";
import { apiFetch, apiFetchForm, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  public_id?: string | null;
  image?: string | null;
};

const CATEGORIES = [
  "Sarees",
  "Lehengas",
  "Blouses",
  "Gowns",
  "Bridal",
  "Suits",
  "Kurtas"
];

const Products = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Automatic caching with react-query
  const { data: products = [], isLoading: fetching, error: queryError } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token") || undefined;
      const res = await apiFetch<{ status: string; data: { products: Product[] } }>(
        "/api/products?limit=100", 
        { token }
      );
      return res.data?.products || [];
    }
  });

  const error = actionError || queryError?.message;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionError(null);
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      await apiFetch(`/api/products/${id}`, { method: "DELETE", token });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    } catch (err: any) {
      setActionError(err?.message || "Failed to delete product");
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.category) {
      setActionError("Please fill in all details");
      return;
    }
    setActionError(null);
    setActionLoading(true);
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
        await apiFetch("/api/products", { 
          method: "POST", 
          token, 
          body: { name: form.name, price: Number(form.price), category: form.category } 
        });
      }
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setForm({ name: "", price: "", category: "" });
      setImageFile(null);
    } catch (err: any) {
      setActionError(err?.message || "Failed to add product");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground tracking-tight">Products Data</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your boutique's inventory and collections.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Add Product Flow */}
      <div className="mb-10 bg-white border border-border/60 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Add New Product</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">Product Name</label>
            <Input 
              placeholder="e.g. Ivory Silk Gown" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              className="bg-[hsl(30_18%_99%)] focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">Price (₹)</label>
            <Input 
              type="number"
              placeholder="0.00" 
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: e.target.value })} 
              className="bg-[hsl(30_18%_99%)] focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <Select 
              value={form.category} 
              onValueChange={(val) => setForm({ ...form, category: val })}
            >
              <SelectTrigger className="bg-[hsl(30_18%_99%)] focus-visible:ring-primary">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-muted-foreground">Image</label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
              className="bg-[hsl(30_18%_99%)] file:text-primary file:font-medium cursor-pointer"
            />
          </div>
          
          <div className="md:col-span-1">
            <Button 
              onClick={handleAddProduct} 
              disabled={actionLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Product"}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {fetching ? (
        <div className="flex-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40 mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border/60 rounded-xl border-dashed">
          <p className="text-muted-foreground">No products added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="group bg-white border border-border/60 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/5] bg-[hsl(30_14%_97%)] relative overflow-hidden">
                <img
                  src={
                    buildCloudinaryImageUrl(p.public_id) ||
                    (p.image ? buildUploadUrl(p.image) : undefined) ||
                    "/placeholder.svg"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="p-4 md:p-5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-sans text-secondary font-medium tracking-[0.1em] uppercase">
                    {p.category}
                  </p>
                </div>
                
                <h4 className="font-serif font-bold text-foreground leading-tight line-clamp-1">
                  {p.name}
                </h4>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-primary font-bold">
                    ₹{p.price.toLocaleString('en-IN')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
