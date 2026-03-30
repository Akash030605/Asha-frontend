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
    <div className="min-h-screen bg-background grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r bg-card">
        <div className="h-16 px-4 flex items-center border-b">
          <Link to="/admin" className="text-lg font-serif font-bold">Admin Panel</Link>
        </div>
        <nav className="p-4 space-y-1 text-sm">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Products</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Users</NavLink>
          <NavLink to="/admin/works" className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Works</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Orders</NavLink>
          <NavLink to="/admin/collections" className={({ isActive }) => isActive ? "block px-3 py-2 rounded-md bg-primary/10 text-primary" : "block px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"}>Collections</NavLink>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={logout}>Logout</Button>
        </div>
      </aside>
      <div className="flex flex-col min-h-screen">
        <header className="md:hidden border-b bg-card">
          <div className="px-4 h-16 flex items-center justify-between">
            <Link to="/admin" className="text-lg font-serif font-bold">Admin</Link>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </header>
        <main className="px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


