import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Collections from "./pages/Collections";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SareesCollection from "./pages/SareeCollections";
import AdminLogin from "./pages/AdminLogin";
import RequireAdmin from "./admin/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Users from "./admin/Users";
import Works from "./admin/Works";
import Orders from "./admin/Orders";
import Collection from "./admin/Collections";
import MyOrders from "./pages/MyOrders";
import LehengasCollection from "./pages/LehengaCollections";
import BlousesCollection from "./pages/BlousesCollection";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route element={<RequireAuth />}>
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="users" element={<Users />} />
              <Route path="works" element={<Works />} />
              <Route path="orders" element={<Orders />} />
              <Route path="collections" element={<Collection />} />
            </Route>
          </Route>
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          // In your App.tsx or router configuration
          <Route path="/collections/sarees" element={<SareesCollection />} />
          <Route path="/collections/lehengas" element={<LehengasCollection />} />
          <Route path="/collections/blouses" element={<BlousesCollection />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

function RequireAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
