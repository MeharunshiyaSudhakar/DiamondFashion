import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ textAlign: 'center', zIndex: 1 }}
            >
                <motion.h1
                    animate={{ letterSpacing: ['2px', '8px', '2px'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: 'min(8vw, 3.5rem)', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--accent-color)', margin: 0, whiteSpace: 'nowrap' }}
                >
                    STORE
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ height: '1px', background: 'var(--accent-color)', marginTop: '10px' }}
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '5px', fontSize: '0.7rem', marginTop: '15px' }}
                >
                    Modern Essentials
                </motion.p>
            </motion.div>

            {/* Subtle background glow */}
            <motion.div
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }}
            />
        </div>
    );
};

export default LandingPage;
