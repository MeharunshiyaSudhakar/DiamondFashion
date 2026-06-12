import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, { username, email, password });
            login(res.data.user, res.data.token);
            toast.success('Account created successfully.');
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Join us for a faster checkout experience.</p>
                    </div>

                    {error && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', background: 'rgba(231, 76, 60, 0.1)', padding: '10px', borderRadius: '4px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Full Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '14px', width: '100%', outline: 'none', borderRadius: '4px' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
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
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>CREATE ACCOUNT</button>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'underline', marginLeft: '5px', fontWeight: '600' }}>Log In</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;
