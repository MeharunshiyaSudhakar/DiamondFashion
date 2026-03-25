import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            login(res.data.user, res.data.token);
            toast.success('Access Granted to the Vault.');
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="auth-form glass-morphism"
                    style={{ border: '1px solid var(--border-gold)', padding: '3.5rem', width: '100%' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <Link to="/home" className="logo glitter-text" style={{ fontSize: '1.8rem', textDecoration: 'none', fontWeight: '400', fontFamily: 'Playfair Display', fontStyle: 'italic', display: 'block', marginBottom: '1.5rem', whiteSpace: 'nowrap' }}>
                            DIAMOND FASHION
                        </Link>
                        <h2 style={{ fontSize: '2rem', fontWeight: '400', fontStyle: 'italic', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Boutique Access</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '1px' }}>Enter the world of high-end fashion.</p>
                    </div>

                    {error && <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8rem', background: 'rgba(255, 107, 107, 0.1)', padding: '10px', borderRadius: '2px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Identity / Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', color: 'white', padding: '14px', width: '100%', outline: 'none', borderRadius: '1px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label style={{ color: 'var(--primary-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', color: 'white', padding: '14px', width: '100%', outline: 'none', borderRadius: '1px' }}
                            />
                        </div>
                        <button type="submit" className="btn-luxury" style={{ width: '100%', padding: '16px' }}>Authenticate</button>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            New to the Maison? <Link to="/signup" style={{ color: 'var(--primary-gold)', textDecoration: 'none', marginLeft: '5px' }}>Register Privilege</Link>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/home" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>← Return to Boutique</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
