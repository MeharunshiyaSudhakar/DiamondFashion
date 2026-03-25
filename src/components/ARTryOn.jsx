import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import * as pose_module from '@mediapipe/pose';
import * as drawing_utils from '@mediapipe/drawing_utils';
import { X, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARTryOn = ({ product, onClose }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const productImgRef = useRef(null);
    const [productImg, setProductImg] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.src = `${import.meta.env.VITE_API_URL}${product.images?.[0] || product.image}`;
        img.crossOrigin = 'anonymous'; // Critical for getImageData
        img.onload = () => {
            const offscreen = document.createElement('canvas');
            offscreen.width = img.naturalWidth;
            offscreen.height = img.naturalHeight;
            const ctx = offscreen.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
                const data = imageData.data;
                // Chroma key for bright green background
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    if (g > 1.4 * r && g > 1.4 * b && g > 100) {
                        data[i + 3] = 0; // Transparent
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                productImgRef.current = offscreen;
                setProductImg(offscreen);
            } catch (e) {
                console.warn("Chroma key failed:", e);
                productImgRef.current = img;
                setProductImg(img);
            }
        };
    }, [product]);

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        // Hide loading as soon as the model is initialized and first frame is processed
        pose.initialize().then(() => {
            console.log("Pose Model Initialized");
        });

        let videoElement = null;
        let animationId = null;

        const startDetection = async () => {
            if (webcamRef.current && webcamRef.current.video) {
                videoElement = webcamRef.current.video;
                if (videoElement.readyState === 4) {
                    await pose.send({ image: videoElement });
                }
            }
            animationId = requestAnimationFrame(startDetection);
        };

        animationId = requestAnimationFrame(startDetection);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            pose.close();
        };
    }, []); // Run only once on mount

    const onResults = (results) => {
        if (loading) setLoading(false);
        if (!canvasRef.current || !productImgRef.current || !webcamRef.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const drawnImage = productImgRef.current;
        const video = webcamRef.current.video;

        if (!video || video.readyState !== 4) return;

        // Sync canvas resolution to the actual video feed pixels
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        const { width, height } = canvas;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, width, height);

        if (results.poseLandmarks) {
            const landmarks = results.poseLandmarks;

            // 0: Nose, 11: L shoulder, 12: R shoulder, 23: L hip, 24: R hip
            const nose = landmarks[0];
            const l_sh = landmarks[11];
            const r_sh = landmarks[12];
            const l_hp = landmarks[23];
            const r_hp = landmarks[24];

            // Only overlay if landmarks are detected with high confidence
            if (l_sh.visibility > 0.7 && r_sh.visibility > 0.7) {

                // MIRROR MAPPING: (1 - X)
                const p_nose = { x: (1 - nose.x) * width, y: nose.y * height };
                const p_l_sh = { x: (1 - l_sh.x) * width, y: l_sh.y * height, z: l_sh.z };
                const p_r_sh = { x: (1 - r_sh.x) * width, y: r_sh.y * height, z: r_sh.z };
                const p_l_hp = { x: (1 - l_hp.x) * width, y: l_hp.y * height };
                const p_r_hp = { x: (1 - r_hp.x) * width, y: r_hp.y * height };

                // Base points
                const midShX = (p_l_sh.x + p_r_sh.x) / 2;
                const midShY = (p_l_sh.y + p_r_sh.y) / 2;
                const distSh = Math.hypot(p_r_sh.x - p_l_sh.x, p_r_sh.y - p_l_sh.y);
                const angle = Math.atan2(p_r_sh.y - p_l_sh.y, p_r_sh.x - p_l_sh.x);

                // NECK ALIGNMENT LOGIC:
                // The neck is roughly 1/3 of the way from the shoulder midpoint to the nose.
                // This handles cases where people lean their head or have different neck lengths.
                const neckX = midShX + (p_nose.x - midShX) * 0.15;
                const neckY = midShY + (p_nose.y - midShY) * 0.2; // Move slightly towards nose

                // SCALE OPTIMIZATION:
                // Normal human shoulders occupy about 60-70% of a finished t-shirt's width (including sleeves)
                // We use a multiplier of 1.7 to 1.8 for the image width
                const shirtWidth = distSh * 1.85;

                // Perspective Scaling: Adjust size slightly based on Z (depth)
                // MediaPipe Z is roughly 0 at the hips, smaller is closer to camera
                const zCorrection = 1 - (p_l_sh.z + p_r_sh.z) / 2;
                const finalWidth = shirtWidth * Math.max(0.8, Math.min(1.2, zCorrection));
                let finalHeight = finalWidth * (drawnImage.height / drawnImage.width);

                // TORSO ADJUSTMENT:
                // If hips are visible, we ensure the shirt spans the length of the torso
                if (l_hp.visibility > 0.6 && r_hp.visibility > 0.6) {
                    const midHipY = (p_l_hp.y + p_r_hp.y) / 2;
                    const torsoLen = midHipY - midShY;
                    // The shirt should extend slightly below the hips
                    const targetHeight = torsoLen * 1.4;
                    // Blend to maintain image aspect ratio while respecting body length
                    finalHeight = (finalHeight * 0.3) + (targetHeight * 0.7);
                }

                canvasCtx.save();
                // Anchor at the calculated neck position
                canvasCtx.translate(neckX, neckY);
                canvasCtx.rotate(angle);

                // DRAW IMAGE AS OVERLAY
                canvasCtx.globalAlpha = 1.0;
                canvasCtx.drawImage(
                    drawnImage,
                    -finalWidth / 2, // Horizontally centered
                    -finalHeight * 0.15, // Anchor the collar (roughly top 15% of image) at shoulder line
                    finalWidth,
                    finalHeight
                );

                canvasCtx.restore();
            }
        }
        canvasCtx.restore();
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                backgroundColor: 'black', display: 'flex', flexDirection: 'column'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px 40px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', background: 'var(--bg-deep-olive)', borderBottom: '1px solid var(--border-gold)'
            }}>
                <div>
                    <h2 style={{ color: 'var(--primary-gold)', margin: 0, fontSize: '1.2rem', fontStyle: 'italic' }}>Maison AR Mirror</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '5px 0 0' }}>Virtual Try-On Protocol</p>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer' }}
                >
                    <X size={30} />
                </button>
            </div>

            {/* Camera View */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Webcam
                        ref={webcamRef}
                        mirrored={true}
                        videoConstraints={videoConstraints}
                        style={{
                            width: 'auto',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain', // No cropping
                            filter: 'contrast(1.05) brightness(1.05)'
                        }}
                        onUserMediaError={() => setError("Camera access denied or unavailable.")}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            width: 'auto',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain', // Match webcam scaling
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                {loading && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
                        <div className="luxury-spinner" style={{ width: '50px', height: '50px', border: '2px solid var(--primary-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate 1s linear infinite' }}></div>
                        <p style={{ color: 'var(--primary-gold)', marginTop: '20px', letterSpacing: '2px', fontSize: '0.8rem' }}>CALIBRATING MAISON OPTICS...</p>
                    </div>
                )}

                {error && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.9)', padding: '2rem' }}>
                        <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>
                    </div>
                )}
            </div>

            {/* Footer / Controls */}
            <div style={{ padding: '30px', background: 'var(--bg-deep-olive)', borderTop: '1px solid var(--border-gold)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '15px' }}>Position yourself in the frame for optimal fitting.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button className="btn-luxury" style={{ width: 'auto', padding: '12px 30px' }}>
                        <Camera size={18} style={{ marginRight: '10px' }} /> CAPTURE MOMENT
                    </button>
                    <button className="btn-luxury" style={{ width: 'auto', padding: '12px 30px', background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)' }}>
                        <RefreshCw size={18} style={{ marginRight: '10px' }} /> RE-CALIBRATE
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ARTryOn;
