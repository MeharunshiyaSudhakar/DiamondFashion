import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, CreditCard, Box } from 'lucide-react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/mine`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return { color: '#81c784', background: 'rgba(76,175,80,0.1)' };
            case 'Shipped': return { color: '#64b5f6', background: 'rgba(33,150,243,0.1)' };
            case 'Delivered': return { color: '#a5d6a7', background: 'rgba(129,199,132,0.2)' };
            case 'Cancelled': return { color: '#ef5350', background: 'rgba(244,67,54,0.1)' };
            default: return { color: 'var(--primary-gold)', background: 'rgba(212,175,55,0.1)' };
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)', color: 'var(--text-light)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', flex: 1, width: '100%' }}>

                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 className="glitter-text" style={{ fontSize: '3.5rem', margin: '0 0 10px', fontStyle: 'italic', display: 'inline-block' }}>Acquisition Archives</h2>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.7rem' }}>A History of Your Selected Pieces</p>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-gold)', background: 'rgba(212,175,55,0.02)' }}
                    >
                        <Package size={60} style={{ color: 'var(--border-gold)', opacity: 0.3, marginBottom: '20px' }} />
                        <h3 style={{ fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--text-muted)' }}>The archives are vacant.</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px' }}>Your journey through excellence begins in the boutique.</p>
                        <button onClick={() => window.location.href = '/shop'} className="btn-luxury" style={{ width: 'auto', padding: '12px 40px' }}>EXPLORE COLLECTIONS</button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order._id}
                                className="glass-morphism"
                                style={{
                                    padding: '2.5rem',
                                    border: '1px solid var(--border-gold)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Status Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 5px' }}>Acquisition ID</p>
                                            <p style={{ color: 'var(--text-light)', fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order._id.slice(-12).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 5px' }}>Sealed On</p>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 5px' }}>Acquisition Value</p>
                                            <p style={{ color: 'var(--primary-gold)', fontSize: '1.4rem', fontWeight: '700', fontFamily: 'Playfair Display' }}>₹{order.totalAmount}</p>
                                        </div>
                                        <div style={{
                                            padding: '8px 18px',
                                            ...getStatusStyle(order.status),
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            {order.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />} {order.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    {order.items.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(212,175,55,0.1)' }}>
                                            <div style={{ width: '80px', height: '100px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${item.product?.images?.[0] || item.product?.image}`}
                                                    alt={item.product?.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px', color: 'var(--text-light)', fontStyle: 'italic', fontSize: '1.1rem' }}>{item.product?.name}</h4>
                                                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.size && <span>Dim: {item.size}</span>}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 0' }}>
                                                    <p style={{ color: 'var(--primary-gold)', fontSize: '0.9rem', fontWeight: '600' }}>₹{item.price}</p>
                                                    <button
                                                        onClick={() => {
                                                            // We'll import addToCart later or use direct state update if needed
                                                            // For now, let's just make it call the shop
                                                            window.location.href = `/product/${item.product?._id}`;
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer', fontSize: '0.6rem', textDecoration: 'underline', letterSpacing: '2px' }}
                                                    >
                                                        RE-ARCHIVE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Logic Footer */}
                                <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(212,175,55,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        <CreditCard size={16} />
                                        <span>Payment Status: <strong style={{ color: order.paymentStatus === 'Paid' ? '#81c784' : 'var(--text-light)' }}>{order.paymentStatus}</strong></span>
                                        {order.razorpayPaymentId && <span style={{ marginLeft: '10px', fontSize: '0.65rem', opacity: 0.5 }}>ID: {order.razorpayPaymentId}</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        <Box size={16} />
                                        <span>Shipping: Standard Archival Courier</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrdersPage;
