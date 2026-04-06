import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", label: "Harvest", icon: "🌿" },
    { to: "/cart", label: "Basket", icon: "🧺", badge: cartCount },
    { to: "/profile", label: "Market Profile", icon: "👨‍🌾" },
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-strong rounded-2xl px-6 py-4 shadow-2xl border border-white/10 pointer-events-auto">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
            F
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent hidden sm:block uppercase tracking-tighter">
            FarmFresh
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 border uppercase tracking-widest ${
                isActive(link.to)
                  ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                  : "text-text-secondary border-transparent hover:bg-white/5 hover:border-white/10"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
              {link.badge > 0 && (
                <span className="bg-white text-primary px-2 py-0.5 rounded-lg text-[10px] font-black font-mono">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User / Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Active Buyer</span>
            <span className="text-sm font-bold text-text-primary capitalize">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl border border-danger/30 text-danger text-xs font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all shadow-lg active:scale-95"
          >
            Offline
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
