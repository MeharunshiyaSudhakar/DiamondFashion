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
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalAmount = subTotal - (subTotal * discount / 100);

    const handleApplyCoupon = async () => {
        if(!couponCode) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/coupons/validate`, { code: couponCode });
            setDiscount(res.data.discountPercentage);
            toast.success(`Coupon applied! ${res.data.discountPercentage}% OFF`);
        } catch (error) {
            setDiscount(0);
            toast.error(error.response?.data?.message || 'Invalid coupon');
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please log in to checkout.');
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

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
                { items, totalAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { order, razorpayOrder } = res.data;

            if (!window.Razorpay) {
                throw new Error('Payment module not loaded. Please refresh the page.');
            }

            if (!razorpayOrder) {
                throw new Error('Error initiating payment.');
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "DIAMOND FASHION",
                description: "Order Checkout",
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    setLoading(true);
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/verify-payment`,
                            response,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verifyRes.status === 200) {
                            clearCart();
                            toast.success('Order placed successfully.');
                            navigate('/orders');
                        }
                    } catch (err) {
                        toast.error('Payment verification failed: ' + (err.response?.data?.message || err.message));
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email
                },
                theme: { color: "#000000" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Payment failed: ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Checkout Error:', error);
            const errMsg = error.response?.data?.message || error.message;
            toast.error('Checkout failed: ' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: '1000px', margin: '0 auto', flex: 1, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0', fontWeight: '700', color: 'var(--text-primary)' }}>Your Cart</h2>
                    <p style={{ color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '10px' }}>Review your selected items</p>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: '500' }}>Your cart is empty.</h3>
                        <button onClick={() => navigate('/shop')} className="btn-primary auto-width">
                            CONTINUE SHOPPING
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 2 }}>
                            {cart.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={item._id + item.size}
                                    className="cart-item"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: '1.5rem',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-primary)',
                                        borderRadius: '8px',
                                        gap: '1.5rem'
                                    }}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.images?.[0] || item.image}`}
                                        alt={item.name}
                                        className="cart-item-image"
                                        style={{ width: '100px', height: '120px', objectFit: 'cover', background: 'var(--bg-secondary)' }}
                                    />
                                    <div className="cart-item-details" style={{ flex: '1 1 auto' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>{item.name}</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                                            <span>Qty: {item.quantity}</span>
                                            {item.size && <span style={{ color: 'var(--text-primary)' }}>Size: {item.size}</span>}
                                        </div>
                                    </div>
                                    <div className="cart-item-actions" style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>₹{item.price * item.quantity}</p>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', padding: 0 }}
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ flex: 1, padding: '2.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '8px', position: 'sticky', top: '100px' }}>
                                <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0' }}>Order Summary</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                    <span>₹{subTotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                    <span>Free</span>
                                </div>
                                {discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#2ecc71' }}>
                                        <span>Discount ({discount}%)</span>
                                        <span>-₹{(subTotal * discount / 100).toFixed(0)}</span>
                                    </div>
                                )}
                                <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>₹{totalAmount.toFixed(0)}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Coupon Code" 
                                        value={couponCode} 
                                        onChange={(e) => setCouponCode(e.target.value)} 
                                        style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }} 
                                    />
                                    <button onClick={handleApplyCoupon} className="btn-secondary" style={{ padding: '10px 20px', width: 'auto' }}>Apply</button>
                                </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? 'PROCESSING...' : 'CHECKOUT'}
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
