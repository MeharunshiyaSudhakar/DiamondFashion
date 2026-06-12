import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: '0 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    
                    {/* Brand Section */}
                    <div>
                        <h2 style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', margin: '0 0 1.5rem', fontSize: '1.5rem' }}>DIAMOND FASHION</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Elevating everyday style with premium, minimalist fashion. Discover curated collections designed for the modern aesthetic.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {['Shop', 'Collections', 'About Us', 'Contact'].map(link => (
                                <li key={link} style={{ marginBottom: '10px' }}>
                                    <Link to={`/${link.toLowerCase().replace(' ', '')}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>Customer Care</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {['FAQ', 'Shipping & Returns', 'Size Guide', 'Track Order'].map(link => (
                                <li key={link} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)' }}>
                                <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '0.9rem' }}>123 Fashion Avenue, New York, NY 10001</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                <Phone size={18} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.9rem' }}>+1 (800) 123-4567</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                                <Mail size={18} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.9rem' }}>support@diamondfashion.com</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                        &copy; {new Date().getFullYear()} DIAMOND FASHION. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
