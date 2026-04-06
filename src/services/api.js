// ===== MOCK API LAYER =====
// Simulates backend API calls with Promise + setTimeout

const DELAY = 600;

// ===== Mock Product Data — Farm-to-Customer =====
const PRODUCTS = [
  {
    id: 1,
    name: "Organic Vegetable Basket",
    price: 499,
    description: "A curated basket of seasonal organic vegetables — tomatoes, bell peppers, spinach, carrots & more. Harvested fresh from our farms every morning, pesticide-free.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop",
    category: "Fresh Produce",
    rating: 4.9,
    reviews: 3210,
    stock: 40,
  },
  {
    id: 2,
    name: "Farm-Fresh Free-Range Eggs",
    price: 120,
    description: "One dozen free-range eggs from pasture-raised hens. Rich golden yolks, packed with omega-3s. No antibiotics, no hormones — just honest farm nutrition.",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop",
    category: "Dairy & Eggs",
    rating: 4.8,
    reviews: 2845,
    stock: 60,
  },
  {
    id: 3,
    name: "Raw Wildflower Honey",
    price: 350,
    description: "Pure unfiltered wildflower honey from our apiaries. Cold-extracted to preserve enzymes and natural pollen. Perfect for tea, toast, or cooking.",
    image: "https://images.unsplash.com/photo-1471943311424-646960669fba?w=600&h=600&fit=crop",
    category: "Honey & Preserves",
    rating: 4.7,
    reviews: 1567,
    stock: 25,
  },
  {
    id: 4,
    name: "Stone-Ground Whole Wheat Flour",
    price: 180,
    description: "5 lb bag of heritage whole wheat flour, stone-ground from locally grown grains. Retains all natural bran and germ for wholesome, nutrient-rich baking.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop",
    category: "Grains & Flour",
    rating: 4.5,
    reviews: 987,
    stock: 55,
  },
  {
    id: 5,
    name: "Cold-Pressed Virgin Coconut Oil",
    price: 450,
    description: "Premium cold-pressed virgin coconut oil from organic coconut farms. Ideal for cooking, skincare, and hair care. Unrefined with natural aroma.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&h=600&fit=crop",
    category: "Oils & Ghee",
    rating: 4.6,
    reviews: 1243,
    stock: 35,
  },
  {
    id: 6,
    name: "Fresh Herb Garden Box",
    price: 299,
    description: "Living herb box with basil, mint, cilantro, and rosemary. Grown without pesticides in our greenhouse. Snip fresh herbs straight onto your plate.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=600&fit=crop",
    category: "Herbs & Spices",
    rating: 4.4,
    reviews: 876,
    stock: 18,
  },
  {
    id: 7,
    name: "Artisan Sourdough Bread",
    price: 220,
    description: "Handcrafted sourdough bread made with wild yeast and organic flour. Slow-fermented for 48 hours for a crispy crust and soft, tangy crumb.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
    category: "Bakery",
    rating: 4.9,
    reviews: 4102,
    stock: 8,
  },
  {
    id: 8,
    name: "Farm Paneer (Cottage Cheese)",
    price: 150,
    description: "Fresh handmade paneer from pure cow milk. Soft, creamy texture with no preservatives. Perfect for curries, tikka, and salads. Made daily.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=600&fit=crop",
    category: "Dairy & Eggs",
    rating: 4.7,
    reviews: 2034,
    stock: 22,
  },
];

// ===== Mock Users =====
let USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "+1 234 567 8900",
    address: "123 Main Street, New York, NY 10001",
  },
];

// ===== Helper: simulate network delay =====
const delay = (ms = DELAY) => new Promise((res) => setTimeout(res, ms));

// ===== AUTH APIs =====
export const loginAPI = async (email, password) => {
  await delay();
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw { response: { data: { message: "Invalid email or password" } } };
  }
  const token = "mock_jwt_" + btoa(JSON.stringify({ id: user.id, email: user.email })) + "_" + Date.now();
  return {
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    },
  };
};

export const registerAPI = async (name, email, password) => {
  await delay();
  if (USERS.find((u) => u.email === email)) {
    throw { response: { data: { message: "Email already registered" } } };
  }
  const newUser = {
    id: USERS.length + 1,
    name,
    email,
    password,
    phone: "",
    address: "",
  };
  USERS.push(newUser);
  const token = "mock_jwt_" + btoa(JSON.stringify({ id: newUser.id, email: newUser.email })) + "_" + Date.now();
  return {
    data: {
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, address: newUser.address },
    },
  };
};

// ===== PRODUCT APIs =====
export const getProductsAPI = async () => {
  await delay();
  return { data: PRODUCTS };
};

export const getProductByIdAPI = async (id) => {
  await delay(400);
  const product = PRODUCTS.find((p) => p.id === parseInt(id));
  if (!product) {
    throw { response: { data: { message: "Product not found" } } };
  }
  return { data: product };
};

// ===== CART APIs =====
export const getCartAPI = async () => {
  await delay(300);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return { data: cart };
};

export const addToCartAPI = async (product, quantity = 1) => {
  await delay(300);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  return { data: cart };
};

export const removeFromCartAPI = async (productId) => {
  await delay(300);
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  return { data: cart };
};

export const updateCartQuantityAPI = async (productId, quantity) => {
  await delay(200);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  return { data: cart };
};

export const clearCartAPI = async () => {
  await delay(200);
  localStorage.setItem("cart", JSON.stringify([]));
  return { data: [] };
};

// ===== ORDER APIs =====
export const placeOrderAPI = async (orderDetails) => {
  await delay(800);
  const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
  return {
    data: {
      orderId,
      ...orderDetails,
      status: "confirmed",
      paymentMethod: "Cash on Delivery",
      date: new Date().toISOString(),
    },
  };
};

// ===== USER PROFILE APIs =====
export const getProfileAPI = async () => {
  await delay(400);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) throw { response: { data: { message: "Not authenticated" } } };
  return { data: user };
};

export const updateProfileAPI = async (profileData) => {
  await delay(500);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) throw { response: { data: { message: "Not authenticated" } } };
  const updated = { ...user, ...profileData };
  localStorage.setItem("user", JSON.stringify(updated));
  // Also update in USERS array
  const idx = USERS.findIndex((u) => u.id === updated.id);
  if (idx !== -1) USERS[idx] = { ...USERS[idx], ...profileData };
  return { data: updated };
};
