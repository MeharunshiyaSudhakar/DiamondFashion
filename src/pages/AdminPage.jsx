import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const AdminPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });

            if (res.data.user.role !== 'admin') {
                setError('AUTHENTICATION FAILED: Restricted Access Only.');
                setLoading(false);
                return;
            }

            login(res.data.user, res.data.token);
            navigate('/admin-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'CRITICAL ERROR: Connection Terminated.');
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{
            backgroundColor: 'var(--bg-deep-olive)',
            color: 'var(--text-light)',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)', borderRadius: '50%' }} />

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="admin-glass"
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        padding: '4rem 3.5rem',
                        border: '1px solid var(--border-gold)',
                        position: 'relative',
                        zIndex: 10,
                        textAlign: 'center'
                    }}
                >
                    {/* Return Link */}
                    <button
                        onClick={() => navigate('/home')}
                        style={{ position: 'absolute', top: '20px', left: '25px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', letterSpacing: '2px' }}
                    >
                        <ArrowLeft size={14} /> MAISON
                    </button>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginBottom: '3rem' }}
                    >
                        <ShieldCheck size={50} color="var(--primary-gold)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.3))' }} />
                        <h2 className="glitter-text" style={{ fontSize: '2.5rem', margin: '0 0 10px', fontStyle: 'italic', fontWeight: '400' }}>Curator Vault</h2>
                        <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.65rem' }}>Restricted Archives Access</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{
                                marginBottom: '2rem',
                                padding: '12px',
                                border: '1px solid rgba(255,107,107,0.3)',
                                background: 'rgba(255,107,107,0.05)',
                                color: '#ff6b6b',
                                fontSize: '0.7rem',
                                letterSpacing: '1px'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-gold)', opacity: 0.7 }} />
                            <input
                                type="email"
                                placeholder="CURATOR IDENTIFIER"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 45px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-gold)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.8rem',
                                    letterSpacing: '2px',
                                    transition: '0.3s'
                                }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-gold)', opacity: 0.7 }} />
                            <input
                                type="password"
                                placeholder="ACCESS PROTOCOL"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 45px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-gold)',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.8rem',
                                    letterSpacing: '2px',
                                    transition: '0.3s'
                                }}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="btn-luxury"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '18px',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                        >
                            {loading ? (
                                'SYNCHRONIZING...'
                            ) : (
                                <>
                                    ENTER THE VAULT <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Authorized Personnel Only <br />
                            <span style={{ opacity: 0.5 }}>Diamond Maison © 2026 Archive System</span>
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AdminPage;

