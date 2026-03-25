import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext, AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag, X, Camera } from 'lucide-react';
import ARTryOn from '../components/ARTryOn';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user, wishlist, toggleWishlist } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [activeImg, setActiveImg] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewPhotos, setReviewPhotos] = useState([]);
    const [reviewMsg, setReviewMsg] = useState('');
    const [showAR, setShowAR] = useState(false);

    const isLiked = wishlist && wishlist.includes(id);

    useEffect(() => {
        fetchProduct();
        toast('Bespoke Mirror Synchronized. Virtual Try-On Available.', {
            icon: '📸',
            style: { border: '1px solid var(--primary-gold)', background: 'var(--bg-mid-olive)', color: 'var(--primary-gold)' }
        });
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
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

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return setReviewMsg('Identity authentication required.');

        const data = new FormData();
        data.append('rating', rating);
        data.append('comment', comment);
        Array.from(reviewPhotos).forEach(photo => {
            data.append('photos', photo);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setReviewMsg('Archival record created successfully.');
            setComment('');
            setReviewPhotos([]);
            fetchProduct();
        } catch (error) {
            setReviewMsg(error.response?.data?.message || 'Archival failed.');
        }
    };

    if (!product) return <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-deep-olive)', color: 'var(--primary-gold)' }}>Opening the Vault...</div>;

    const displayImages = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)' }}>
            <Navbar />

            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', flex: 1, width: '100%' }}>
                {/* Product Showcase */}
                <div className="grid-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
                    {/* Elite Imagery Portfolio */}
                    <div style={{ width: '100%', position: 'relative' }}>
                        <div style={{ height: 'min(70vh, 600px)', overflow: 'hidden', border: '1px solid var(--border-gold)', background: 'var(--bg-mid-olive)', position: 'relative' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    src={`${import.meta.env.VITE_API_URL}${displayImages[activeImg]}`}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>

                            {/* Wishlist Toggle Heart */}
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                                style={{
                                    position: 'absolute', top: '30px', left: '30px',
                                    padding: '12px', background: 'rgba(26,29,20,0.8)',
                                    borderRadius: '50%', border: '1px solid var(--border-gold)',
                                    cursor: 'pointer', zIndex: 10,
                                    color: isLiked ? '#ff4d4d' : 'var(--text-light)',
                                    filter: isLiked ? 'drop-shadow(0 0 10px rgba(255, 77, 77, 0.4))' : 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                <Heart size={20} fill={isLiked ? '#ff4d4d' : 'transparent'} />
                            </motion.div>

                            {/* Camera AR Button */}
                            <motion.div
                                whileHover={{ scale: 1.1, background: 'var(--primary-gold)', color: 'black' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowAR(true)}
                                className="gold-glow"
                                style={{
                                    position: 'absolute', top: '30px', right: '30px',
                                    padding: '14px', background: 'var(--glass-bg)',
                                    borderRadius: '12px', border: '2px solid var(--primary-gold)',
                                    cursor: 'pointer', zIndex: 1000,
                                    color: 'var(--primary-gold)',
                                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px'
                                }}
                                title="Virtual Try-On"
                            >
                                <Camera size={22} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '2px' }}>TRY-ON</span>
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '1px', background: 'var(--primary-gold)' }}
                                />
                            </motion.div>
                        </div>

                        {/* Thumbnail Navigation */}
                        {displayImages.length > 1 && (
                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {displayImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${import.meta.env.VITE_API_URL}${img}`}
                                        alt={`${product.name} ${idx}`}
                                        onClick={() => setActiveImg(idx)}
                                        style={{
                                            width: '80px', height: '100px',
                                            objectFit: 'cover', cursor: 'pointer',
                                            border: activeImg === idx ? '2px solid var(--primary-gold)' : '1px solid var(--border-gold)',
                                            opacity: activeImg === idx ? 1 : 0.6,
                                            transition: '0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Elite Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'var(--primary-gold)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '1rem' }}
                        >
                            {product.category} • {product.segment}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glitter-text"
                            style={{ fontSize: 'min(4rem, 10vw)', margin: '0 0 1rem', fontWeight: '400', fontStyle: 'italic' }}
                        >
                            {product.name}
                        </motion.h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="gold-glow" style={{ color: 'var(--primary-gold)', fontSize: '1.2rem' }}>
                                {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '1px' }}>({product.numReviews || 0} VERIFIED REVIEWS)</span>
                        </div>

                        <h2 style={{ color: 'var(--text-light)', fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'Playfair Display' }}>₹{product.price}</h2>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <p style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Selected Dimension</p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {product.sizes.map(s => (
                                        <button
                                            key={s.size}
                                            disabled={s.stock === 0}
                                            onClick={() => setSelectedSize(s.size)}
                                            style={{
                                                width: '50px', height: '50px',
                                                border: selectedSize === s.size ? '2px solid var(--primary-gold)' : '1px solid var(--border-gold)',
                                                background: selectedSize === s.size ? 'rgba(212,175,55,0.1)' : 'transparent',
                                                color: s.stock === 0 ? 'var(--text-muted)' : 'white',
                                                cursor: s.stock === 0 ? 'not-allowed' : 'pointer',
                                                position: 'relative',
                                                transition: '0.3s'
                                            }}
                                        >
                                            {s.size}
                                            {s.stock === 0 && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, transparent 48%, var(--border-gold) 50%, transparent 52%)' }} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1rem', fontWeight: '300', marginBottom: '2rem' }}>{product.description}</p>
                            <div style={{ padding: '20px', borderLeft: '2px solid var(--primary-gold)', background: 'rgba(212,175,55,0.03)' }}>
                                <span style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Materials Archive</span>
                                <p style={{ margin: '10px 0 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>{product.materials}</p>
                            </div>
                        </div>

                        {reviewMsg && !reviewMsg.includes('successfully') && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>{reviewMsg}</p>
                        )}

                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleAddToCart}
                                className="btn-luxury"
                                style={{ flex: '1 1 200px', background: 'transparent', border: '1px solid var(--border-gold)', color: 'var(--text-light)' }}
                            >
                                <ShoppingBag size={18} /> ADD TO VAULT
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn-luxury"
                                style={{ flex: '1 1 200px' }}
                            >
                                ACQUIRE NOW
                            </button>
                        </div>

                        {/* AR Try-On Action */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02, background: 'rgba(212,175,55,0.05)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAR(true)}
                            className="btn-luxury"
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: '1px solid var(--primary-gold)',
                                color: 'var(--primary-gold)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px',
                                padding: '18px'
                            }}
                        >
                            <Camera size={20} /> VIRTUAL TRY-ON (BETA)
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {showAR && (
                        <ARTryOn product={product} onClose={() => setShowAR(false)} />
                    )}
                </AnimatePresence>

                {/* Prestige Reviews Section */}
                <div style={{ marginTop: '8rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h3 className="glitter-text" style={{ fontSize: '3rem', fontStyle: 'italic', display: 'inline-block' }}>Client Testimonials</h3>
                        <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.7rem', marginTop: '10px' }}>Voices of the Diamond Elite</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '4rem' }}>
                        {/* The Archive of Reviews */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((rev, i) => (
                                    <motion.div
                                        key={rev._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-morphism"
                                        style={{ padding: '2.5rem', border: '1px solid var(--border-gold)', position: 'relative' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <h4 style={{ margin: '0', color: 'var(--text-light)', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>{rev.username}</h4>
                                                <div className="gold-glow" style={{ color: 'var(--primary-gold)', fontSize: '0.8rem', marginTop: '5px' }}>
                                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                </div>
                                            </div>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontStyle: 'italic', margin: '0 0 1.5rem' }}>"{rev.comment}"</p>

                                        {/* Review Photos */}
                                        {rev.images && rev.images.length > 0 && (
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {rev.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={`${import.meta.env.VITE_API_URL}${img}`}
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid var(--border-gold)' }}
                                                        alt="Review exhibit"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <span style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '3rem', color: 'var(--primary-gold)', opacity: 0.1, fontFamily: 'serif' }}>"</span>
                                    </motion.div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-gold)', color: 'var(--text-muted)' }}>
                                    <p style={{ letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem' }}>The archive awaits your voice.</p>
                                </div>
                            )}
                        </div>

                        {/* Submit Your Legacy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="luxury-card"
                            style={{ height: 'fit-content', padding: '3.5rem' }}
                        >
                            <h4 style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '1.8rem', marginBottom: '2rem', textAlign: 'center' }}>Leave Your Legacy</h4>

                            {reviewMsg && (
                                <div style={{
                                    padding: '12px', textAlign: 'center', marginBottom: '20px', fontSize: '0.8rem',
                                    backgroundColor: reviewMsg.includes('successfully') ? 'rgba(212,175,55,0.1)' : 'rgba(255,0,0,0.05)',
                                    color: reviewMsg.includes('successfully') ? 'var(--primary-gold)' : '#ff6b6b',
                                    border: `1px solid ${reviewMsg.includes('successfully') ? 'var(--border-gold)' : 'rgba(255,0,0,0.2)'}`
                                }}>
                                    {reviewMsg}
                                </div>
                            )}

                            {user ? (
                                <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Excellence Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            style={{
                                                width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--border-gold)', color: 'white', outline: 'none'
                                            }}
                                        >
                                            <option value="5" style={{ background: '#1a1d14' }}>V - Singular Excellence</option>
                                            <option value="4" style={{ background: '#1a1d14' }}>IV - Exceptional Quality</option>
                                            <option value="3" style={{ background: '#1a1d14' }}>III - Commendable</option>
                                            <option value="2" style={{ background: '#1a1d14' }}>II - Adequate</option>
                                            <option value="1" style={{ background: '#1a1d14' }}>I - Below Standards</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Observation Portfolio</label>
                                        <textarea
                                            required
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows="5"
                                            style={{
                                                width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--border-gold)', color: 'white', outline: 'none', resize: 'none'
                                            }}
                                            placeholder="Chronicle your experience with this piece..."
                                        />
                                    </div>

                                    <div style={{ border: '1px dashed var(--border-gold)', padding: '1.5rem', textAlign: 'center' }}>
                                        <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '2px' }}>EXHIBIT PHOTOS (Max 3)</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => setReviewPhotos(e.target.files)}
                                            style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-luxury" style={{ width: '100%' }}>SUBMIT ARCHIVAL REVIEW</button>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Access is restricted to verified owners.</p>
                                    <button onClick={() => navigate('/login')} className="btn-luxury">MEMBERSHIP ACCESS</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductPage;
