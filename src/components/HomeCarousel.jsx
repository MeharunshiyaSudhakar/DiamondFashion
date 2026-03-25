import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeCarousel = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarousel = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/carousel`);
                setItems(res.data);
            } catch (error) {
                console.error('Carousel fetch failed');
            }
        };
        fetchCarousel();
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % items.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [items]);

    if (items.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    return (
        <section style={{
            position: 'relative',
            height: '350px',
            width: '88%',
            margin: '10px auto',
            overflow: 'hidden',
            background: '#000',
            borderRadius: '24px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            border: '1px solid rgba(212,175,55,0.1)'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${import.meta.env.VITE_API_URL}${items[currentIndex].backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)'
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 8%' }}>
                        <motion.span
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{ color: 'var(--primary-gold)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
                        >
                            ARCHIVAL REVELATIONS
                        </motion.span>
                        <motion.h2
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ fontSize: 'min(6vw, 2.5rem)', color: 'white', fontStyle: 'italic', margin: '0 0 1rem', fontWeight: '400' }}
                        >
                            {items[currentIndex].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem', fontWeight: '300', lineHeight: '1.5' }}
                        >
                            {items[currentIndex].description}
                        </motion.p>
                        <motion.button
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => navigate(items[currentIndex].link || '/shop')}
                            className="btn-luxury"
                            style={{ padding: '12px 30px', fontSize: '0.75rem' }}
                        >
                            Explore Now
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', zIndex: 20, opacity: 0.6 }}
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <button
                        onClick={nextSlide}
                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', zIndex: 20, opacity: 0.6 }}
                    >
                        <ChevronRight size={36} />
                    </button>
                </>
            )}

            {/* Indicators */}
            <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px', zIndex: 20 }}>
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '30px' : '10px',
                            height: '2px',
                            background: idx === currentIndex ? 'var(--primary-gold)' : 'rgba(255,255,255,0.3)',
                            transition: '0.4s',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default HomeCarousel;
