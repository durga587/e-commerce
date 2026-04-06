import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="glass rounded-2xl group overflow-hidden flex flex-col h-full hover:border-primary/40 transition-all duration-300 stagger-1 shadow-lg hover:shadow-primary/10">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-dark/80 text-white backdrop-blur-md border border-white/10">
            {product.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border backdrop-blur-md ${
            product.stock > 10 ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"
          }`}>
            {product.stock > 10 ? "In Stock" : "Limited Stock"}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-text-primary group-hover:text-primary-light transition-colors line-clamp-1 h-6">
            {product.name}
          </h3>
        </Link>
        <p className="text-text-muted text-sm mt-2 line-clamp-2 min-h-[40px]">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1 bg-white/5 py-1 px-2 rounded-lg border border-white/5">
            <span className="text-secondary text-sm">★</span>
            <span className="text-sm font-bold text-text-primary">{product.rating}</span>
          </div>
          <span className="text-text-muted text-[11px] uppercase tracking-wider font-semibold">({product.reviews.toLocaleString()} reviews)</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Price</span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent font-mono">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="px-5 py-2.5 rounded-xl bg-primary/20 text-primary-light text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 shadow-lg border border-primary/20"
          >
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
