import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Work = {
  _id: string;
  work_type: string;
  fixed_amount: number;
  description?: string;
};

const Works = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ work_type: "", fixed_amount: "", description: "" });

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || undefined;
    apiFetch<{ status: string; data: { works: Work[] } }>("/admin/owner/works?limit=50", { token })
      .then((res: any) => {
        const list = res.data?.works || res.data || [];
        setWorks(list);
      })
      .catch((err: any) => setError(err?.message || "Failed to load works"));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Works</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="mb-6 border rounded-lg p-4 bg-card">
        <h3 className="font-semibold mb-3">Add Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Work Type" value={form.work_type} onChange={(e) => setForm({ ...form, work_type: e.target.value })} />
          <Input placeholder="Fixed Amount" value={form.fixed_amount} onChange={(e) => setForm({ ...form, fixed_amount: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button onClick={async () => {
            setError(null);
            try {
              const token = localStorage.getItem("admin_token") || undefined;
              await apiFetch("/admin/owner/works", { method: "POST", token, body: { work_type: form.work_type, fixed_amount: Number(form.fixed_amount), description: form.description } });
              const res: any = await apiFetch("/admin/owner/works?limit=50", { token });
              setWorks(res.data?.works || res.data || []);
              setForm({ work_type: "", fixed_amount: "", description: "" });
            } catch (err: any) {
              setError(err?.message || "Failed to add work");
            }
          }}>Add</Button>
        </div>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search works"
          onChange={async (e) => {
            const q = e.target.value;
            const token = localStorage.getItem("admin_token") || undefined;
            const res: any = await apiFetch(`/admin/owner/works?limit=50&search=${encodeURIComponent(q)}`, { token });
            setWorks(res.data?.works || res.data || []);
          }}
        />
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Work Type</th>
              <th className="text-left p-3">Fixed Amount</th>
              <th className="text-left p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w._id} className="border-t">
                <td className="p-3">{w.work_type}</td>
                <td className="p-3">₹{Number(w.fixed_amount).toLocaleString('en-IN')}</td>
                <td className="p-3">{w.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Works;


