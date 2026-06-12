import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
            login(res.data.user, res.data.token);
            toast.success('Logged in successfully.');
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
                    className="auth-form"
                    style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)', padding: '3.5rem', width: '100%' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <Link to="/home" style={{ fontSize: '1.8rem', textDecoration: 'none', fontWeight: '700', fontFamily: 'Playfair Display', display: 'block', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            DIAMOND FASHION
                        </Link>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Log In</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Access your account to manage orders.</p>
                    </div>

                    {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', background: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '4px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '14px', width: '100%', outline: 'none', borderRadius: '4px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '14px', width: '100%', outline: 'none', borderRadius: '4px' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>LOG IN</button>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            New here? <Link to="/signup" style={{ color: 'var(--text-primary)', textDecoration: 'underline', marginLeft: '5px', fontWeight: '600' }}>Create an Account</Link>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/home" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>← Back to Store</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
