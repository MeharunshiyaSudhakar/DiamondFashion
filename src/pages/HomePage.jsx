import React, { useContext, useState } from 'react';
import { Shirt, User, Users, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeCarousel from '../components/HomeCarousel';
import Chatbot from '../components/Chatbot';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Hero3D from '../components/Hero3D';
import { AuthContext } from '../App';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [marqueeText, setMarqueeText] = useState('SALE: FLAT 50% OFF ON ALL EXCLUSIVE PREMIUM WEAR • FREE SHIPPING ON ORDERS OVER ₹1500');

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const axios = (await import('axios')).default;
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
                if (res.data && res.data.marqueeText) {
                    setMarqueeText(res.data.marqueeText);
                }
            } catch (err) {
                console.error("Failed to fetch settings");
            }
        };
        fetchSettings();
    }, []);

    const handleSubscribe = async () => {
        if (!email) return;
        try {
            // Dynamically import axios and toast to maintain lightweight landing load
            const axios = (await import('axios')).default;
            const { toast } = await import('react-hot-toast');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/subscribe`, { email });
            toast.success('Successfully subscribed to our newsletter!');
            setEmail('');
        } catch (error) {
            const { toast } = await import('react-hot-toast');
            toast.error(error.response?.data?.message || 'Subscription failed.');
        }
    };

    const collections = [
        { title: 'Essential Collection', category: 'Premium Basics', img: '/uploads/tshirt_gold.png', desc: 'Minimalist design crafted from premium cotton.' },
        { title: 'Night Series', category: 'Loungewear', img: '/uploads/tshirt_black.png', desc: 'Comfortable and modern apparel for everyday wear.' }
    ];


    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <main>
                <div className="marquee-container">
                    <div className="marquee-content">
                        <span>{marqueeText} • </span>
                        <span>{marqueeText} • </span>
                    </div>
                </div>
                <div>
                    <HomeCarousel />
                </div>

                {/* Categories */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="section-padding"
                    style={{ textAlign: 'center' }}
                >
                    <h2 className="section-title">Shop By Category</h2>
                    <div className="grid-4" style={{ gap: '2rem' }}>
                        {[
                            { l: 'Men', q: 'men', img: '/uploads/men_category.png' },
                            { l: 'Women', q: 'women', img: '/uploads/women_category.png' },
                            { l: 'Boys', q: 'boys', img: '/uploads/boys_category.png' },
                            { l: 'Girls', q: 'girls', img: '/uploads/girls_category.png' }
                        ].map((cat, i) => (
                            <motion.div
                                key={cat.l}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => navigate('/shop?category=' + cat.q)}
                                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div style={{ width: '100%', aspectRatio: '3/4', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cat.img}`} 
                                        alt={cat.l} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <p style={{ marginTop: '15px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'center' }}>{cat.l}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Collections Grid */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="section-padding"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 className="section-title" style={{ marginBottom: '15px' }}>Featured Collections</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Handpicked selections highlighting our finest materials and impeccable craftsmanship.
                        </p>
                    </div>
                    <div className="grid-2" style={{ gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {collections.map((col, i) => (
                            <motion.div
                                key={col.title}
                                whileHover={{ scale: 1.02 }}
                                className="product-card"
                                style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-primary)' }}
                            >
                                <div style={{ height: '350px', width: '100%', overflow: 'hidden', marginBottom: '20px' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${col.img}`} 
                                        alt={col.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{col.category}</span>
                                <h3 style={{ fontSize: '1.5rem', margin: '15px 0', fontWeight: '600' }}>{col.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{col.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>


                {/* Newsletter */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="section-padding"
                    style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)' }}
                >
                    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <h2 className="section-title" style={{ marginBottom: '10px' }}>Subscribe to our Newsletter</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Get the latest updates on new products and upcoming sales.</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '15px 25px',
                                    color: 'var(--text-primary)', width: '300px', outline: 'none'
                                }}
                            />
                            <button onClick={handleSubscribe} className="btn-primary">Subscribe</button>
                        </div>
                    </div>
                </motion.section>
                {/* About Us Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="section-padding"
                    style={{ textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}
                >
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="section-title" style={{ textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>About Tirupur Wholesale</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                            We bring you premium quality apparel straight from Tirupur, the knitting capital of India. Our collections use ultra-soft, highly durable materials perfectly engineered for luxury fashion and everyday comfort. By cutting out the middleman, we deliver uncompromising quality at authentic wholesale value.
                        </p>
                        <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '12px 30px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Shop the Collection</button>
                    </div>
                </motion.section>

            </main>

            <Footer />
            <Chatbot />
        </div>
    );
}

export default HomePage;
