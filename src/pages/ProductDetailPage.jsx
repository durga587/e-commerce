import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductByIdAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdAPI(id);
        setProduct(res.data);
      } catch {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="xl" text="Harvesting product info..." />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0a150a]">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb - Higher Z and Padding */}
        <nav className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-text-muted mb-12 animate-fade-in-up">
          <Link to="/dashboard" className="hover:text-primary transition-colors hover:scale-105 inline-block">Farm Store</Link>
          <span className="text-white/20">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Main Product Image Container */}
          <div className="animate-fade-in-up">
            <div className="glass rounded-[2rem] overflow-hidden aspect-square relative shadow-2xl border border-white/5 ring-4 ring-primary/5">
              {!imageLoaded && <div className="absolute inset-0 skeleton" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              />
              <span className="absolute top-6 left-6 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary/80 text-white backdrop-blur-md shadow-lg">
                {product.category}
              </span>
            </div>
          </div>

          {/* Detailed Info Column */}
          <div className="animate-slide-in-right space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-none uppercase tracking-tighter">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-secondary text-lg">★</span>
                  <span className="text-lg font-black text-white font-mono">{product.rating}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Authenticated Reviews</span>
                  <span className="text-xs font-bold text-text-secondary uppercase">{product.reviews.toLocaleString()} global ratings</span>
                </div>
              </div>
            </div>

            {/* Premium Pricing Grid */}
            <div className="flex flex-wrap items-center gap-6 p-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Exclusive Offer Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-mono tracking-tighter">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-text-muted line-through text-xl font-mono">₹{(product.price * 1.3).toFixed(0)}</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-success/20 border border-success/30">
                <span className="text-[10px] font-black text-success uppercase tracking-widest">SAVE 23% TODAY</span>
              </div>
            </div>

            <div className="h-px bg-white/10 w-24" />

            {/* Description Card */}
            <p className="text-lg font-medium text-text-secondary leading-relaxed max-w-xl italic">
              "{product.description}"
            </p>

            {/* Availability Badge */}
            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner max-w-sm">
              <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? "bg-primary" : "bg-warning"} animate-pulse shadow-[0_0_15px_rgba(22,163,74,0.5)]`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Availability</span>
                <span className="text-sm font-black text-white uppercase tracking-tighter">
                  {product.stock > 10 ? "Available Now" : `Fresh Stock Low — ${product.stock} units left`}
                </span>
              </div>
            </div>

            {/* Quantity Controls - Clean Refactor */}
            <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em] block">Quantity selection</label>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary-dark transition-all duration-300 flex items-center justify-center text-2xl font-black shadow-lg shadow-black/50 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-3xl font-black text-white font-mono tracking-tighter">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary-dark transition-all duration-300 flex items-center justify-center text-2xl font-black shadow-lg shadow-black/50 active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="sm:text-right pt-6 sm:pt-0 border-t sm:border-t-0 border-white/10 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Basket Subtotal</span>
                  <span className="text-4xl font-black text-white font-mono tracking-tighter">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Refined */}
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-black text-xl hover:shadow-[0_0_40px_rgba(22,163,74,0.5)] transition-all duration-300 active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 uppercase tracking-tighter ring-2 ring-white/5"
              >
                🌾 Secure Fresh Harvest
              </button>
              <Link
                to="/cart"
                className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 font-black text-sm text-center uppercase tracking-widest shadow-xl flex items-center justify-center"
              >
                Go to Basket
              </Link>
            </div>

            {/* Feature Badges - Agricultural Context */}
            <div className="grid grid-cols-3 gap-5 pt-8">
              {[
                { icon: "🌾", label: "Fresh Harvest" },
                { icon: "🚚", label: "Direct Delivery" },
                { icon: "🤝", label: "Market Access" },
              ].map((f) => (
                <div key={f.label} className="glass py-6 px-2 text-center transition-all duration-500 hover:-translate-y-2 border border-white/5 shadow-2xl group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-500">{f.icon}</div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
