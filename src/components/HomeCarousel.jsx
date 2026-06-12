import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomeCarousel = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarousel = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/carousel`);
                setItems(res.data.slice(0, 5));
            } catch (error) {
                console.error('Carousel fetch failed');
            }
        };
        fetchCarousel();
    }, []);

    // Auto-play animation every 5 seconds
    useEffect(() => {
        if (items.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % items.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [items]);

    if (items.length === 0) return null;

    return (
        <section style={{
            position: 'relative',
            height: '90vh',
            width: '100%',
            overflow: 'hidden',
            background: '#000',
        }}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ x: '100%', opacity: 0.8 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0.8 }}
                    transition={{ type: 'tween', duration: 0.8, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${items[currentIndex].backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 100%)'
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 8%', width: '100%' }}>
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{ color: '#ffffff', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
                        >
                            FEATURED COLLECTION
                        </motion.span>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ fontSize: 'min(10vw, 4.5rem)', color: 'white', fontStyle: 'italic', margin: '0 0 1rem', fontWeight: '400', letterSpacing: '-1px' }}
                        >
                            {items[currentIndex].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto', fontWeight: '300', lineHeight: '1.5' }}
                        >
                            {items[currentIndex].description}
                        </motion.p>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            onClick={() => navigate(items[currentIndex].link || '/shop')}
                            className="btn-primary"
                            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                        >
                            Explore Now
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div style={{ position: 'absolute', bottom: '30px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 20 }}>
                {items.map((_, i) => (
                    <div 
                        key={i} 
                        onClick={() => setCurrentIndex(i)}
                        style={{ 
                            width: currentIndex === i ? '30px' : '8px', 
                            height: '4px', 
                            borderRadius: '2px',
                            background: currentIndex === i ? 'white' : 'rgba(255,255,255,0.4)', 
                            transition: 'all 0.3s', 
                            cursor: 'pointer' 
                        }} 
                    />
                ))}
            </div>
        </section>
    );
};

export default HomeCarousel;
