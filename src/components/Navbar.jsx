import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../App';
import { ShoppingCart, User, LogOut, Package, Search, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const cartLength = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="logo-container">
                <Link to="/home" className="logo glitter-text" style={{ fontSize: '1.5rem', textDecoration: 'none', fontWeight: '400', fontFamily: 'Playfair Display', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    DIAMOND FASHION
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links desktop-only">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/shop" className="nav-link">Collections</Link>
                <Link to="/shop?filter=new" className="nav-link">New Arrivals</Link>
                <Link to="/experience" className="nav-link">Virtual Tour</Link>
                <Link to="/wishlist" className="nav-link">Wishlist</Link>
            </div>

            <div className="action-links">
                <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', borderRadius: '20px', padding: '5px 15px', gap: '10px' }}>
                        <Search className="gold-glow" size={16} style={{ color: 'var(--primary-gold)' }} />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') navigate(`/shop?search=${e.target.value}`);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.75rem', outline: 'none', width: '120px' }}
                        />
                    </div>
                    {user ? (
                        <>
                            <Link to="/profile" className="action-item" style={{ color: 'var(--text-light)' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Vault</span>
                            </Link>
                            <Link to="/orders" className="action-item" style={{ color: 'var(--text-light)' }}>
                                <Package size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Orders</span>
                            </Link>
                            <Link to="/cart" className="action-item" style={{ position: 'relative', color: 'var(--text-light)' }}>
                                <ShoppingCart size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Bag</span>
                                {cartLength > 0 && <span className="cart-badge" style={{ background: 'var(--primary-gold)', color: 'black', top: '-10px', right: '5px' }}>{cartLength}</span>}
                            </Link>
                            <button onClick={handleLogout} className="action-item" style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: 0 }}>
                                <LogOut size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Exit</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="action-item" style={{ color: 'var(--text-light)' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Login</span>
                            </Link>
                            <Link to="/cart" className="action-item" style={{ position: 'relative', color: 'var(--text-light)' }}>
                                <ShoppingCart size={20} />
                                <span style={{ fontSize: '0.65rem' }}>Bag</span>
                                {cartLength > 0 && <span className="cart-badge" style={{ background: 'var(--primary-gold)', color: 'black', top: '-10px', right: '5px' }}>{cartLength}</span>}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-only" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/cart" style={{ position: 'relative', color: 'var(--text-light)' }}>
                        <ShoppingCart size={22} />
                        {cartLength > 0 && <span className="cart-badge" style={{ background: 'var(--primary-gold)', color: 'black', top: '-8px', right: '-8px', fontSize: '10px', width: '16px', height: '16px' }}>{cartLength}</span>}
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', padding: 0 }}
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
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '80%',
                            height: '100vh',
                            background: 'var(--bg-deep-olive)',
                            zIndex: 3000,
                            padding: '4rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            borderLeft: '1px solid var(--border-gold)'
                        }}
                    >
                        <Link to="/home" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ fontSize: '1.2rem' }}>Home</Link>
                        <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ fontSize: '1.2rem' }}>Collections</Link>
                        <Link to="/shop?filter=new" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ fontSize: '1.2rem' }}>New Arrivals</Link>
                        <Link to="/experience" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ fontSize: '1.2rem' }}>Virtual Tour</Link>
                        <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ fontSize: '1.2rem' }}>Wishlist</Link>

                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid var(--border-gold)', paddingTop: '2rem' }}>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><User size={20} /> Profile</Link>
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Package size={20} /> Orders</Link>
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}><LogOut size={20} /> Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><User size={20} /> Login / Sign Up</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2500 }}
                />
            )}
        </nav>
    );
};

export default Navbar;

