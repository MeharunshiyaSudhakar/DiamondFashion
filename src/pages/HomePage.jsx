import { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeCarousel from '../components/HomeCarousel';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Hero3D from '../components/Hero3D';
import { AuthContext } from '../App';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [0, 800], [5, -5]);
    const rotateY = useTransform(x, [0, 1400], [-5, 5]);

    function handleMouse(event) {
        x.set(event.clientX);
        y.set(event.clientY);
    }

    const collections = [
        { title: 'The Golden Crest', category: 'Elite T-Shirts', img: '/uploads/tshirt_gold.png', desc: 'Hand-sewn gold diamond crest on Egyptian cotton.' },
        { title: 'Midnight Onyx', category: 'Nocturne Series', img: '/uploads/tshirt_black.png', desc: 'Matte black minimalist silhouette with gold branding.' }
    ];

    const reviews = [
        { name: 'Aria V.', text: 'The quality of the night-pants is unlike anything I’ve experienced. Pure luxury.' },
        { name: 'Lucas M.', text: 'Diamond Fashion redefined my wardrobe. The fit is impeccable.' },
        { name: 'Sophia K.', text: 'Elegant, timeless, and remarkably comfortable. My go-to boutique.' }
    ];

    return (
        <div className="page-container" onMouseMove={handleMouse} style={{ backgroundColor: '#1a1d14', perspective: '1000px' }}>
            <Navbar />

            <main>
                {/* Cinematic Hero Section */}
                <section style={{ height: '90vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Hero3D />

                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2 }}
                        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(42, 48, 32, 0.4) 0%, rgba(26, 29, 20, 0) 80%)', zIndex: -1 }}
                    />

                    <div style={{ textAlign: 'center', zIndex: 10 }}>
                        {user && (
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: 'var(--text-light)', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1rem', display: 'block', marginBottom: '0.5rem', fontStyle: 'italic' }}
                            >
                                Hello, {user.username}
                            </motion.span>
                        )}
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ color: 'var(--primary-gold)', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '1rem' }}
                        >
                            Est. 2026
                        </motion.span>
                        <motion.h1
                            style={{
                                rotateX, rotateY,
                                fontSize: 'min(12vw, 6rem)', margin: '0', fontWeight: '400', fontStyle: 'italic',
                                transformStyle: 'preserve-3d'
                            }}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="glitter-text"
                        >
                            Timeless Elegance
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '20px auto', fontWeight: '300' }}
                        >
                            Curating the finest t-shirts and night-pants for the discerning individual. Experience the Diamond standard.
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
                        >
                            <button onClick={() => navigate('/shop')} className="btn-luxury">Discover Collection</button>
                            <button onClick={() => navigate('/virtual-tour')} className="btn-luxury" style={{ background: 'transparent', border: '1px solid var(--primary-gold)' }}>Step Inside</button>
                        </motion.div>
                    </div>

                    {/* Floating Gold Particles Decor */}
                    <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ width: '1px', height: '100px', background: 'linear-gradient(transparent, var(--primary-gold))' }} />
                    </div>
                </section>

                {/* Archival Carousel - Offers, Arrivals, Rewards */}
                <section style={{ padding: '60px 0 0', textAlign: 'center' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ color: 'var(--primary-gold)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '10px', letterSpacing: '4px', textTransform: 'uppercase' }}
                    >
                        New Updates
                    </motion.h2>
                    <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--primary-gold), transparent)', margin: '0 auto 20px' }} />
                </section>
                <div style={{ marginBottom: '60px' }}>
                    <HomeCarousel />
                </div>

                {/* Luxury Category Circles */}
                <section style={{ padding: '80px 5%', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-gold)', marginBottom: '50px' }}>Shop the Silhouette</h2>
                    <div className="grid-4" style={{ gap: '2rem' }}>
                        {[
                            { l: 'Boutique Men', e: '👕' },
                            { l: 'Elite Women', e: '👚' },
                            { l: 'Royal Kids', e: '🧒' },
                            { l: 'New Archive', e: '✨' }
                        ].map((cat, i) => (
                            <motion.div
                                key={cat.l}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => navigate('/shop')}
                                className="cat-item-luxury"
                                style={{ textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div className="feature-circle">
                                    <span style={{ fontSize: '3rem' }}>{cat.e}</span>
                                </div>
                                <p style={{ marginTop: '15px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-light)' }}>{cat.l}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Featured Collections Grid */}
                <section style={{ padding: '80px 8%', backgroundColor: '#14170f' }}>
                    <div className="grid-3" style={{ gap: '2rem' }}>
                        {collections.map((col, i) => (
                            <motion.div
                                key={col.title}
                                whileHover={{ scale: 1.02 }}
                                className="luxury-card"
                                style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div style={{ height: '300px', width: '100%', overflow: 'hidden', marginBottom: '20px', border: '1px solid rgba(212,175,55,0.1)' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL}${col.img}`} 
                                        alt={col.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px' }}>{col.category}</span>
                                <h3 style={{ fontSize: '1.5rem', margin: '15px 0' }}>{col.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>{col.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section style={{ padding: '80px 5%', textAlign: 'center' }}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        style={{ color: 'var(--primary-gold)', fontStyle: 'italic', marginBottom: '60px', fontSize: '2rem' }}
                    >
                        Voices of Excellence
                    </motion.h2>
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {reviews.map((r, i) => (
                            <div key={i} style={{ minWidth: 'min(300px, 80vw)', background: 'rgba(255,255,255,0.03)', padding: '30px', border: '1px solid rgba(212,175,55,0.1)' }}>
                                <p style={{ fontStyle: 'italic', fontSize: '1rem', marginBottom: '20px' }}>"{r.text}"</p>
                                <p style={{ color: 'var(--primary-gold)', fontWeight: '700', letterSpacing: '1px', fontSize: '0.75rem' }}>— {r.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Newsletter */}
                <section style={{ padding: '100px 5%', textAlign: 'center', borderTop: '1px solid var(--border-gold)' }}>
                    <div className="glass-morphism" style={{ padding: '60px', maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ color: 'var(--primary-gold)', marginBottom: '10px' }}>The Archive List</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Subscribe to receive early access to new seasonal collections.</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                style={{
                                    background: 'transparent', border: '1px solid var(--border-gold)', padding: '15px 25px',
                                    color: 'white', width: '300px', outline: 'none'
                                }}
                            />
                            <button className="btn-luxury">Join</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default HomePage;
