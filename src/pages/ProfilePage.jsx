import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfileAPI, updateProfileAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfileAPI();
        setProfile(res.data);
        setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || "", address: res.data.address || "" });
      } catch {
        if (user) {
          setProfile(user);
          setForm({ name: user.name, email: user.email, phone: user.phone || "", address: user.address || "" });
        }
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    setSaving(true);
    try {
      const res = await updateProfileAPI(form);
      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      toast.success("Profile harvest updated! ✨", { duration: 3000 });
    } catch { toast.error("Failed to update profile"); } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size="xl" text="Loading profile..." />
      </div>
    );
  }

  const inputCls = "w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm shadow-inner";
  const readOnlyValueCls = "text-lg font-black text-white tracking-tight break-words";
  const labelCls = "text-[10px] font-black uppercase tracking-[0.2em] text-primary-light mb-2 block";

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section with Profile Initial */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in-up">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_40px_rgba(22,163,74,0.3)] text-6xl font-black text-white border-4 border-white/10 uppercase tracking-tighter shrink-0 ring-4 ring-primary/20">
            {profile?.name?.charAt(0) || "U"}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
              {profile?.name}
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">Verified Harvest Partner</span>
            </div>
          </div>
        </div>

        {/* Identity Information Card */}
        <div className="glass-strong rounded-[2rem] p-8 sm:p-12 animate-fade-in-up border border-white/10 shadow-2xl shadow-black/50 overflow-hidden relative" style={{ animationDelay: "0.1s" }}>
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Market Identity</h2>
              <p className="text-xs text-text-muted mt-1 font-medium">Your personal details in the FarmFresh ecosystem</p>
            </div>
            {!editing && (
              <button 
                onClick={() => setEditing(true)} 
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl active:scale-95 group flex items-center gap-2"
              >
                <span>✏️</span> EDIT PROFILE
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Full Name */}
              <div className="space-y-1">
                <label className={labelCls}>Legal Full Name</label>
                {editing ? (
                  <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Full Name" />
                ) : (
                  <p className={readOnlyValueCls}>{profile?.name || "No name set"}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className={labelCls}>Verified Email</label>
                {editing ? (
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="Email" />
                ) : (
                  <p className={readOnlyValueCls}>{profile?.email || "No email set"}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className={labelCls}>Contact Number</label>
                {editing ? (
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+91 XXXXX XXXXX" />
                ) : (
                  <p className={readOnlyValueCls}>{profile?.phone || "Phone not verified"}</p>
                )}
              </div>

              {/* Member Since (Logic placeholder) */}
              <div className="space-y-1">
                <label className={labelCls}>Partnership Status</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tracking-tight">Active Since Oct 2023</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 pt-4 border-t border-white/5">
              <label className={labelCls}>Primary Delivery Address</label>
              {editing ? (
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  rows="3"
                  className={`${inputCls} resize-none`} 
                  placeholder="Street, Landmark, City, State, PIN" 
                />
              ) : (
                <p className={`${readOnlyValueCls} leading-relaxed max-w-xl`}>
                  {profile?.address || "Address not provided yet. Please update for easier deliveries."}
                </p>
              )}
            </div>

            {editing && (
              <div className="grid grid-cols-2 gap-6 pt-6">
                <button type="submit" disabled={saving} className="py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-black hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3 text-lg shadow-xl uppercase tracking-tighter">
                  {saving ? <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />SAVING...</> : "📦 CONFIRM CHANGES"}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email, phone: profile.phone || "", address: profile.address || "" }); }} 
                  className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest shadow-xl flex items-center justify-center text-sm"
                >
                  CANCEL
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Global Marketplace Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {[
            { icon: "📦", label: "Harvest Deliveries", value: "12" },
            { icon: "🧺", label: "Active Basket", value: JSON.parse(localStorage.getItem("cart") || "[]").length.toString() },
            { icon: "🚜", label: "Local Impact", value: "4.8" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-[2rem] p-8 text-center border border-white/10 shadow-2xl hover:bg-white/5 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500 inline-block">{stat.icon}</div>
              <div className="text-3xl font-black text-white font-mono tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-black text-primary-light uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
