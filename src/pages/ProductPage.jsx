import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext, AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag, Camera } from 'lucide-react';
import ARTryOn from '../components/ARTryOn';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user, wishlist, toggleWishlist } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [activeImg, setActiveImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');
    const [showAR, setShowAR] = useState(false);

    const isLiked = wishlist && wishlist.includes(id);

    useEffect(() => {
        fetchProduct();
        toast('Virtual Try-On Available.', {
            icon: '📸',
            style: { border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
        });
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setReviewMsg('Please select a size to proceed.');
            return;
        }
        addToCart({ ...product, size: selectedSize });
        setReviewMsg('');
    };

    const handleBuyNow = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setReviewMsg('Please select a size to proceed.');
            return;
        }
        addToCart({ ...product, size: selectedSize });
        navigate('/cart');
    };

    if (!product) return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Loading...</div>;

    const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto', flex: 1, width: '100%' }}>
                <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <div style={{
                                    position: 'absolute', top: '20px', left: '20px',
                                    background: 'var(--text-primary)', color: 'var(--bg-primary)',
                                    padding: '6px 15px', fontSize: '0.85rem', fontWeight: 'bold',
                                    letterSpacing: '1px', textTransform: 'uppercase', zIndex: 10
                                }}>
                                    Sale
                                </div>
                            )}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${displayImages[activeImg]}`}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </AnimatePresence>

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                                style={{
                                    position: 'absolute', top: '20px', left: '20px',
                                    padding: '12px', background: 'var(--bg-primary)',
                                    borderRadius: '50%', cursor: 'pointer', zIndex: 10,
                                    color: isLiked ? '#e74c3c' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                }}
                            >
                                <Heart size={20} fill={isLiked ? '#e74c3c' : 'transparent'} />
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAR(true)}
                                style={{
                                    position: 'absolute', top: '20px', right: '20px',
                                    padding: '10px 16px', background: 'var(--bg-primary)',
                                    borderRadius: '4px', cursor: 'pointer', zIndex: 10,
                                    color: 'var(--text-primary)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px'
                                }}
                                title="Virtual Try-On"
                            >
                                <Camera size={18} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>TRY-ON</span>
                            </motion.div>
                        </div>

                        {displayImages.length > 1 && (
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {displayImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`}
                                        alt={`${product.name} ${idx}`}
                                        onClick={() => setActiveImg(idx)}
                                        style={{
                                            width: '80px', height: '100px',
                                            objectFit: 'contain', cursor: 'pointer', background: 'var(--bg-secondary)',
                                            border: activeImg === idx ? '2px solid var(--accent-color)' : '1px solid transparent',
                                            opacity: activeImg === idx ? 1 : 0.6,
                                            transition: '0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }}
                        >
                            {product.category} • {product.segment}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: 'min(3.5rem, 6vw)', margin: '0 0 1rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}
                        >
                            {product.name}
                        </motion.h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                            {product.originalPrice && product.originalPrice > product.price ? (
                                <>
                                    <h2 style={{ color: '#e74c3c', fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>₹{product.price}</h2>
                                    <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textDecoration: 'line-through', fontWeight: '400', margin: 0 }}>₹{product.originalPrice}</h2>
                                </>
                            ) : (
                                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '400', margin: 0 }}>₹{product.price}</h2>
                            )}
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Select Size</p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {product.sizes.map(s => (
                                        <button
                                            key={s.size}
                                            disabled={s.stock === 0}
                                            onClick={() => setSelectedSize(s.size)}
                                            style={{
                                                minWidth: '60px', height: '50px', padding: '0 15px',
                                                border: selectedSize === s.size ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                                background: selectedSize === s.size ? 'var(--accent-color)' : 'transparent',
                                                color: selectedSize === s.size ? '#fff' : (s.stock === 0 ? 'var(--border-color)' : 'var(--text-primary)'),
                                                cursor: s.stock === 0 ? 'not-allowed' : 'pointer',
                                                position: 'relative',
                                                transition: '0.3s',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {s.size}
                                            {s.stock === 0 && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, transparent 48%, var(--border-color) 50%, transparent 52%)' }} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '3rem' }}>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '2rem' }}>{product.description}</p>
                            
                            {product.materials && (
                                <div style={{ padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Materials</span>
                                    <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{product.materials}</p>
                                </div>
                            )}
                        </div>

                        {reviewMsg && !reviewMsg.includes('successfully') && (
                            <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '1rem' }}>{reviewMsg}</p>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleAddToCart}
                                className="btn-secondary"
                                style={{ flex: '1 1 200px', padding: '16px' }}
                            >
                                <ShoppingBag size={18} /> ADD TO CART
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn-primary"
                                style={{ flex: '1 1 200px', padding: '16px' }}
                            >
                                BUY NOW
                            </button>
                        </div>

                    </div>
                </div>

                <AnimatePresence>
                    {showAR && (
                        <ARTryOn product={product} onClose={() => setShowAR(false)} />
                    )}
                </AnimatePresence>

            </div>

            <Footer />
        </div>
    );
};

export default ProductPage;
