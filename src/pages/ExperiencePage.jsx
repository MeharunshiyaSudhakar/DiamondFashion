import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Monitor, Compass, Download } from 'lucide-react';

const ExperiencePage = () => {
    const navigate = useNavigate();
    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)', color: 'var(--text-light)' }}>
            <Navbar />

            <div style={{ padding: '6rem 8%', maxWidth: '1400px', margin: '0 auto', flex: 1, textAlign: 'center' }}>
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{ marginBottom: '5rem' }}
                >
                    <h1 className="glitter-text" style={{ fontSize: 'min(5rem, 12vw)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                        Maison Virtual Tour
                    </h1>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.8rem', maxWidth: '700px', margin: '0 auto', lineHeight: '2' }}>
                        Step into the digital dimension of Diamond. An immersive 360° architectural exploration of our flagship nocturnal archive.
                    </p>
                </motion.header>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-morphism"
                        style={{ padding: '4rem 3rem', border: '1px solid var(--border-gold)', textAlign: 'center', background: 'rgba(212,175,41,0.05)' }}
                    >
                        <Compass size={60} style={{ color: 'var(--primary-gold)', marginBottom: '2rem' }} />
                        <h3 style={{ fontSize: '2rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--primary-gold)' }}>Maison Immersion Portal</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '3rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 3rem' }}>
                            Experience the full architectural scale of Diamond Fashion directly in your browser. Optimized for both desktop precision and mobile fluidity.
                        </p>
                        <button
                            onClick={() => navigate('/virtual-tour')}
                            className="btn-luxury"
                            style={{ padding: '20px 60px', fontSize: '1rem', letterSpacing: '4px' }}
                        >
                            ENTER THE ARCHIVE
                        </button>
                    </motion.div>
                </div>

                {/* Technical requirement Footer */}
                <div style={{ marginTop: '6rem', opacity: 0.5, fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
                    Interactive 360° Rendering • Web-Optimized for Mobile & Desktop
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExperiencePage;
