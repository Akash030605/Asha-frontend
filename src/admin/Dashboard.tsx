import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/utils";
import { Users, ShoppingBag, IndianRupee, TrendingUp, Loader2 } from "lucide-react";

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
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here is your store's performance.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!data ? (
        <div className="flex-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40 mx-auto" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold mt-4">{data.stats.total_customers}</p>
            </div>
            
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold mt-4">{data.stats.total_orders}</p>
            </div>
            
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <IndianRupee className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold mt-4 text-primary">₹{(data.stats.total_earnings || 0).toLocaleString('en-IN')}</p>
            </div>
            
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold mt-4">₹{(data.stats.avg_order_value || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm">
              <h3 className="font-serif font-semibold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Monthly Earnings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {(data.graphs.monthly_earnings || []).map((m) => (
                  <div key={m.month} className="flex flex-col border border-border/40 rounded-lg p-3 bg-[hsl(30_18%_99%)]">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{m.month}</span>
                    <span className="font-medium">₹{(m.earnings || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm">
              <h3 className="font-serif font-semibold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Order Distribution
              </h3>
              <ul className="space-y-3 text-sm">
                {(data.graphs.order_status_distribution || []).map((s) => (
                  <li key={s.status} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                    <span className="capitalize text-muted-foreground font-medium">{s.status}</span>
                    <span className="font-semibold bg-[hsl(30_14%_97%)] px-3 py-1 rounded-full text-xs">{s.count} orders</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-6 bg-white shadow-sm">
            <h3 className="font-serif font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Customer Acquisition
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
              {(data.graphs.monthly_customer_acquisition || []).map((m) => (
                <div key={m.month} className="flex flex-col border border-border/40 rounded-lg p-3 bg-[hsl(30_18%_99%)]">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{m.month}</span>
                  <span className="font-medium text-lg">{m.customers}</span>
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


