import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext, AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingBag, Heart, X, ChevronDown, Search } from 'lucide-react';

const ShopDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [activeSegment, setActiveSegment] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [maxPrice, setMaxPrice] = useState(10000);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterMaterial, setFilterMaterial] = useState('all');
    
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [showMatDropdown, setShowMatDropdown] = useState(false);

    const isBundleMode = new URLSearchParams(location.search).get('bundle') === 'true';

    const { addToCart } = useContext(CartContext);
    const { wishlist, toggleWishlist } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        const filter = params.get('filter');
        const category = params.get('category');
        if (search) setSearchQuery(search);
        if (filter === 'new') {
            setSortBy('newest');
        }
        if (category) {
            setActiveSegment(category);
        } else {
            setActiveSegment('all');
        }
    }, [location.search]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesBundle = !isBundleMode || p.isBundle || p.name.toLowerCase().includes('pack') || p.name.toLowerCase().includes('bundle');
        const matchesSegment = activeSegment === 'all' || p.segment === activeSegment;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price <= maxPrice;
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        const matchesMaterial = filterMaterial === 'all' || p.materials === filterMaterial;
        
        return matchesBundle && matchesSegment && matchesSearch && matchesPrice && matchesCategory && matchesMaterial;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
    const uniqueMaterials = ["Cotton", "Polyester", "Cotton Mixed"];

    const segments = [
        { id: 'all', label: 'All Products' },
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
        { id: 'boys', label: 'Boys' },
        { id: 'girls', label: 'Girls' }
    ];

    const sortOptions = {
        'newest': 'Newest Additions',
        'oldest': 'Oldest',
        'price-low': 'Price: Low to High',
        'price-high': 'Price: High to Low'
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%', flex: 1 }}>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {isBundleMode 
                            ? 'Exclusive Bundles' 
                            : new URLSearchParams(location.search).get('filter') === 'new' 
                            ? 'New Arrivals' 
                            : activeSegment === 'all' ? 'Collections' : activeSegment}
                    </h2>
                </div>

                {/* Minimalist Top Filter Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '20px' }}>
                    
                    {!isBundleMode && (
                        <div style={{ display: 'flex', gap: 'min(3vw, 2rem)', overflowX: 'auto', paddingBottom: '5px' }}>
                            {segments.map(seg => (
                                <span
                                    key={seg.id}
                                    onClick={() => setActiveSegment(seg.id)}
                                    style={{
                                        fontSize: '0.85rem',
                                        letterSpacing: '1px',
                                        fontWeight: activeSegment === seg.id ? '600' : '400',
                                        color: activeSegment === seg.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        transition: 'var(--transition-main)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {seg.label}
                                </span>
                            ))}
                        </div>
                    )}
                    {isBundleMode && <div style={{ flex: 1 }}></div>}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: isBundleMode ? 'flex-end' : 'flex-end', width: isBundleMode ? '100%' : 'auto' }}>
                        {/* Search Bar inside Shop Dashboard */}
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '8px 15px', gap: '10px' }}>
                            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', width: '120px' }}
                            />
                        </div>

                        {/* Price Slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '8px 15px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)', fontWeight: '600' }}>Up to: ₹{maxPrice}</span>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={{ cursor: 'pointer', accentColor: 'var(--text-primary)', width: '80px' }}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                onClick={() => { setShowCatDropdown(!showCatDropdown); setShowMatDropdown(false); setShowSortDropdown(false); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}
                            >
                                Category: {filterCategory === 'all' ? 'All' : filterCategory} <ChevronDown size={14} />
                            </div>
                            
                            <AnimatePresence>
                                {showCatDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', zIndex: 100, minWidth: '150px', boxShadow: 'var(--shadow-main)' }}
                                    >
                                        <div
                                            onClick={() => { setFilterCategory('all'); setShowCatDropdown(false); }}
                                            style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s', background: filterCategory === 'all' ? 'var(--bg-secondary)' : 'transparent', color: filterCategory === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.target.style.background = filterCategory === 'all' ? 'var(--bg-secondary)' : 'transparent'}
                                        >
                                            All
                                        </div>
                                        {uniqueCategories.map(cat => (
                                            <div
                                                key={cat}
                                                onClick={() => { setFilterCategory(cat); setShowCatDropdown(false); }}
                                                style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s', background: filterCategory === cat ? 'var(--bg-secondary)' : 'transparent', color: filterCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                                onMouseLeave={(e) => e.target.style.background = filterCategory === cat ? 'var(--bg-secondary)' : 'transparent'}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Material Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                onClick={() => { setShowMatDropdown(!showMatDropdown); setShowCatDropdown(false); setShowSortDropdown(false); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}
                            >
                                Material: {filterMaterial === 'all' ? 'All' : filterMaterial} <ChevronDown size={14} />
                            </div>
                            
                            <AnimatePresence>
                                {showMatDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', zIndex: 100, minWidth: '150px', boxShadow: 'var(--shadow-main)' }}
                                    >
                                        <div
                                            onClick={() => { setFilterMaterial('all'); setShowMatDropdown(false); }}
                                            style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s', background: filterMaterial === 'all' ? 'var(--bg-secondary)' : 'transparent', color: filterMaterial === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.target.style.background = filterMaterial === 'all' ? 'var(--bg-secondary)' : 'transparent'}
                                        >
                                            All
                                        </div>
                                        {uniqueMaterials.map(mat => (
                                            <div
                                                key={mat}
                                                onClick={() => { setFilterMaterial(mat); setShowMatDropdown(false); }}
                                                style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s', background: filterMaterial === mat ? 'var(--bg-secondary)' : 'transparent', color: filterMaterial === mat ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                                onMouseLeave={(e) => e.target.style.background = filterMaterial === mat ? 'var(--bg-secondary)' : 'transparent'}
                                            >
                                                {mat}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCatDropdown(false); setShowMatDropdown(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}
                        >
                            Sort By: {sortOptions[sortBy]} <ChevronDown size={14} />
                        </div>
                        
                        <AnimatePresence>
                            {showSortDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', zIndex: 100, minWidth: '200px', boxShadow: 'var(--shadow-main)' }}
                                >
                                    {Object.entries(sortOptions).map(([key, label]) => (
                                        <div
                                            key={key}
                                            onClick={() => { setSortBy(key); setShowSortDropdown(false); }}
                                            style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s', background: sortBy === key ? 'var(--bg-secondary)' : 'transparent', color: sortBy === key ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.target.style.background = sortBy === key ? 'var(--bg-secondary)' : 'transparent'}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    </div>
                </div>

                <div style={{ width: '100%' }}>
                    {searchQuery && (
                        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '1px' }}>Results for: </span>
                            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>"{searchQuery}"</span>
                            <X
                                size={18}
                                style={{ color: '#e74c3c', cursor: 'pointer' }}
                                onClick={() => {
                                    setSearchQuery('');
                                    navigate('/shop');
                                }}
                            />
                        </div>
                    )}

                    <motion.div
                        layout
                        className="grid-4"
                        style={{ gap: '30px' }}
                    >
                        <AnimatePresence>
                            {filteredProducts.map(product => {
                                const isLiked = wishlist && wishlist.includes(product._id);
                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={product._id}
                                        className="product-card"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        style={{ border: 'none', background: 'transparent' }}
                                    >
                                        <div style={{ position: 'relative', height: '400px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <div style={{
                                                    position: 'absolute', top: '15px', left: '15px',
                                                    background: 'var(--text-primary)', color: 'var(--bg-primary)',
                                                    padding: '4px 10px', fontSize: '0.7rem', fontWeight: 'bold',
                                                    letterSpacing: '1px', textTransform: 'uppercase', zIndex: 10
                                                }}>
                                                    Sale
                                                </div>
                                            )}
                                            <img
                                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.images?.[0] || product.image}`}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            />
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                                                style={{
                                                    position: 'absolute', top: '15px', right: '15px',
                                                    cursor: 'pointer', zIndex: 10,
                                                    background: 'var(--bg-primary)', padding: '10px', borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: isLiked ? '#e74c3c' : 'var(--text-secondary)'
                                                }}
                                            >
                                                <Heart size={18} fill={isLiked ? '#e74c3c' : 'transparent'} color={isLiked ? '#e74c3c' : 'var(--text-secondary)'} />
                                            </motion.div>
                                        </div>

                                        <div style={{ paddingTop: '15px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                                            <p style={{ margin: '0 0 5px', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>{product.segment}</p>
                                            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{product.name}</h3>
                                            <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {product.originalPrice && product.originalPrice > product.price ? (
                                                    <>
                                                        <span style={{ color: '#e74c3c' }}>₹{product.price}</span>
                                                        <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '400' }}>₹{product.originalPrice}</span>
                                                    </>
                                                ) : (
                                                    <span>₹{product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
                            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '500' }}>No products found.</h3>
                            <p style={{ fontSize: '0.9rem' }}>Try exploring other collections.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ShopDashboard;
