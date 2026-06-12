import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
    return (
        <div className="page-container">
            <Navbar />
            <div style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', flex: 1, color: 'var(--text-primary)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms of Use</h1>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Welcome to Diamond Fashion. By accessing our website, you agree to these Terms of Use. Please read them carefully.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Use of the Site</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    You may use our site for lawful purposes only. You must not use our site in any way that breaches any applicable local, national or international law or regulation.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Intellectual Property Rights</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    We are the owner or the licensee of all intellectual property rights in our site, and in the material published on it. Those works are protected by copyright laws and treaties around the world. All such rights are reserved.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Our Liability</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    The material displayed on our site is provided without any guarantees, conditions or warranties as to its accuracy.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default TermsPage;
