import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext, AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Identity authentication required for Order placement.');
            return navigate('/login');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const items = cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price,
                size: item.size
            }));

            // 1. Create Order on Backend (which creates Razorpay order)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`,
                { items, totalAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { order, razorpayOrder } = res.data;

            if (!window.Razorpay) {
                throw new Error('Razorpay Secure Module is not loaded. Please verify your internet connection and refresh the page.');
            }

            if (!razorpayOrder) {
                throw new Error('No Razorpay sequence generated. Backend archive error.');
            }

            // 2. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Diamond Maison",
                description: "Sustainable Luxury Acquisition",
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    setLoading(true);
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/verify-payment`,
                            response,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyRes.status === 200) {
                            clearCart();
                            toast.success('Acquisition Confirmed. Your piece is being archived.');
                            navigate('/orders');
                        }
                    } catch (err) {
                        toast.error('Verification failed: ' + (err.response?.data?.message || err.message));
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email
                },
                theme: { color: "#d4af37" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Acquisition Interrupted: ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Checkout Error:', error);
            const errMsg = error.response?.data?.message || error.message;
            toast.error('Vault synchronization failed: ' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', flex: 1, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="glitter-text" style={{ fontSize: '3rem', margin: '0', fontStyle: 'italic', display: 'inline-block' }}>Shopping Vault</h2>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '10px' }}>Your Selected Collection Pieces</p>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-gold)', background: 'rgba(255,255,255,0.02)' }}
                    >
                        <h3 style={{ fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Your vault is currently vacant.</h3>
                        <button onClick={() => navigate('/shop')} className="btn-luxury" style={{ width: 'auto', padding: '12px 40px' }}>
                            EXPLORE THE BOUTIQUE
                        </button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={item._id + item.size}
                                className="glass-morphism"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    border: '1px solid var(--border-gold)',
                                    gap: '1.5rem'
                                }}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${item.images?.[0] || item.image}`}
                                    alt={item.name}
                                    style={{ width: '80px', height: '100px', objectFit: 'cover', border: '1px solid var(--border-gold)' }}
                                />
                                <div style={{ flex: '1 1 200px' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '1.2rem', fontStyle: 'italic' }}>{item.name}</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                                        <span>Qty: {item.quantity}</span>
                                        {item.size && <span style={{ color: 'var(--primary-gold)' }}>Dim: {item.size}</span>}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flex: '1 1 100px' }}>
                                    <p style={{ fontWeight: 'bold', color: 'var(--text-light)', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display' }}>₹{item.price * item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                                    >
                                        REVERT
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        <div className="luxury-card" style={{ padding: '3rem', marginTop: '3rem', textAlign: 'right' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Subtotal Value</span>
                                <h3 style={{ margin: '10px 0 0', fontSize: '2.5rem', color: 'var(--primary-gold)', fontFamily: 'Playfair Display' }}>₹{totalAmount}</h3>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                disabled={loading}
                                className="btn-luxury"
                                style={{ width: 'auto', padding: '18px 60px', fontSize: '1rem' }}
                            >
                                {loading ? 'ARCHIVING...' : 'SECURE ACQUISITION'}
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
