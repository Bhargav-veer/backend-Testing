import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js"; // Verifies Firebase token

const cartRouter = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get the logged-in user's cart
 * @access  Private (Firebase Auth)
 */
cartRouter.get("/", authUser, getUserCart);

/**
 * @route   POST /api/cart
 * @desc    Add an item to the cart
 * @access  Private (Firebase Auth)
 */
cartRouter.post("/", authUser, addToCart);

/**
 * @route   PATCH /api/cart
 * @desc    Update the entire cart or specific items
 * @access  Private (Firebase Auth)
 */
cartRouter.patch("/", authUser, updateCart);

export default cartRouter;
export const useShopContext = () => {
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await getFirebaseToken();
        await loadCartFromBackend(token);
      } else {
        loadCartFromLocalStorage();
      }
    });
    return () => unsubscribe();
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => ({
      ...prev,
      [item.id]: { ...item, quantity: (prev[item.id]?.quantity || 0) + 1 },
    }));
    if (user) saveCartToBackend({ ...cartItems, [item.id]: item }, user.token);
    else saveCartToLocalStorage({ ...cartItems, [item.id]: item });
  };

  // Update cart items
  const updateCart = (items) => {
    setCartItems(items);
    if (user) saveCartToBackend(items, user.token);
    else saveCartToLocalStorage(items);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
    if (user) saveCartToBackend(cartItems, user.token);
    else saveCartToLocalStorage(cartItems);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems({});
    if (user) saveCartToBackend({}, user.token);
    else localStorage.removeItem("cartItems");
  };

  return {
    cartItems,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    user,
  };
};