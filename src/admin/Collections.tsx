// src/admin/Collections.tsx
import { useEffect, useState } from "react";
import { apiFetch, apiFetchForm, buildCloudinaryImageUrl, buildUploadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Image as ImageIcon, Upload } from "lucide-react";

interface CollectionItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  public_id?: string | null;
  // Legacy schema (some items may still store just the filename)
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

// Dropdown options
const FABRIC_OPTIONS = [
  "Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Satin", "Velvet", 
  "Banarasi", "Kanjeevaram", "Tussar", "Organza", "Net", "Linen"
];

const WORK_TYPE_OPTIONS = [
  "Zari", "Embroidery", "Print", "Block Print", "Hand Painted", "Stone Work",
  "Mirror Work", "Sequins", "Bead Work", "Aari Work", "Kantha", "Applique"
];

const COLOR_OPTIONS = [
  "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Orange", "Black",
  "White", "Maroon", "Navy", "Gold", "Silver", "Brown", "Grey", "Cream"
];

const STYLE_OPTIONS = [
  "Crop Top", "Full Sleeve", "Half Sleeve", "Sleeveless", "Backless",
  "High Neck", "V Neck", "Round Neck", "Off Shoulder", "Cold Shoulder"
];

const OCCASION_OPTIONS = [
  "Wedding", "Party", "Festival", "Casual", "Formal", "Bridal",
  "Reception", "Cocktail", "Traditional", "Contemporary"
];

const Collection = () => {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Saree");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Saree",
    fabric: "",
    style: "",
    occasion: "",
    work_type: "",
    color: "",
    isNew: false,
    isFeatured: false,
  });

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  const loadItems = async () => {
    try {
      setLoading(true);
      let endpoint = "";
      switch (selectedCategory) {
        case "Saree":
          endpoint = "/api/sarees?limit=100";
          break;
        case "Blouse":
          endpoint = "/api/blouses?limit=100";
          break;
        case "Lehenga":
          endpoint = "/api/lehengas?limit=100";
          break;
      }

      const response = await apiFetch<{ data: any }>(endpoint);
      const itemsKey = selectedCategory.toLowerCase() + "s";
      setItems(response.data?.[itemsKey] || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Saree",
      fabric: "",
      style: "",
      occasion: "",
      work_type: "",
      color: "",
      isNew: false,
      isFeatured: false,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Admin authentication required");
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("isNew", formData.isNew.toString());
      submitData.append("isFeatured", formData.isFeatured.toString());

      // Add category-specific fields
      if (formData.category === "Saree" && formData.fabric) {
        submitData.append("fabric", formData.fabric);
      }
      if (formData.category === "Blouse" && formData.style) {
        submitData.append("style", formData.style);
      }
      if (formData.category === "Lehenga" && formData.occasion) {
        submitData.append("occasion", formData.occasion);
      }
      if (formData.work_type) submitData.append("work_type", formData.work_type);
      if (formData.color) submitData.append("color", formData.color);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let endpoint = "";
      switch (formData.category) {
        case "Saree":
          endpoint = "/api/sarees";
          break;
        case "Blouse":
          endpoint = "/api/blouses";
          break;
        case "Lehenga":
          endpoint = "/api/lehengas";
          break;
      }

      if (editingItem) {
        // Update existing item
        await apiFetchForm(`${endpoint}/${editingItem._id}`, {
          method: "PUT",
          token,
          formData: submitData,
        });
      } else {
        // Create new item
        await apiFetchForm(endpoint, {
          method: "POST",
          token,
          formData: submitData,
        });
      }

      resetForm();
      loadItems();
    } catch (err: any) {
      setError(err?.message || "Failed to save item");
    }
  };

  const handleEdit = (item: CollectionItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category,
      fabric: item.fabric || "",
      style: item.style || "",
      occasion: item.occasion || "",
      work_type: item.work_type || "",
      color: item.color || "",
      isNew: item.isNew,
      isFeatured: item.isFeatured,
    });
    if (item.public_id) {
      setImagePreview(buildCloudinaryImageUrl(item.public_id) || "/placeholder.svg");
    } else if (item.image) {
      setImagePreview(buildUploadUrl(item.image) || "/placeholder.svg");
    } else {
      setImagePreview("/placeholder.svg");
    }
    setShowForm(true);
  };

  const handleDelete = async (item: CollectionItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Admin authentication required");
        return;
      }

      let endpoint = "";
      switch (item.category) {
        case "Saree":
          endpoint = `/api/sarees/${item._id}`;
          break;
        case "Blouse":
          endpoint = `/api/blouses/${item._id}`;
          break;
        case "Lehenga":
          endpoint = `/api/lehengas/${item._id}`;
          break;
      }

      // Use the token in the Authorization header
      await apiFetch(endpoint, {
        method: "DELETE",
        token: token,
      });

      loadItems();
    } catch (err: any) {
      setError(err?.message || "Failed to delete item");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Collection Management</h1>
          <p className="text-muted-foreground">Manage your saree, blouse, and lehenga collections</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Saree">Sarees</SelectItem>
            <SelectItem value="Blouse">Blouses</SelectItem>
            <SelectItem value="Lehenga">Lehengas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saree">Saree</SelectItem>
                      <SelectItem value="Blouse">Blouse</SelectItem>
                      <SelectItem value="Lehenga">Lehenga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter item description"
                    rows={3}
                  />
                </div>

                {/* Category-specific fields */}
                {formData.category === "Saree" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fabric *</label>
                    <Select value={formData.fabric} onValueChange={(value) => setFormData({ ...formData, fabric: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        {FABRIC_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.category === "Blouse" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Style *</label>
                    <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.category === "Lehenga" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Occasion *</label>
                    <Select value={formData.occasion} onValueChange={(value) => setFormData({ ...formData, occasion: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {OCCASION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Work Type</label>
                  <Select value={formData.work_type} onValueChange={(value) => setFormData({ ...formData, work_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Image *</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      required={!editingItem}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 object-cover rounded"
                          />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Flags</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="isNew" className="text-sm">New Arrival</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="isFeatured" className="text-sm">Featured</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-[4/5] bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="aspect-[4/5] relative">
                <img
                  src={
                    item.public_id
                      ? (buildCloudinaryImageUrl(item.public_id) || "/placeholder.svg")
                      : item.image
                      ? (buildUploadUrl(item.image) || "/placeholder.svg")
                      : "/placeholder.svg"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.src.includes("/placeholder.svg")) return;
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.isNew && <Badge className="bg-green-500">New</Badge>}
                  {item.isFeatured && <Badge className="bg-blue-500">Featured</Badge>}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.fabric && <Badge variant="outline">{item.fabric}</Badge>}
                  {item.style && <Badge variant="outline">{item.style}</Badge>}
                  {item.occasion && <Badge variant="outline">{item.occasion}</Badge>}
                  {item.work_type && <Badge variant="outline">{item.work_type}</Badge>}
                  {item.color && <Badge variant="outline">{item.color}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first {selectedCategory.toLowerCase()} to the collection.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default Collection;