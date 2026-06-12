import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, CreditCard, Box, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

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
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/mine`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const handleReturnRequest = async (orderId) => {
        if (!window.confirm('Are you sure you want to request a return for this order?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Return requested successfully');
            fetchOrders();
        } catch (error) {
            console.error('Failed to request return', error);
            toast.error(error.response?.data?.message || 'Failed to request return');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return { color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)' };
            case 'Shipped': return { color: '#3498db', background: 'rgba(52, 152, 219, 0.1)' };
            case 'Delivered': return { color: '#27ae60', background: 'rgba(39, 174, 96, 0.2)' };
            case 'Cancelled': return { color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)' };
            default: return { color: 'var(--text-primary)', background: 'var(--bg-secondary)' };
        }
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />
            <div style={{ padding: '2rem 4%', maxWidth: 'var(--content-max-width)', margin: '0 auto', flex: 1, width: '100%' }}>

                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', margin: '0 0 10px', fontWeight: '700', display: 'inline-block' }}>Your Orders</h2>
                    <p style={{ color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Order History</p>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                    >
                        <Package size={60} style={{ color: 'var(--border-color)', marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '600' }}>You haven't placed any orders.</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>Start shopping to see your orders here.</p>
                        <button onClick={() => window.location.href = '/shop'} className="btn-primary" style={{ width: 'auto', padding: '12px 40px' }}>START SHOPPING</button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order._id}
                                style={{
                                    padding: '2.5rem',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '3rem' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px' }}>Order ID</p>
                                            <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: '600' }}>#{order._id.slice(-12).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px' }}>Order Date</p>
                                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px' }}>Order Total</p>
                                            <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '700' }}>₹{order.totalAmount}</p>
                                        </div>
                                        <div style={{
                                            padding: '8px 18px',
                                            ...getStatusStyle(order.status),
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            {order.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />} {order.status}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    {order.items.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'var(--bg-primary)', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                            <div style={{ width: '80px', height: '100px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.product?.images?.[0] || item.product?.image}`}
                                                    alt={item.product?.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>{item.product?.name}</h4>
                                                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.size && <span>Size: {item.size}</span>}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0 0' }}>
                                                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700' }}>₹{item.price}</p>
                                                    <button
                                                        onClick={() => {
                                                            window.location.href = `/product/${item.product?._id}`;
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', letterSpacing: '1px', fontWeight: '600' }}
                                                    >
                                                        BUY AGAIN
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <CreditCard size={18} />
                                        <span>Payment: <strong style={{ color: order.paymentStatus === 'Paid' ? '#2ecc71' : 'var(--text-primary)' }}>{order.paymentStatus}</strong></span>
                                        {order.razorpayPaymentId && <span style={{ marginLeft: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {order.razorpayPaymentId}</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            <Box size={18} />
                                            <span>Shipping: Standard Delivery</span>
                                        </div>
                                        {order.status === 'Delivered' && (!order.returnStatus || order.returnStatus === 'Not Returned') && (
                                            <button onClick={() => handleReturnRequest(order._id)} className="btn-secondary" style={{ padding: '6px 15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <RotateCcw size={14} /> Request Return
                                            </button>
                                        )}
                                        {order.returnStatus && order.returnStatus !== 'Not Returned' && (
                                            <div style={{ padding: '6px 15px', fontSize: '0.8rem', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', borderRadius: '20px', fontWeight: 'bold' }}>
                                                {order.returnStatus}
                                            </div>
                                        )}
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
