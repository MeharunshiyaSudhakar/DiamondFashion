import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <h3 className="glitter-text" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>DIAMOND FASHION</h3>
                <p>Premium t-shirts and night-pants manufactured with precision and style.</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>&copy; 2026 Diamond Fashion. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
