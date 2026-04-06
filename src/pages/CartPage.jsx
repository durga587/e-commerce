import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const CartPage = () => {
  const { cart, loading, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <LoadingSpinner size="lg" text="Reviewing basket..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">My Harvest Basket</h1>
            <p className="text-text-muted mt-1 font-medium">{cart.length} fresh item{cart.length !== 1 ? "s" : ""} selected</p>
          </div>
          <Link to="/dashboard" className="text-sm font-bold text-primary-light hover:text-primary transition-colors flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Marketplace
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="glass rounded-2xl p-12 text-center animate-fade-in-up">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Your basket is empty</h2>
            <p className="text-text-muted mb-6">Explore the fresh harvests from our local farmers.</p>
            <Link
              to="/dashboard"
              className="inline-block px-10 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all shadow-lg"
            >
              Explore Farm Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`glass rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 animate-fade-in-up stagger-${Math.min(index + 1, 8)} group hover:border-primary/20 transition-all shadow-md`}
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-light/30 border border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/product/${item.id}`} className="font-bold text-text-primary hover:text-primary-light transition line-clamp-1">
                          {item.name}
                        </Link>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-light mt-1">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.name)}
                        className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all shrink-0"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-black bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-mono">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-text-muted text-[10px] font-bold uppercase tracking-wide">₹{item.price.toLocaleString()} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-2xl p-6 sticky top-24 animate-slide-in-right shadow-2xl border border-white/5">
                <h3 className="text-lg font-black text-text-primary mb-6 uppercase tracking-tighter">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-text-muted font-medium italic">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-mono text-text-secondary">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted font-medium italic">
                    <span>Delivery Fee</span>
                    <span className="text-primary-light font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted font-medium italic border-b border-white/5 pb-4">
                    <span>Market Fee (8%)</span>
                    <span className="font-mono text-text-secondary">₹{(cartTotal * 0.08).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-extrabold text-text-primary uppercase tracking-tighter text-sm">Grand Total</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-mono">
                      ₹{(cartTotal * 1.08).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  to="/order"
                  id="checkout-btn"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-black text-center hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all duration-300 active:scale-[0.98] shadow-lg text-lg"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-text-muted text-[10px] uppercase font-bold tracking-widest bg-white/5 py-2 rounded-lg">
                  <span>🔒 Secure Harvest Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
