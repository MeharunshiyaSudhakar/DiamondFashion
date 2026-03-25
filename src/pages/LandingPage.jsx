import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 3000); // Slightly longer for premium feel

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ backgroundColor: '#1a1d14', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ textAlign: 'center' }}
            >
                <motion.h1
                    className="glitter-text"
                    animate={{ letterSpacing: ['5px', '12px', '5px'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: 'min(8vw, 3.5rem)', fontWeight: '300', fontFamily: 'Playfair Display', fontStyle: 'italic', margin: 0, whiteSpace: 'nowrap' }}
                >
                    DIAMOND FASHION
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ height: '1px', background: 'var(--primary-gold)', marginTop: '10px' }}
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.7rem', marginTop: '15px' }}
                >
                    Boutique Excellence
                </motion.p>
            </motion.div>

            {/* Subtle background glow */}
            <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-gold) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }}
            />
        </div>
    );
};

export default LandingPage;
