import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import RequireAdmin from "./admin/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import SmoothScroll from "./components/SmoothScroll";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Collections = lazy(() => import("./pages/Collections"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SareesCollection = lazy(() => import("./pages/SareeCollections"));
const LehengasCollection = lazy(() => import("./pages/LehengaCollections"));
const BlousesCollection = lazy(() => import("./pages/BlousesCollection"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const MyOrders = lazy(() => import("./pages/MyOrders"));

const Dashboard = lazy(() => import("./admin/Dashboard"));
const Products = lazy(() => import("./admin/Products"));
const Users = lazy(() => import("./admin/Users"));
const Works = lazy(() => import("./admin/Works"));
const Orders = lazy(() => import("./admin/Orders"));
const Collection = lazy(() => import("./admin/Collections"));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScroll>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
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
            <Route path="/collections/sarees" element={<SareesCollection />} />
            <Route path="/collections/lehengas" element={<LehengasCollection />} />
            <Route path="/collections/blouses" element={<BlousesCollection />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </SmoothScroll>
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
