import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, ThemeContext } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Package, CreditCard, Ticket, Heart, MapPin,
    ShieldCheck, Trash2, LogOut, ChevronRight, Edit3, Save, X, LayoutDashboard, Wallet, Award, CheckCircle2, Map, Bell
} from 'lucide-react';

const ProfilePage = () => {
    const { login, logout } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        fullName: '',
        mobile: '',
        pincode: '',
        addressLine: '',
        locality: '',
        city: '',
        state: '',
        landmark: '',
        addressType: 'Home'
    });

    const [formData, setFormData] = useState({
        username: '',
        mobile: '',
        email: '',
        gender: '',
        dob: '',
        location: '',
        alternateMobile: '',
        hintName: '',
        addresses: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData({
                ...res.data,
                dob: res.data.dob ? res.data.dob.split('T')[0] : '',
                addresses: res.data.addresses || []
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
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Your profile has been updated.');
            setProfile(res.data.user);
            login(res.data.user, token);
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update details.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const newAddresses = [...formData.addresses];
            if (editingAddressIndex !== null) {
                newAddresses[editingAddressIndex] = addressFormData;
            } else {
                newAddresses.push(addressFormData);
            }

            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, { addresses: newAddresses }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Address saved successfully.');
            setProfile(res.data.user);
            setFormData(prev => ({ ...prev, addresses: newAddresses }));
            setShowAddressForm(false);
            setEditingAddressIndex(null);
        } catch (error) {
            toast.error('Failed to save address.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAddress = async (index) => {
        if (!window.confirm('Are you sure you want to remove this address?')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const newAddresses = formData.addresses.filter((_, i) => i !== index);
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, { addresses: newAddresses }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Address removed.');
            setProfile(res.data.user);
            setFormData(prev => ({ ...prev, addresses: newAddresses }));
        } catch (error) {
            toast.error('Failed to remove address.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/home');
        toast.success('Logged out successfully.');
    };

    if (!profile) return <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-primary)' }}>Loading Profile...</div>;

    const sidebarItems = [
        { section: 'DASHBOARD', items: [
            { label: 'Overview', icon: <LayoutDashboard size={18} />, tab: 'Overview' }
        ]},
        { section: 'ORDERS', items: [
            { label: 'Orders & Returns', icon: <Package size={18} />, path: '/orders' }
        ]},
        { section: 'ACCOUNT', items: [
            { label: 'Profile Details', icon: <User size={18} />, tab: 'Profile Details' },
            { label: 'Saved Addresses', icon: <MapPin size={18} />, tab: 'Saved Addresses' },
            { label: 'My Wishlist', icon: <Heart size={18} />, path: '/wishlist' },
            { label: 'Notifications', icon: <Bell size={18} />, tab: 'Notifications' }
        ]},
        { section: 'CREDITS', items: [
            { label: 'Coupons & Offers', icon: <Ticket size={18} />, tab: 'Coupons' },
            { label: 'Store Credit', icon: <Wallet size={18} />, tab: 'Store Credit' }
        ]},
        { section: 'LEGAL', items: [
            { label: 'Terms of Use', icon: <ShieldCheck size={18} /> },
            { label: 'Privacy Policy', icon: <ShieldCheck size={18} /> }
        ]}
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="page-container" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />

            {/* Hero Banner Area */}
            <div style={{ 
                background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(0,0,0,0.02) 100%)',
                padding: '40px 5%',
                borderBottom: '1px solid var(--border-color)',
                marginTop: '0'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-color), #ff4081)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 700,
                        boxShadow: '0 10px 25px rgba(255, 0, 76, 0.2)', border: '4px solid var(--bg-primary)'
                    }}>
                        {getInitials(profile.username)}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>
                            {profile.username}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                            <Award size={18} /> Diamond Insider
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '10px' }}>| {profile.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
                <div className="profile-page-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem' }}>

                    {/* Sidebar */}
                    <aside className="profile-sidebar" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        {sidebarItems.map((group, idx) => (
                            <div key={idx} style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '0.7rem', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                                    {group.section}
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {group.items.map((item, i) => {
                                        const isActive = item.tab === activeTab;
                                        return (
                                            <li
                                                key={i}
                                                onClick={() => {
                                                    if (item.path) navigate(item.path);
                                                    else if (item.tab) setActiveTab(item.tab);
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                                                    color: isActive ? 'var(--accent-color)' : 'var(--text-primary)',
                                                    backgroundColor: isActive ? 'rgba(255, 0, 76, 0.05)' : 'transparent',
                                                    fontSize: '0.95rem', cursor: (item.path || item.tab) ? 'pointer' : 'default',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.2s ease',
                                                    fontWeight: isActive ? '600' : '500',
                                                    marginBottom: '4px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isActive && (item.path || item.tab)) {
                                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isActive) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                                                {item.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={handleLogout}
                                style={{ background: 'transparent', border: 'none', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', padding: '10px 15px', cursor: 'pointer', fontWeight: '600', width: '100%', borderRadius: '8px', transition: '0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(231, 76, 60, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                
                                {activeTab === 'Notifications' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Your Notifications</h2>
                                        {profile.notifications && profile.notifications.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {profile.notifications.map((notif, index) => (
                                                    <div key={index} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                                        <div style={{ padding: '10px', background: 'rgba(255, 0, 76, 0.1)', borderRadius: '50%', color: 'var(--accent-color)' }}>
                                                            <Bell size={20} />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{notif.message}</p>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(notif.date).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                                <Bell size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                                <p style={{ color: 'var(--text-secondary)' }}>You have no new notifications.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'Overview' && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Dashboard</h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                                            <div style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                                    <Package size={20} /> <span style={{ fontWeight: 600 }}>Total Orders</span>
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>0</div>
                                            </div>
                                            <div style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                                    <Wallet size={20} /> <span style={{ fontWeight: 600 }}>Store Credit</span>
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-color)' }}>₹0</div>
                                            </div>
                                            <div style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                                    <MapPin size={20} /> <span style={{ fontWeight: 600 }}>Saved Addresses</span>
                                                </div>
                                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                    {formData.address?.addressLine ? '1' : '0'}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px', cursor: 'pointer' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Insider Program</h4>
                                                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You currently get exclusive early access to sales.</p>
                                            </div>
                                            <ChevronRight size={24} style={{ color: 'var(--text-secondary)' }} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Profile Details' && (
                                    <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Personal Information</h2>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="btn-secondary"
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '0.85rem', borderRadius: '20px' }}
                                                >
                                                    <Edit3 size={16} /> Edit
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '8px 15px', borderColor: '#e74c3c', color: '#e74c3c', borderRadius: '20px' }}><X size={16} /></button>
                                                    <button onClick={handleUpdateProfile} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', fontSize: '0.85rem', borderRadius: '20px' }}><Save size={16} /> Save</button>
                                                </div>
                                            )}
                                        </div>

                                        <form onSubmit={handleUpdateProfile}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                                {[
                                                    { label: 'Full Name', key: 'username', value: formData.username },
                                                    { label: 'Mobile Number', key: 'mobile', value: formData.mobile || '- not added -' },
                                                    { label: 'Email Address', key: 'email', value: formData.email, disabled: true },
                                                    { label: 'Gender', key: 'gender', value: formData.gender || '- not added -', type: 'select', options: ['Male', 'Female', 'Other'] },
                                                    { label: 'Date of Birth', key: 'dob', value: formData.dob || '- not added -', type: 'date' },
                                                    { label: 'Location', key: 'location', value: formData.location || '- not added -' }
                                                ].map((field, i) => (
                                                    <div key={i}>
                                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>{field.label}</label>
                                                        {!isEditing || field.disabled ? (
                                                            <div style={{ 
                                                                padding: '12px 15px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid transparent',
                                                                color: field.value.includes('- not added -') ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                                fontWeight: '500'
                                                            }}>
                                                                {field.value}
                                                            </div>
                                                        ) : (
                                                            field.type === 'select' ? (
                                                                <select
                                                                    value={formData[field.key]}
                                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 15px', outline: 'none', borderRadius: '8px', transition: '0.2s' }}
                                                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    type={field.type || 'text'}
                                                                    value={formData[field.key]}
                                                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                                                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 15px', outline: 'none', borderRadius: '8px', transition: '0.2s' }}
                                                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                                                <button type="button" style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', borderRadius: '8px', transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e74c3c'; }}>
                                                    <Trash2 size={16} /> Delete Account
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'Saved Addresses' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Saved Addresses</h2>
                                            {!showAddressForm && (
                                                <button onClick={() => { setAddressFormData({ fullName: '', mobile: '', pincode: '', addressLine: '', locality: '', city: '', state: '', landmark: '', addressType: 'Home' }); setEditingAddressIndex(null); setShowAddressForm(true); }} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Map size={16} /> Add New
                                                </button>
                                            )}
                                        </div>
                                        
                                        {showAddressForm ? (
                                            <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                                <h3 style={{ marginTop: 0 }}>{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
                                                <form onSubmit={handleAddressSubmit}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                                        <input required placeholder="Full Name" value={addressFormData.fullName} onChange={e => setAddressFormData({...addressFormData, fullName: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="Mobile" value={addressFormData.mobile} onChange={e => setAddressFormData({...addressFormData, mobile: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="Pincode" value={addressFormData.pincode} onChange={e => setAddressFormData({...addressFormData, pincode: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="Address Line" value={addressFormData.addressLine} onChange={e => setAddressFormData({...addressFormData, addressLine: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="Locality" value={addressFormData.locality} onChange={e => setAddressFormData({...addressFormData, locality: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="City" value={addressFormData.city} onChange={e => setAddressFormData({...addressFormData, city: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <input required placeholder="State" value={addressFormData.state} onChange={e => setAddressFormData({...addressFormData, state: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                                                        <select value={addressFormData.addressType} onChange={e => setAddressFormData({...addressFormData, addressType: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                                                            <option value="Home">Home</option>
                                                            <option value="Work">Work</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                                        <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '20px' }}>Save Address</button>
                                                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '20px' }}>Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : formData.addresses && formData.addresses.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                                {formData.addresses.map((addr, index) => (
                                                    <div key={index} style={{ border: index === 0 ? '2px solid var(--accent-color)' : '1px solid var(--border-color)', borderRadius: '16px', padding: '25px', background: 'var(--bg-secondary)', position: 'relative' }}>
                                                        {index === 0 && <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--accent-color)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>DEFAULT</div>}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,0,76,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <MapPin size={20} />
                                                            </div>
                                                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{addr.addressType || 'Home'}</h3>
                                                        </div>
                                                        <p style={{ margin: '0 0 5px 0', fontWeight: 600, color: 'var(--text-primary)' }}>{addr.fullName || formData.username}</p>
                                                        <p style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                                                            {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                                                            <br/>Ph: {addr.mobile}
                                                        </p>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button onClick={() => { setAddressFormData(addr); setEditingAddressIndex(index); setShowAddressForm(true); }} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }}>Edit</button>
                                                            <button onClick={() => handleRemoveAddress(index)} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', color: '#e74c3c' }}>Remove</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                                                <Map size={48} style={{ color: 'var(--text-secondary)', marginBottom: '15px', opacity: 0.5 }} />
                                                <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>No Addresses Found</h3>
                                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>You haven't saved any delivery addresses yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(activeTab === 'Coupons' || activeTab === 'Store Credit') && (
                                    <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                        <Wallet size={48} style={{ color: 'var(--text-secondary)', marginBottom: '15px', opacity: 0.5 }} />
                                        <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)' }}>No Active {activeTab}</h3>
                                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>Looks like you don't have any {activeTab.toLowerCase()} associated with your account right now.</p>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </main>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;
