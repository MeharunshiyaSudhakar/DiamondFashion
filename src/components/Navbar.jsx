import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../App';
import { ShoppingCart, User, LogOut, Package, Search, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const megaMenuData = {
        men: {
            outerwear: ["T-Shirts", "Shirts", "Polo Shirts", "Jeans", "Trousers", "Shorts"],
            innerwear: ["Briefs", "Trunks", "Vests", "Thermals"]
        },
        women: {
            outerwear: ["T-Shirts", "Full Pant", "3/4th Pant", "Shorts Set", "Capri Set", "Cycling Shorts", "Loungewear"],
            innerwear: ["Panties", "Camisoles And Slips", "Boyshorts"]
        },
        boys: {
            outerwear: ["T-Shirts", "Shirts", "Shorts", "Jeans", "Joggers", "Sets"],
            innerwear: ["Briefs", "Trunks", "Vests"]
        },
        girls: {
            outerwear: ["T-Shirts", "Dresses", "Tops", "Leggings", "Shorts", "Skirts"],
            innerwear: ["Panties", "Camisoles", "Bloommers"]
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const [marqueeText, setMarqueeText] = useState('SALE: FLAT 50% OFF ON ALL EXCLUSIVE PREMIUM WEAR • FREE SHIPPING ON ORDERS OVER ₹1500');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
                if (res.data && res.data.marqueeText) {
                    setMarqueeText(res.data.marqueeText);
                }
            } catch (err) {
                console.error("Failed to fetch settings");
            }
        };
        fetchSettings();
    }, []);

    const cartLength = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <nav className="navbar" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%', position: 'sticky', top: 0, zIndex: 2000 }}>
            <div className="logo-container" style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to="/home" className="logo" style={{ fontSize: '1.8rem', textDecoration: 'none', fontWeight: '800', fontFamily: 'Figtree', color: 'var(--accent-color)', letterSpacing: '1px' }}>
                    STORE
                </Link>
                {user && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px', letterSpacing: '1px' }}>
                        Welcome, {user.username}
                    </span>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-only" style={{ display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'center' }}>
                {['men', 'women', 'boys', 'girls'].map(cat => (
                    <div 
                        key={cat}
                        className="nav-item-container"
                        style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}
                        onMouseEnter={() => setHoveredCategory(cat)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <Link 
                            to={`/shop?category=${cat}`} 
                            className="nav-link" 
                            style={{ 
                                color: 'var(--text-primary)', 
                                textDecoration: 'none', 
                                textTransform: 'uppercase', 
                                fontSize: '0.85rem', 
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {cat}
                            <span style={{ fontSize: '0.6rem', marginTop: '2px' }}>v</span>
                        </Link>

                        <AnimatePresence>
                            {hoveredCategory === cat && (
                                <motion.div 
                                    className="glass-mega-menu"
                                    initial={{ opacity: 0, y: 15, x: '-50%' }}
                                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute',
                                        top: '70px',
                                        left: '50%',
                                        width: 'max-content',
                                        minWidth: '400px',
                                        backgroundColor: 'rgba(15, 15, 15, 0.85)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        zIndex: 1000,
                                        padding: '30px',
                                        color: '#fff'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '60px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                                {cat} Outerwear
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {megaMenuData[cat].outerwear.map(item => (
                                                    <Link key={item} to={`/shop?category=${cat}&subcategory=${item}`} className="mega-menu-link" style={{ textDecoration: 'none', color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
                                                        {item}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                                {cat} Innerwear
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {megaMenuData[cat].innerwear.map(item => (
                                                    <Link key={item} to={`/shop?category=${cat}&subcategory=${item}`} className="mega-menu-link" style={{ textDecoration: 'none', color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
                                                        {item}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginLeft: '0.5rem' }}>
                    <Link to="/shop?bundle=true" className="nav-link" style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '6px 16px', borderRadius: '20px', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                        Bundles
                    </Link>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Link to="/shop?sale=true" className="nav-link" style={{ background: 'linear-gradient(45deg, #ff004c, #ff4081)', color: '#fff', padding: '4px 12px', borderRadius: '20px', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', display: 'inline-block', boxShadow: '0 4px 15px rgba(255, 0, 76, 0.3)' }}>
                            Clearance
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="action-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '8px 15px', gap: '10px' }}>
                        <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') navigate(`/shop?search=${e.target.value}`);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', width: '150px' }}
                        />
                    </div>
                    {user ? (
                        <>
                            <Link to="/profile" className="action-item" style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Profile</span>
                            </Link>
                            <Link to="/orders" className="action-item" style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                <Package size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Orders</span>
                            </Link>
                            <Link to="/cart" className="action-item" style={{ position: 'relative', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                <ShoppingCart size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Cart</span>
                                {cartLength > 0 && <span style={{ position: 'absolute', background: 'var(--accent-color)', color: '#fff', top: '-8px', right: '-5px', fontSize: '0.65rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartLength}</span>}
                            </Link>
                            <button onClick={handleLogout} className="action-item" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <LogOut size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="action-item" style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Login</span>
                            </Link>
                            <Link to="/cart" className="action-item" style={{ position: 'relative', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                                <ShoppingCart size={20} />
                                <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>Cart</span>
                                {cartLength > 0 && <span style={{ position: 'absolute', background: 'var(--accent-color)', color: '#fff', top: '-8px', right: '-5px', fontSize: '0.65rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartLength}</span>}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/cart" style={{ position: 'relative', color: 'var(--text-primary)' }}>
                        <ShoppingCart size={22} />
                        {cartLength > 0 && <span style={{ position: 'absolute', background: 'var(--accent-color)', color: '#fff', top: '-8px', right: '-8px', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartLength}</span>}
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: 0 }}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar/Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '80%',
                            height: '100vh',
                            background: 'var(--bg-primary)',
                            zIndex: 3000,
                            padding: '4rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                            borderLeft: '1px solid var(--border-color)'
                        }}
                    >
                        <Link to="/home" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase' }}>Home</Link>
                        <Link to="/shop?category=men" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase' }}>Men</Link>
                        <Link to="/shop?category=women" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase' }}>Women</Link>
                        <Link to="/shop?category=boys" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase' }}>Boys</Link>
                        <Link to="/shop?category=girls" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textDecoration: 'none', textTransform: 'uppercase' }}>Girls</Link>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}><User size={20} /> Profile</Link>
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}><Package size={20} /> Orders</Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: 0 }}><LogOut size={20} /> Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}><User size={20} /> Login / Sign Up</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 2500 }}
                />
            )}
        </nav>
        </>
    );
};

export default Navbar;
