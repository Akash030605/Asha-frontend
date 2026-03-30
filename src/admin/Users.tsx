import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";

type User = {
  _id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  measurements?: {
    shoulder?: string;
    full_length?: string;
    upper_chest?: string;
    chest?: string;
    waist?: string;
    neck_front?: string;
    neck_back?: string;
    tuck_point?: string;
    arm_hole?: string;
    sleeve_length?: string;
    sl_round?: string;
    hip?: string;
    bottom_ghera?: string;
    bottom?: string;
  };
};

const measurementFields = [
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'full_length', label: 'Full Length' },
  { key: 'upper_chest', label: 'Upper Chest' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'neck_front', label: 'Neck Front' },
  { key: 'neck_back', label: 'Neck Back' },
  { key: 'tuck_point', label: 'Tuck Point' },
  { key: 'arm_hole', label: 'Arm Hole' },
  { key: 'sleeve_length', label: 'Sleeve Length' },
  { key: 'sl_round', label: 'Sleeve Round' },
  { key: 'hip', label: 'Hip' },
  { key: 'bottom_ghera', label: 'Bottom Ghera' },
  { key: 'bottom', label: 'Bottom' }
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    full_name: "", 
    phone_number: "",
    measurements: {} as Record<string, string>
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editMeasurements, setEditMeasurements] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search = "") => {
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      const res: any = await apiFetch(`/admin/owner/users?limit=50&search=${encodeURIComponent(search)}`, { token });
      const list = res.data?.users || res.data || [];
      setUsers(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    }
  };

  const handleAddUser = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      await apiFetch("/admin/owner/users", { 
        method: "POST", 
        token, 
        body: { 
          full_name: form.full_name, 
          phone_number: form.phone_number, 
          measurements: form.measurements 
        } 
      });
      await loadUsers();
      setForm({ full_name: "", phone_number: "", measurements: {} });
    } catch (err: any) {
      setError(err?.message || "Failed to add user");
    }
  };

  const handleUpdateMeasurements = async (userId: string) => {
    setError(null);
    try {
      const token = localStorage.getItem("admin_token") || undefined;
      await apiFetch(`/admin/owner/users/${userId}`, { 
        method: "PUT", 
        token, 
        body: { 
          measurements: editMeasurements 
        } 
      });
      await loadUsers();
      setEditingUser(null);
      setEditMeasurements({});
    } catch (err: any) {
      setError(err?.message || "Failed to update measurements");
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditMeasurements(user.measurements || {});
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-bold mb-6">Users</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add User Form */}
      <div className="mb-6 border rounded-lg p-4 bg-card">
        <h3 className="font-semibold mb-3">Add User</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Input 
            placeholder="Full Name" 
            value={form.full_name} 
            onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
          />
          <Input 
            placeholder="Phone Number" 
            value={form.phone_number} 
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })} 
          />
          <Button onClick={handleAddUser}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Measurements Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {measurementFields.map((field) => (
            <div key={field.key}>
              <label className="text-xs text-muted-foreground mb-1 block">
                {field.label}
              </label>
              <Input
                placeholder={field.label}
                value={form.measurements[field.key] || ""}
                onChange={(e) => setForm({
                  ...form,
                  measurements: {
                    ...form.measurements,
                    [field.key]: e.target.value
                  }
                })}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by name or phone"
          onChange={async (e) => {
            await loadUsers(e.target.value);
          }}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Measurements</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-muted/25">
                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.phone_number}</td>
                <td className="p-3">{user.email || "-"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {user.measurements && Object.entries(user.measurements).map(([key, value]) => (
                      value && (
                        <span 
                          key={key} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {measurementFields.find(f => f.key === key)?.label}: {value}
                        </span>
                      )
                    ))}
                    {(!user.measurements || Object.keys(user.measurements).length === 0) && (
                      <span className="text-muted-foreground text-xs">No measurements</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Measurements - {user.full_name}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                        {measurementFields.map((field) => (
                          <div key={field.key}>
                            <label className="text-sm font-medium mb-2 block">
                              {field.label}
                            </label>
                            <Input
                              value={editMeasurements[field.key] || ""}
                              onChange={(e) => setEditMeasurements({
                                ...editMeasurements,
                                [field.key]: e.target.value
                              })}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingUser(null);
                            setEditMeasurements({});
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleUpdateMeasurements(user._id)}
                        >
                          Update Measurements
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;