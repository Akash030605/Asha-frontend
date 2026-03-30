import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const user = useMemo(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem("auth_user") || "null"); } catch { return null; }
  }, []);

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      navigate("/login");
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-primary">
              Asha Boutique
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/collections" className="text-sm font-medium hover:text-primary transition-colors">
              Collections
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            {token && user ? (
              <div className="relative group">
                <Button variant="ghost" className="hover:text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="max-w-[140px] truncate">{user.full_name || user.email || "Account"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-md hidden group-hover:block">
                  <Link to="/my-orders" className="block px-3 py-2 text-sm hover:bg-muted">My Orders</Link>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="py-4 space-y-4">
              <Link 
                to="/" 
                className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/collections" 
                className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth Links */}
              <div className="border-t border-border pt-4 mt-4">
                {token && user ? (
                  <>
                    <div className="px-4 py-2 text-sm">Hello, {user.full_name || user.email}</div>
                    <Link 
                      to="/my-orders" 
                      className="flex items-center px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Orders
                    </Link>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Login / Register
                  </Link>
                )}
                <Link 
                  to="/cart" 
                  className="flex items-center px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4 mr-3" />
                  Shopping Cart
                </Link>
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm font-medium hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-3" />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;