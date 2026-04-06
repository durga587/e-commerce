import { useState, useEffect } from "react";
import { getProductsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsAPI();
        setProducts(res.data);
        setFiltered(res.data);
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [products, search, category, sortBy]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <LoadingSpinner size="lg" text="Reviewing basket..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary-light via-primary to-secondary bg-clip-text text-transparent">
              Farm-To-Table
            </span>{" "}
            Freshness
          </h1>
          <p className="text-text-muted mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Directly from local fields to your family's table. 
            Enjoy the season's best organic and sustainable produce.
          </p>
        </div>

        {/* Search & Filters Refactored for better alignment */}
        <div className="glass rounded-2xl p-4 sm:p-6 mb-8 space-y-6 animate-fade-in-up shadow-xl border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Search Field */}
            <div className="relative lg:col-span-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light text-lg">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for fresh produce, dairy, grains..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-inner"
              />
            </div>

            {/* Sort Field */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort-products" className="text-sm font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Sort By:</label>
              <select
                id="sort-products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 cursor-pointer transition-colors hover:bg-white/10 font-medium"
              >
                <option value="default">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Categories - Horizontal Scroll on Mobile, Flex Wrap on Desktop */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    category === cat
                      ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                      : "bg-white/5 text-text-secondary border-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between mb-6 px-2">
          <p className="text-sm text-text-muted font-medium">
            Found <span className="text-primary-light font-bold">{filtered.length}</span> harvest items
          </p>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No products found</h3>
            <p className="text-text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
