import React from 'react';
import Navbar from '../components/Navbar';

const VirtualTourView = () => {
    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
            <Navbar />
            <div style={{ flex: 1, position: 'relative' }}>
                <iframe
                    src="/tour/index.htm"
                    title="Diamond Fashion Virtual Tour"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        </div>
    );
};

export default VirtualTourView;
