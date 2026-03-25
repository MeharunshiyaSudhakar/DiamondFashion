import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingBag, Package, TrendingUp, Bell, Image, Trash2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState({ day: 0, month: 0, totalOrders: 0, pendingOrders: 0 });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, orders, broadcast, carousel
    const [carouselItems, setCarouselItems] = useState([]);
    const [carouselForm, setCarouselForm] = useState({ title: '', description: '', link: '', order: 0, isActive: 'true' });
    const [carouselImage, setCarouselImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', materials: '', segment: 'women', category: 't-shirts', season: 'All-Season'
    });
    const [images, setImages] = useState([]);
    const [sizes, setSizes] = useState([
        { size: 'S', stock: 0, selected: false },
        { size: 'M', stock: 0, selected: false },
        { size: 'L', stock: 0, selected: false },
        { size: 'XL', stock: 0, selected: false },
        { size: 'XXL', stock: 0, selected: false }
    ]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAnalytics();
        fetchOrders();
        fetchCarousel();
    }, []);

    const fetchCarousel = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/carousel/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarouselItems(res.data);
        } catch (error) {
            console.error('Carousel Fetch Error');
        }
    };

    const handleCarouselUpload = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(carouselForm).forEach(key => data.append(key, carouselForm[key]));
        if (carouselImage) data.append('image', carouselImage);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/carousel`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Archival Banner dispatched successfully!');
            setCarouselForm({ title: '', description: '', link: '', order: 0, isActive: 'true' });
            setCarouselImage(null);
            fetchCarousel();
        } catch (error) {
            toast.error('Dispatch Failure');
        }
    };

    const deleteCarouselItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/carousel/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Banner removed from archive.');
            fetchCarousel();
        } catch (error) {
            toast.error('Deletion failure');
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(res.data);
        } catch (error) {
            console.error('Analytics Error');
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Orders Fetch Error');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
            fetchAnalytics();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (images.length === 0) return setMessage('Imagery is mandatory for the archive.');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        Array.from(images).forEach(image => data.append('images', image));
        const selectedSizes = sizes.filter(s => s.selected).map(({ size, stock }) => ({ size, stock }));
        data.append('sizes', JSON.stringify(selectedSizes));

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/products/upload`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Collection Piece successfully archived in the Vault!');
            setFormData({ name: '', description: '', price: '', materials: '', segment: 'women', category: 't-shirts' });
            setImages([]);
            setSizes(sizes.map(s => ({ ...s, selected: false, stock: 0 })));
        } catch (error) {
            setMessage(`Protocol Failure: ${error.response?.data?.message || error.message}`);
        }
    };

    const chartData = [
        { name: 'Daily Revenue', value: analytics.day },
        { name: 'Monthly Revenue', value: analytics.month },
        { name: 'Total Acquisitions', value: analytics.totalOrders },
        { name: 'Pending Archives', value: analytics.pendingOrders },
    ];

    const inputStyle = {
        width: '100%', padding: '16px', border: '1px solid var(--border-gold)', background: 'rgba(255,255,255,0.03)', color: 'white', outline: 'none', fontSize: '0.85rem', letterSpacing: '1px'
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-deep-olive)', color: 'var(--text-light)' }}>
            <Navbar />

            <div style={{ padding: '2rem 4%', flex: 1, maxWidth: 'var(--content-max-width)', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glitter-text"
                        style={{ fontSize: 'min(4rem, 10vw)', margin: '0 0 1rem', fontStyle: 'italic', display: 'inline-block' }}
                    >
                        Curator Control Center
                    </motion.h2>
                    <p style={{ color: 'var(--text-muted)', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.7rem' }}>Authorized Archive Management</p>
                </header>

                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1rem', overflowX: 'auto' }}>
                    {[
                        { id: 'analytics', label: 'Vault Analytics', icon: <TrendingUp size={16} /> },
                        { id: 'orders', label: 'Order Archive', icon: <ShoppingBag size={16} /> },
                        { id: 'products', label: 'Curate Collection', icon: <Package size={16} /> },
                        { id: 'broadcast', label: 'Broadcaster', icon: <Bell size={16} /> },
                        { id: 'carousel', label: 'Carousel Manager', icon: <Image size={16} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: activeTab === tab.id ? 'var(--primary-gold)' : 'var(--text-muted)',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                borderBottom: activeTab === tab.id ? '2px solid var(--primary-gold)' : '2px solid transparent',
                                transition: '0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* 1. Analytics Section */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}
                        >
                            {/* Stats Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                                <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Daily Vault Revenue</p>
                                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-gold)', margin: '15px 0' }}>₹{analytics.day}</h3>
                                </div>
                                <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Monthly Revenue</p>
                                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-gold)', margin: '15px 0' }}>₹{analytics.month}</h3>
                                </div>
                                <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Total Deliveries</p>
                                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-gold)', margin: '15px 0' }}>{analytics.totalOrders}</h3>
                                </div>
                                <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Pending Verifications</p>
                                    <h3 style={{ fontSize: '2rem', color: '#ff6b6b', margin: '15px 0' }}>{analytics.pendingOrders}</h3>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="glass-morphism" style={{ padding: '2rem', border: '1px solid var(--border-gold)', minHeight: '400px' }}>
                                <h4 style={{ color: 'var(--primary-gold)', marginBottom: '2rem', fontStyle: 'italic', letterSpacing: '2px' }}>Visual Logistics Portfolio</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
                                        <YAxis stroke="var(--text-muted)" fontSize={10} tick={{ fill: 'var(--text-muted)' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-mid-olive)', border: '1px solid var(--primary-gold)', borderRadius: '2px' }}
                                            itemStyle={{ color: 'var(--primary-gold)' }}
                                        />
                                        <Bar dataKey="value" fill="var(--primary-gold)">
                                            {chartData.map((entry, index) => (
                                                <Cell key={index} fill={index % 2 === 0 ? 'var(--primary-gold)' : 'var(--accent-gold)'} opacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. Orders Archive */}
                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="glass-morphism"
                            style={{ padding: '3rem', border: '1px solid var(--border-gold)' }}
                        >
                            <h3 style={{ color: 'var(--primary-gold)', marginBottom: '3rem', fontStyle: 'italic', fontSize: '2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1rem' }}>Logistics Registry</h3>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--primary-gold)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                            <th style={{ padding: '20px', textAlign: 'left' }}>Order ID</th>
                                            <th style={{ padding: '20px', textAlign: 'left' }}>Client</th>
                                            <th style={{ padding: '20px', textAlign: 'left' }}>Value</th>
                                            <th style={{ padding: '20px', textAlign: 'left' }}>Payment</th>
                                            <th style={{ padding: '20px', textAlign: 'left' }}>Maison Status</th>
                                            <th style={{ padding: '20px', textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} style={{ borderBottom: '1px solid rgba(212,175,55,0.1)', transition: '0.3s' }}>
                                                <td style={{ padding: '20px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{order._id.slice(-8)}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ fontWeight: '600' }}>{order.user?.username}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                                                </td>
                                                <td style={{ padding: '20px', color: 'var(--primary-gold)', fontWeight: '700' }}>₹{order.totalAmount}</td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '2px',
                                                        background: order.paymentStatus === 'Paid' ? 'rgba(76,175,80,0.1)' : 'rgba(255,107,107,0.1)',
                                                        color: order.paymentStatus === 'Paid' ? '#81c784' : '#ff8a80',
                                                        fontSize: '0.7rem',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        style={{ background: 'transparent', border: '1px solid var(--border-gold)', color: 'white', padding: '6px', fontSize: '0.75rem' }}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => alert('Detailed view coming soon')}
                                                        style={{ background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)', padding: '6px 15px', cursor: 'pointer', fontSize: '0.7rem' }}
                                                    >
                                                        VIEW ARCHIVE
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* 3. Curate Collection (Products) */}
                    {activeTab === 'products' && (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-morphism"
                            style={{ padding: '3rem', border: '1px solid var(--border-gold)', maxWidth: '900px', margin: '0 auto' }}
                        >
                            <h3 style={{ color: 'var(--primary-gold)', marginBottom: '3rem', fontStyle: 'italic', fontSize: '2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1rem' }}>Archive New Piece</h3>
                            {message && <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{
                                    padding: '15px', border: '1px solid currentColor', marginBottom: '30px', textAlign: 'center', fontSize: '0.9rem',
                                    color: message.includes('success') ? 'var(--primary-gold)' : '#ff6b6b',
                                    background: message.includes('success') ? 'rgba(212,175,55,0.05)' : 'rgba(255,107,107,0.05)'
                                }}>{message}</motion.div>}

                            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Piece Name</label>
                                        <input type="text" placeholder="e.g. Midnight Silk T-Shirt" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Acquisition Value (₹)</label>
                                        <input type="number" placeholder="5999" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Archival Narrative</label>
                                    <textarea placeholder="Describe the soul of this piece..." required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, height: '120px', resize: 'none' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Maison Section</label>
                                        <select value={formData.segment} onChange={e => setFormData({ ...formData, segment: e.target.value })} style={inputStyle}>
                                            <option value="women">Elite Women</option>
                                            <option value="men">Boutique Men</option>
                                            <option value="girls">Royal Girls</option>
                                            <option value="boys">Royal Boys</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Category Portfolio</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                                            <option value="t-shirts">T-Shirts Portfolio</option>
                                            <option value="night-pants">Night-Pants Lounge</option>
                                            <option value="suits">Tailored Suits</option>
                                            <option value="accessories">Prestige Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'block' }}>Seasonal Cycle</label>
                                        <select value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })} style={inputStyle}>
                                            <option value="All-Season">All-Season Archive</option>
                                            <option value="Spring">Spring Collection</option>
                                            <option value="Summer">Summer Collection</option>
                                            <option value="Autumn">Autumn Collection</option>
                                            <option value="Winter">Winter Collection</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(212,175,55,0.02)', padding: '2rem', border: '1px solid var(--border-gold)' }}>
                                    <h4 style={{ color: 'var(--primary-gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Package size={16} /> Dimension & Inventory Deployment
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                        {sizes.map((s, idx) => (
                                            <div key={s.size} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: s.selected ? 'rgba(212,175,55,0.05)' : 'transparent', padding: '15px', border: '1px solid var(--border-gold)', minWidth: '120px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input type="checkbox" checked={s.selected} onChange={() => {
                                                        const newSizes = [...sizes];
                                                        newSizes[idx].selected = !newSizes[idx].selected;
                                                        setSizes(newSizes);
                                                    }} />
                                                    <span style={{ fontWeight: '700' }}>{s.size}</span>
                                                </div>
                                                {s.selected && (
                                                    <input
                                                        type="number"
                                                        placeholder="Stock qty"
                                                        value={s.stock}
                                                        onChange={(e) => {
                                                            const newSizes = [...sizes];
                                                            newSizes[idx].stock = parseInt(e.target.value) || 0;
                                                            setSizes(newSizes);
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--primary-gold)', color: 'white', fontSize: '0.8rem', outline: 'none' }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ border: '1px dashed var(--border-gold)', padding: '3rem', textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
                                    <Image size={40} style={{ color: 'var(--primary-gold)', opacity: 0.3, marginBottom: '15px' }} />
                                    <p style={{ margin: '0 0 15px', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px' }}>DEPOSIT VISUAL ARCHIVES (MAX 5 IMAGES)</p>
                                    <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', border: 'none', background: 'transparent' }} />
                                </div>

                                <button type="submit" className="btn-luxury" style={{ padding: '20px' }}>INITIALIZE ARCHIVAL UPLOAD</button>
                            </form>
                        </motion.div>
                    )}

                    {/* 4. Broadcaster */}
                    {activeTab === 'broadcast' && (
                        <motion.div
                            key="broadcast"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="glass-morphism"
                            style={{ padding: '4rem', border: '1px solid var(--border-gold)', maxWidth: '800px', margin: '0 auto' }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                <Bell size={50} style={{ color: 'var(--primary-gold)', marginBottom: '2rem' }} />
                                <h3 style={{ color: 'var(--primary-gold)', fontSize: '2.5rem', fontStyle: 'italic', marginBottom: '1rem' }}>Vault Broadcaster</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Dispatch global synchronizations to all clients</p>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const msgText = e.target.elements.message.value;
                                if (!msgText) return;
                                try {
                                    const token = localStorage.getItem('token');
                                    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/notify-all`, { message: msgText }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    toast.success('Broadcast delivered successfully!');
                                    e.target.reset();
                                } catch (error) {
                                    toast.error('Dispatch failed');
                                }
                            }}>
                                <div style={{ marginBottom: '3rem' }}>
                                    <textarea
                                        name="message"
                                        required
                                        placeholder="Enter the transmission message here..."
                                        style={{ ...inputStyle, height: '150px', fontSize: '1.2rem', padding: '2rem', textAlign: 'center' }}
                                    />
                                </div>
                                <button type="submit" className="btn-luxury" style={{ width: '100%', padding: '20px' }}>DISPATCH GLOBAL TRANSMISSION</button>
                            </form>
                        </motion.div>
                    )}
                    {/* 5. Carousel Manager */}
                    {activeTab === 'carousel' && (
                        <motion.div
                            key="carousel"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="glass-morphism" style={{ padding: '3rem', border: '1px solid var(--border-gold)', marginBottom: '3rem' }}>
                                <h3 style={{ color: 'var(--primary-gold)', marginBottom: '2rem', fontStyle: 'italic', fontSize: '1.5rem' }}>Upload New Archive Banner</h3>
                                <form onSubmit={handleCarouselUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Archives Title</label>
                                        <input type="text" placeholder="e.g. THE NIGHT ARCHIVE" required value={carouselForm.title} onChange={e => setCarouselForm({ ...carouselForm, title: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Archival Narrative</label>
                                        <textarea placeholder="Tell the soul of this banner..." required value={carouselForm.description} onChange={e => setCarouselForm({ ...carouselForm, description: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Navigation Destination (URL/Link)</label>
                                        <input type="text" placeholder="/shop" value={carouselForm.link} onChange={e => setCarouselForm({ ...carouselForm, link: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Sequence Order</label>
                                        <input type="number" value={carouselForm.order} onChange={e => setCarouselForm({ ...carouselForm, order: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Status Registry</label>
                                        <select value={carouselForm.isActive} onChange={e => setCarouselForm({ ...carouselForm, isActive: e.target.value })} style={inputStyle}>
                                            <option value="true">ACTIVE</option>
                                            <option value="false">ARCHIVED (HIDDEN)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'var(--primary-gold)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Background Imagery</label>
                                        <input type="file" required={!carouselImage} onChange={e => setCarouselImage(e.target.files[0])} style={inputStyle} />
                                    </div>
                                    <button type="submit" className="btn-luxury" style={{ gridColumn: '1 / -1' }}>DISPATCH TO HOME PAGE</button>
                                </form>
                            </div>

                            <div className="grid-3" style={{ gap: '2rem' }}>
                                {carouselItems.map(item => (
                                    <motion.div layout key={item._id} className="glass-morphism" style={{ border: '1px solid var(--border-gold)', overflow: 'hidden' }}>
                                        <img src={`${import.meta.env.VITE_API_URL}${item.backgroundImage}`} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                        <div style={{ padding: '20px' }}>
                                            <h4 style={{ margin: '0 0 10px', fontSize: '1rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{item.title}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                <span style={{ fontSize: '0.6rem', color: item.isActive ? '#81c784' : '#ff8a80', letterSpacing: '1px' }}>{item.isActive ? 'VISIBLE' : 'HIDDEN'}</span>
                                                <button onClick={() => deleteCarouselItem(item._id)} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
