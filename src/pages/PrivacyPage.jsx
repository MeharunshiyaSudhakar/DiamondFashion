import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
    return (
        <div className="page-container">
            <Navbar />
            <div style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', flex: 1, color: 'var(--text-primary)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    At Diamond Fashion, we are committed to protecting and respecting your privacy. This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    We may collect and process data about you including information you provide by filling in forms on our site, contacting us, and details of your visits to our site.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    We use information held about you to provide you with information, products or services that you request from us, to carry out our obligations arising from any contracts entered into between you and us, and to notify you about changes to our service.
                </p>
                <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Disclosure of Your Information</h2>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    We may disclose your personal information to any member of our group, which means our subsidiaries, our ultimate holding company and its subsidiaries.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPage;
