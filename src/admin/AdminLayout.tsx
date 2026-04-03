import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin-login");
  }
  return (
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-[260px_1fr]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col border-r border-border bg-white shadow-sm z-10">
        <div className="h-20 px-8 flex items-center border-b border-border">
          <Link to="/admin" className="flex items-baseline gap-1.5 flex-shrink-0">
            <span className="font-serif text-2xl font-bold tracking-tight leading-none text-primary">
              Asha
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase text-secondary">
              Admin
            </span>
          </Link>
        </div>
        <nav className="p-6 space-y-2 flex-1">
          {[
            { to: "/admin", label: "Dashboard" },
            { to: "/admin/products", label: "Products" },
            { to: "/admin/users", label: "Users" },
            { to: "/admin/works", label: "Works" },
            { to: "/admin/orders", label: "Orders" },
            { to: "/admin/collections", label: "Collections" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/5 text-primary border border-primary/20 shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-border">
          <Button variant="outline" className="w-full border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={logout}>
            Logout Securely
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-border bg-white shadow-sm z-10">
          <div className="px-5 h-16 flex items-center justify-between">
            <Link to="/admin" className="flex items-baseline gap-1.5 flex-shrink-0">
              <span className="font-serif text-xl font-bold tracking-tight leading-none text-primary">
                Asha
              </span>
              <span className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase text-secondary">
                Admin
              </span>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[hsl(30_18%_99%)]">
          <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


