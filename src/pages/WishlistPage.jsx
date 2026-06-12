import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext, CartContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
    const { user, wishlist, toggleWishlist } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlistItems();
    }, [wishlist, user]);

    const fetchWishlistItems = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
            const items = res.data.filter(p => wishlist.includes(p._id));
            setLikedProducts(items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%', flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0', fontWeight: '700', color: 'var(--text-primary)' }}>Wishlist</h2>
                    <p style={{ color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '10px' }}>Your Saved Items</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '100px 0' }}>Loading...</div>
                ) : likedProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                    >
                        <Heart size={60} style={{ color: 'var(--border-color)', marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Your wishlist is empty.</h3>
                        <p style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Save items you like to view them later.</p>
                        <button onClick={() => navigate('/shop')} className="btn-primary" style={{ width: 'auto', padding: '12px 40px' }}>
                            CONTINUE SHOPPING
                        </button>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '30px',
                    }}>
                        <AnimatePresence>
                            {likedProducts.map((product, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={product._id}
                                    className="product-card"
                                >
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{ position: 'relative', height: '350px', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-secondary)' }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.images?.[0] || product.image}`}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div style={{ padding: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '600' }}>{product.name}</h3>
                                        <p style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '1.1rem', fontWeight: '700' }}>₹{product.price}</p>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="btn-secondary"
                                                style={{ flex: 1 }}
                                            >
                                                VIEW PRODUCT
                                            </button>
                                            <button
                                                onClick={() => toggleWishlist(product._id)}
                                                style={{ padding: '10px 15px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' }}
                                                onMouseOver={(e) => e.currentTarget.style.borderColor = '#ff4d4d'}
                                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;
