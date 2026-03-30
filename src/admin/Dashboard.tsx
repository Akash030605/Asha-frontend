import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";

type DashboardData = {
  stats: {
    total_customers: number;
    total_earnings: number;
    total_orders: number;
    avg_order_value: number;
  };
  graphs: {
    monthly_earnings: { month: string; earnings: number }[];
    order_status_distribution: { status: string; count: number }[];
    monthly_customer_acquisition: { month: string; customers: number }[];
  };
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || undefined;
    apiFetch<{ status: string; data: DashboardData }>("/admin/owner/dashboard", { token })
      .then((res) => setData(res.data))
      .catch((err: any) => setError(err?.message || "Failed to load dashboard"));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      {!data ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-lg border p-6 bg-card">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-semibold">{data.stats.total_customers}</p>
            </div>
            <div className="rounded-lg border p-6 bg-card">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-semibold">{data.stats.total_orders}</p>
            </div>
            <div className="rounded-lg border p-6 bg-card">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-semibold">₹{data.stats.total_earnings.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-lg border p-6 bg-card">
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-semibold">₹{data.stats.avg_order_value.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border p-6 bg-card">
              <h3 className="font-semibold mb-4">Monthly Earnings</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {data.graphs.monthly_earnings.map((m) => (
                  <div key={m.month} className="flex items-center justify-between border rounded p-2">
                    <span className="text-muted-foreground">{m.month}</span>
                    <span>₹{m.earnings.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border p-6 bg-card">
              <h3 className="font-semibold mb-4">Order Status Distribution</h3>
              <ul className="space-y-2 text-sm">
                {data.graphs.order_status_distribution.map((s) => (
                  <li key={s.status} className="flex items-center justify-between border rounded p-2">
                    <span className="capitalize text-muted-foreground">{s.status}</span>
                    <span>{s.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border p-6 bg-card">
            <h3 className="font-semibold mb-4">Monthly Customer Acquisition</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
              {data.graphs.monthly_customer_acquisition.map((m) => (
                <div key={m.month} className="flex items-center justify-between border rounded p-2">
                  <span className="text-muted-foreground">{m.month}</span>
                  <span>{m.customers}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


