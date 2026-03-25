import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, ThemeContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    User, Package, CreditCard, Ticket, Heart, MapPin,
    ShieldCheck, Trash2, LogOut, ChevronRight, Edit3, Save, X
} from 'lucide-react';

const ProfilePage = () => {
    const { login, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Detailed Form State
    const [formData, setFormData] = useState({
        username: '',
        mobile: '',
        email: '',
        gender: '',
        dob: '',
        location: '',
        alternateMobile: '',
        hintName: '',
        address: {
            fullName: '',
            mobile: '',
            pincode: '',
            addressLine: '',
            locality: '',
            city: '',
            state: '',
            landmark: '',
            addressType: 'Home'
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData({
                ...res.data,
                dob: res.data.dob ? res.data.dob.split('T')[0] : '',
                address: res.data.address || formData.address
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Your Maison profile has been updated.');
            setProfile(res.data.user);
            login(res.data.user, token);
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to synchronize archival details.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/home');
        toast.success('Signed out from the Maison.');
    };

    if (!profile) return <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--primary-gold)' }}>Authenticating Archive Access...</div>;

    const sidebarItems = [
        { section: 'ORDERS', items: [{ label: 'Orders & Returns', icon: <Package size={18} />, path: '/orders' }] },
        { section: 'CREDITS', items: [{ label: 'Coupons', icon: <Ticket size={18} /> }, { label: 'Diamond Fashion Credit', icon: <CreditCard size={18} /> }, { label: 'MynCash', icon: <ShieldCheck size={18} /> }] },
        { section: 'ACCOUNT', items: [{ label: 'Profile', icon: <User size={18} />, active: true }, { label: 'Saved Cards', icon: <CreditCard size={18} /> }, { label: 'Addresses', icon: <MapPin size={18} /> }, { label: 'Wishlist', icon: <Heart size={18} />, path: '/wishlist' }] },
        { section: 'LEGAL', items: [{ label: 'Terms of Use', icon: <ShieldCheck size={18} /> }, { label: 'Privacy Center', icon: <ShieldCheck size={18} /> }] }
    ];

    return (
        <div className="page-container" style={{ backgroundColor: '#1a1d14' }}>
            <Navbar />

            <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>

                <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>Account</h1>
                    <p style={{ fontSize: '2rem', fontStyle: 'italic', margin: '5px 0 0', color: 'var(--text-light)' }}>{profile.username}</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem' }}>

                    {/* Left Sidebar */}
                    <aside className="desktop-only">
                        {sidebarItems.map((group, idx) => (
                            <div key={idx} style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>{group.section}</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {group.items.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => item.path && navigate(item.path)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0',
                                                color: item.active ? 'var(--primary-gold)' : 'var(--text-light)',
                                                fontSize: '0.85rem', cursor: item.path ? 'pointer' : 'default',
                                                borderBottom: '1px solid rgba(212,175,55,0.05)',
                                                transition: '0.3s'
                                            }}
                                            onMouseEnter={(e) => item.path && (e.currentTarget.style.color = 'var(--primary-gold)')}
                                            onMouseLeave={(e) => !item.active && (e.currentTarget.style.color = 'var(--text-light)')}
                                        >
                                            <span style={{ opacity: 0.7 }}>{item.icon}</span>
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button
                            onClick={handleLogout}
                            style={{ background: 'transparent', border: 'none', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', padding: '0', cursor: 'pointer' }}
                        >
                            <LogOut size={18} /> LOGOUT
                        </button>
                    </aside>

                    {/* Right Content */}
                    <main>
                        <div className="glass-morphism" style={{ padding: '3rem', border: '1px solid var(--border-gold)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontStyle: 'italic', margin: 0, color: 'var(--primary-gold)' }}>Profile Details</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        style={{ background: 'var(--primary-gold)', color: 'black', border: 'none', padding: '8px 20px', fontSize: '0.7rem', fontWeight: '700', borderRadius: '1px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                    >
                                        <Edit3 size={14} /> EDIT PROFILE
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => setIsEditing(false)} style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '8px 15px', fontSize: '0.7rem', cursor: 'pointer' }}><X size={14} /></button>
                                        <button onClick={handleUpdateProfile} style={{ background: 'var(--primary-gold)', color: 'black', border: 'none', padding: '8px 20px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}><Save size={14} /> SAVE</button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleUpdateProfile}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                                    {[
                                        { label: 'Full Name', key: 'username', value: formData.username },
                                        { label: 'Mobile Number', key: 'mobile', value: formData.mobile || '- not added -' },
                                        { label: 'Email ID', key: 'email', value: formData.email, disabled: true },
                                        { label: 'Gender', key: 'gender', value: formData.gender || '- not added -', type: 'select', options: ['Male', 'Female', 'Other'] },
                                        { label: 'Date of Birth', key: 'dob', value: formData.dob || '- not added -', type: 'date' },
                                        { label: 'Location', key: 'location', value: formData.location || '- not added -' },
                                        { label: 'Alternate Mobile', key: 'alternateMobile', value: formData.alternateMobile || '- not added -' },
                                        { label: 'Hint Name', key: 'hintName', value: formData.hintName || '- not added -' }
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>{field.label}</label>
                                            {!isEditing || field.disabled ? (
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: field.value.includes('- not added -') ? 'rgba(255,255,255,0.2)' : 'var(--text-light)' }}>{field.value}</p>
                                            ) : (
                                                field.type === 'select' ? (
                                                    <select
                                                        value={formData[field.key]}
                                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', color: 'white', padding: '10px', outline: 'none' }}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type || 'text'}
                                                        value={formData[field.key]}
                                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', color: 'white', padding: '10px', outline: 'none' }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: '3rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '2rem', color: 'var(--primary-gold)' }}>Archival Delivery Registry</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                        {[
                                            { label: 'Pincode', key: 'pincode' },
                                            { label: 'City / District', key: 'city' },
                                            { label: 'State', key: 'state' },
                                            { label: 'Locality', key: 'locality' },
                                            { label: 'Landmark (Optional)', key: 'landmark' }
                                        ].map((field, i) => (
                                            <div key={i}>
                                                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>{field.label}</label>
                                                {!isEditing ? (
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: formData.address[field.key] ? 'var(--text-light)' : 'rgba(255,255,255,0.1)' }}>{formData.address[field.key] || '- not added -'}</p>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={formData.address[field.key]}
                                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address, [field.key]: e.target.value } })}
                                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', color: 'white', padding: '10px', outline: 'none' }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Detailed Address Line</label>
                                            {!isEditing ? (
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: formData.address.addressLine ? 'var(--text-light)' : 'rgba(255,255,255,0.1)' }}>{formData.address.addressLine || '- not added -'}</p>
                                            ) : (
                                                <textarea
                                                    rows="3"
                                                    value={formData.address.addressLine}
                                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, addressLine: e.target.value } })}
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', color: 'white', padding: '15px', outline: 'none', resize: 'none' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                            <button style={{ flex: 1, background: 'rgba(255,107,107,0.05)', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                <Trash2 size={18} /> DELETE ACCOUNT
                            </button>
                            <div className="glass-morphism" style={{ flex: 2, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--primary-gold)' }}>Diamond Fashion Insider</h4>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Experience exclusive boutique privileges.</p>
                                </div>
                                <ChevronRight size={20} style={{ color: 'var(--primary-gold)' }} />
                            </div>
                        </div>
                    </main>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
