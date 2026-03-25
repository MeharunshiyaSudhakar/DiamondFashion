import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext, AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Heart, Filter, X, SlidersHorizontal } from 'lucide-react';

const ShopDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [activeSegment, setActiveSegment] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('newest');
    const [activeMaterial, setActiveMaterial] = useState('all');
    const [activeSeason, setActiveSeason] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        const filter = params.get('filter');
        if (search) setSearchQuery(search);
        if (filter === 'new') {
            setSortBy('newest');
            // You could also set a specific state to show a "New Arrivals" title
        }
    }, [location.search]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Derived filtering logic
    const filteredProducts = products.filter(p => {
        const matchesSegment = activeSegment === 'all' || p.segment === activeSegment;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesMaterial = activeMaterial === 'all' || (p.materials && p.materials.toLowerCase().includes(activeMaterial.toLowerCase()));
        const matchesSeason = activeSeason === 'all' || p.season === activeSeason;

        return matchesSegment && matchesSearch && matchesPrice && matchesMaterial && matchesSeason;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    const segments = [
        { id: 'all', label: 'Prime Collections' },
        { id: 'men', label: 'Boutique Men' },
        { id: 'women', label: 'Elite Women' },
        { id: 'girls', label: 'Royal Girls' },
        { id: 'boys', label: 'Royal Boys' }
    ];

    const materials = ['all', 'Cotton', 'Linen', 'Silk', 'Egyptian Cotton', 'Wool'];
    const seasons = ['all', 'Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'];

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)' }}>
            <Navbar />

            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%', flex: 1 }}>

                {/* Dynamic Title based on context */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="glitter-text" style={{ fontSize: '3rem', fontStyle: 'italic', marginBottom: '10px' }}>
                        {new URLSearchParams(location.search).get('filter') === 'new' ? 'New Acquisitions' : 'The Prime Archives'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {new URLSearchParams(location.search).get('filter') === 'new' ? 'The latest silhouettes in our nocturnal vault' : 'Curated collections for the modern minimalist'}
                    </p>
                </div>

                {/* Horizontal Luxury Switcher */}
                <div style={{ display: 'flex', gap: 'min(5vw, 2rem)', marginBottom: '3rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {segments.map(seg => (
                        <span
                            key={seg.id}
                            onClick={() => setActiveSegment(seg.id)}
                            style={{
                                fontSize: '0.8rem',
                                letterSpacing: '3px',
                                fontWeight: activeSegment === seg.id ? '700' : '400',
                                color: activeSegment === seg.id ? 'var(--primary-gold)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderBottom: activeSegment === seg.id ? '2px solid var(--primary-gold)' : '2px solid transparent',
                                paddingBottom: '1.5rem',
                                marginBottom: '-1.6rem'
                            }}
                        >
                            {seg.label}
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

                    {/* Filter Sidebar (Desktop) */}
                    <div className="desktop-only" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '120px' }}>
                        <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-gold)', marginBottom: '2rem' }}>
                                <SlidersHorizontal size={18} />
                                <h4 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Laboratory Filters</h4>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Price Ceiling: ₹{priceRange[1]}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="500"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    style={{ width: '100%', accentColor: 'var(--primary-gold)', cursor: 'pointer' }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Sort Archives</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', color: 'white', fontSize: '0.75rem', outline: 'none' }}
                                >
                                    <option value="newest">Latest Acquisitions</option>
                                    <option value="oldest">Historical Pieces</option>
                                    <option value="price-low">Value: Low to High</option>
                                    <option value="price-high">Value: High to Low</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Material Essence</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {materials.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setActiveMaterial(m)}
                                            style={{
                                                padding: '4px 10px', fontSize: '0.6rem', background: activeMaterial === m ? 'var(--primary-gold)' : 'transparent',
                                                border: '1px solid var(--border-gold)', color: activeMaterial === m ? 'black' : 'var(--text-muted)',
                                                cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase'
                                            }}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Seasonal Cycle</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {seasons.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setActiveSeason(s)}
                                            style={{
                                                padding: '4px 10px', fontSize: '0.6rem', background: activeSeason === s ? 'var(--primary-gold)' : 'transparent',
                                                border: '1px solid var(--border-gold)', color: activeSeason === s ? 'black' : 'var(--text-muted)',
                                                cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="mobile-only" style={{ width: '100%', marginBottom: '20px' }}>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="btn-luxury"
                            style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-gold)', color: 'var(--text-light)' }}
                        >
                            <Filter size={16} /> ADJUST FILTERS
                        </button>
                    </div>

                    {/* Products Content Area */}
                    <div style={{ flex: 1 }}>
                        {searchQuery && (
                            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px' }}>SEARCHING FOR: </span>
                                <span className="glitter-text" style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>"{searchQuery}"</span>
                                <X
                                    size={18}
                                    style={{ color: '#ff6b6b', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSearchQuery('');
                                        navigate('/shop');
                                    }}
                                />
                            </div>
                        )}

                        <motion.div
                            layout
                            className="grid-3"
                            style={{ gap: '30px' }}
                        >
                            <AnimatePresence>
                                {filteredProducts.map(product => {
                                    const isLiked = wishlist && wishlist.includes(product._id);
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={product._id}
                                            className="luxury-card"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            style={{ paddingBottom: '30px' }}
                                        >
                                            <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${product.images?.[0] || product.image}`}
                                                    alt={product.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                                                    className="product-img-luxury"
                                                />
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.4))' }} />

                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                                                    style={{
                                                        position: 'absolute', top: '20px', left: '20px',
                                                        cursor: 'pointer', zIndex: 10,
                                                        color: isLiked ? '#ff4d4d' : 'var(--text-light)',
                                                    }}
                                                >
                                                    <Heart size={22} fill={isLiked ? '#ff4d4d' : 'transparent'} />
                                                </motion.div>

                                                <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white', fontWeight: '700', fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>
                                                    ₹{product.price}
                                                </div>
                                            </div>

                                            <div style={{ padding: '25px 25px 0', textAlign: 'center' }}>
                                                <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-light)' }}>{product.name}</h3>
                                                <p style={{ margin: '8px 0', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase' }}>{product.segment} • {product.season || 'All-Season'}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                    className="btn-luxury"
                                                    style={{ marginTop: '15px', width: '100%', padding: '12px', fontSize: '0.7rem' }}
                                                >
                                                    <ShoppingBag size={14} /> ADD TO VAULT
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {filteredProducts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                                <ShoppingBag size={60} style={{ opacity: 0.1, marginBottom: '20px' }} />
                                <h3 style={{ fontStyle: 'italic', fontSize: '1.5rem' }}>No pieces match your search.</h3>
                                <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.7rem' }}>Refine your filters to discover other archives.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer Overlay */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'tween' }}
                            style={{ position: 'fixed', top: 0, right: 0, width: '85%', height: '100vh', background: 'var(--bg-deep-olive)', zIndex: 3001, padding: '3rem 2rem', overflowY: 'auto' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--primary-gold)', fontStyle: 'italic' }}>Lab Filters</h3>
                                <X size={24} style={{ color: 'var(--primary-gold)' }} onClick={() => setShowFilters(false)} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Price Range: Up to ₹{priceRange[1]}</label>
                                    <input type="range" min="0" max="50000" step="500" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} style={{ width: '100%', accentColor: 'var(--primary-gold)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Sort By</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', color: 'white' }}>
                                        <option value="newest">Latest Acquisitions</option>
                                        <option value="oldest">Historical Pieces</option>
                                        <option value="price-low">Value: Low to High</option>
                                        <option value="price-high">Value: High to Low</option>
                                    </select>
                                </div>
                                <button onClick={() => setShowFilters(false)} className="btn-luxury" style={{ marginTop: '2rem' }}>APPLY FILTERS</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default ShopDashboard;
