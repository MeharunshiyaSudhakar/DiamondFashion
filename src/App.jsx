import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import ShopDashboard from './pages/ShopDashboard';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

export const AuthContext = createContext();
export const CartContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');

  // Basic authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setWishlist(u.wishlist || []);
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const logout = () => {
    setUser(null);
    setWishlist([]);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    toast.error('Identity session expired. Please re-authenticate.');
  };

  // Global Axios Interceptor for Auth Errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Skip interceptor if it's the login route to allow local error handling
        if (error.config && error.config.url && error.config.url.endsWith('/api/auth/login')) {
          return Promise.reject(error);
        }
        if (error.response && error.response.status === 401) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setWishlist(userData.wishlist || []);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Identity authentication required for Wishlist Access.');
      return;
    }
    try {
      console.log('Toggling Wishlist for Product:', productId);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newWishlist = res.data.wishlist;
      console.log('New Wishlist Synchronized:', newWishlist);
      
      setWishlist(newWishlist);
      const updatedUser = { ...user, wishlist: newWishlist };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const isAdded = newWishlist.includes(productId);
      if (isAdded) {
        toast.success('Piece synchronized with your Secret Wishlist.');
      } else {
        toast('Piece removed from your Secret Wishlist.', { icon: '⚜️' });
      }
    } catch (error) {
      console.error('Wishlist Sync Error:', error);
      toast.error('Wishlist synchronization failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === product._id && item.size === product.size);
      if (exists) {
        return prev.map(item => (item._id === product._id && item.size === product.size) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Piece added to your vault.');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout, wishlist, toggleWishlist }}>
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
          <BrowserRouter>
            <Toaster position="top-center" toastOptions={{
              style: { background: '#556B2F', color: '#FFD700', border: '1px solid #FFD700' }
            }} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/shop" element={<ShopDashboard />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={user ? <WishlistPage /> : <Navigate to="/login" />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
