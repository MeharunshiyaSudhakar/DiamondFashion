import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext, CartContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Heart, Trash2 } from 'lucide-react';
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
            // We fetch all products and filter locally for simplicity, 
            // or create a backed route for specific IDs. Let's filter locally for now.
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
            const items = res.data.filter(p => wishlist.includes(p._id));
            setLikedProducts(items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%', flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="glitter-text" style={{ fontSize: '3rem', margin: '0', fontStyle: 'italic', display: 'inline-block' }}>Secret Wishlist</h2>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '10px' }}>Your Curated Diamond Fashion Pieces</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--primary-gold)', padding: '100px 0' }}>Consulting the archives...</div>
                ) : likedProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-gold)', background: 'rgba(212,175,55,0.02)' }}
                    >
                        <Heart size={60} style={{ color: 'var(--border-gold)', opacity: 0.3, marginBottom: '20px' }} />
                        <h3 style={{ fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--text-muted)' }}>The wishlist is an empty canvas.</h3>
                        <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Begin your curation in the boutique.</p>
                        <button onClick={() => navigate('/shop')} className="btn-luxury" style={{ width: 'auto', padding: '12px 40px' }}>
                            EXPLORE COLLECTIONS
                        </button>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '50px',
                    }}>
                        <AnimatePresence>
                            {likedProducts.map((product, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={product._id}
                                    className="luxury-card"
                                    style={{ paddingBottom: '30px', position: 'relative' }}
                                >
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{ position: 'relative', height: '350px', overflow: 'hidden', cursor: 'pointer' }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${product.images?.[0] || product.image}`}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.4))' }} />
                                    </div>

                                    <div style={{ padding: '20px 25px 0', textAlign: 'center' }}>
                                        <h3 style={{ margin: '0', fontSize: '1.2rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{product.name}</h3>
                                        <p style={{ color: 'var(--primary-gold)', margin: '10px 0', fontSize: '1.1rem', fontFamily: 'Playfair Display', fontWeight: 'bold' }}>₹{product.price}</p>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="btn-luxury"
                                                style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)', fontSize: '0.7rem' }}
                                            >
                                                VIEW PIECE
                                            </button>
                                            <button
                                                onClick={() => toggleWishlist(product._id)}
                                                className="btn-luxury"
                                                style={{ padding: '10px 15px', background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b' }}
                                            >
                                                <Trash2 size={16} />
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
