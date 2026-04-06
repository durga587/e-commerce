import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrderAPI } from "../services/api";
import toast from "react-hot-toast";

const OrderPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    address: user?.address || "", city: "", state: "", zip: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
      toast.error("Please fill in all required fields"); return;
    }
    if (cart.length === 0) { toast.error("Your basket is empty"); return; }
    setLoading(true);
    try {
      const res = await placeOrderAPI({ items: cart, total: cartTotal * 1.08, shippingDetails: form });
      setOrderId(res.data.orderId);
      setOrderPlaced(true);
      await clearCart();
      toast.success("Harvest confirmed successfully! 🚜", { duration: 5000 });
    } catch { toast.error("Failed to process order"); } finally { setLoading(false); }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="glass-strong rounded-3xl p-10 shadow-2xl border border-white/10">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 glow-success border border-success/30">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tighter">Harvest Confirmed!</h1>
            <p className="text-text-muted mb-8 font-medium">Your fresh farm produce is on its way to you.</p>
            <div className="glass bg-primary/5 rounded-2xl p-6 mb-8 text-left space-y-4 border border-primary/20">
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3"><span className="text-text-muted uppercase font-bold tracking-widest">Order ID</span><span className="text-primary-light font-mono font-black">{orderId}</span></div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3"><span className="text-text-muted uppercase font-bold tracking-widest">Payment</span><span className="text-text-secondary font-black">Cash on Delivery</span></div>
              <div className="flex justify-between items-center text-sm pt-1"><span className="text-text-muted uppercase font-bold tracking-widest">Total Paid</span><span className="text-primary-light font-black font-mono text-xl">₹{(cartTotal * 1.08).toLocaleString()}</span></div>
            </div>
            <button onClick={() => navigate("/dashboard")} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-black hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all active:scale-[0.98] shadow-lg text-lg">Continue Harvesting</button>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm";

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-40 pb-20 px-4 flex items-center justify-center">
        <div className="glass rounded-3xl p-12 text-center animate-fade-in-up border border-white/5 shadow-2xl">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-2xl font-black text-text-primary mb-2 uppercase tracking-tighter">The basket is empty</h2>
          <p className="text-text-muted mb-8 italic">Pick something fresh from our farm store first.</p>
          <button onClick={() => navigate("/dashboard")} className="px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-black hover:shadow-lg transition-all shadow-lg text-lg">Browse Farm Store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-text-primary mb-10 animate-fade-in-up tracking-tighter uppercase">Confirm Harvest Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 animate-fade-in-up">
            <form onSubmit={handleSubmit} id="order-form">
              <div className="glass-strong rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl border border-white/5">
                <h2 className="text-xl font-black text-text-primary border-b border-white/5 pb-4 uppercase tracking-tighter">📦 Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Full Name *</label><input name="fullName" value={form.fullName} onChange={handleChange} className={inputCls} placeholder="John Doe" /></div>
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Email Address *</label><input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="john@farmfresh.com" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Phone Number *</label><input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 98765 43210" /></div>
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Village / City *</label><input name="city" value={form.city} onChange={handleChange} className={inputCls} placeholder="Pune" /></div>
                </div>
                <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">Full Street Address *</label><input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="123 Farm Lane, Near Market" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">State *</label><input name="state" value={form.state} onChange={handleChange} className={inputCls} placeholder="Maharashtra" /></div>
                  <div><label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">PIN Code *</label><input name="zip" value={form.zip} onChange={handleChange} className={inputCls} placeholder="411001" /></div>
                </div>
              </div>

              <div className="glass-strong rounded-3xl p-6 sm:p-10 mt-8 shadow-2xl border border-white/5">
                <h2 className="text-xl font-black text-text-primary mb-6 uppercase tracking-tighter">💳 Payment Method</h2>
                <div className="glass rounded-2xl p-5 border-2 border-primary/50 bg-primary/10 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-3xl shadow-inner shadow-primary/30">💵</div>
                  <div>
                    <p className="font-black text-text-primary text-lg">Cash on Delivery</p>
                    <p className="text-text-muted text-xs font-medium italic">Pay in cash when you receive your farm fresh harvest.</p>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"><div className="w-2.5 h-2.5 rounded-full bg-white" /></div>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-strong rounded-3xl p-8 sticky top-24 animate-slide-in-right shadow-2xl border border-white/5">
              <h3 className="text-xl font-black text-text-primary mb-8 border-b border-white/5 pb-4 uppercase tracking-tighter">Harvest Order</h3>
              <div className="space-y-5 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-light/30 shrink-0 border border-white/5"><img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-black font-mono text-text-secondary">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-white/10 mb-6" />
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-medium italic text-text-muted"><span>Harvest Subtotal</span><span className="font-mono">₹{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-medium italic text-text-muted"><span>Delivery Fee</span><span className="text-primary-light font-bold">FREE</span></div>
                <div className="flex justify-between text-sm font-medium italic text-text-muted border-b border-white/5 pb-4"><span>Market Access (8%)</span><span className="font-mono">₹{(cartTotal * 0.08).toLocaleString()}</span></div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-black text-text-primary uppercase tracking-tighter text-sm">Grand Total</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-mono tracking-tighter">₹{(cartTotal * 1.08).toLocaleString()}</span>
                </div>
              </div>
              <button type="submit" form="order-form" disabled={loading} id="place-order-btn" className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-black hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all active:scale-[0.98] shadow-lg disabled:opacity-60 flex items-center justify-center gap-3 text-lg lowercase tracking-tighter">
                {loading ? <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />Processing...</> : "🧺 confirm order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
