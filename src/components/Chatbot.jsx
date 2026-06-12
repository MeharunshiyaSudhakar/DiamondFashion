import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! I'm your AI Assistant. How can I help you today?", isBot: true }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, { message: userMsg });
            setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '350px',
                            height: '500px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '15px'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'var(--accent-color)', color: '#fff', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bot size={20} />
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>AI Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9f9f9' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '10px 15px',
                                        borderRadius: '15px',
                                        background: msg.isBot ? '#fff' : 'var(--accent-color)',
                                        color: msg.isBot ? '#333' : '#fff',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        borderBottomLeftRadius: msg.isBot ? '0' : '15px',
                                        borderBottomRightRadius: msg.isBot ? '15px' : '0'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{ background: '#fff', padding: '12px 15px', borderRadius: '15px', borderBottomLeftRadius: '0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                        <motion.div
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            style={{ display: 'flex', gap: '4px' }}
                                        >
                                            <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%' }}></div>
                                            <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                            <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '15px', background: '#fff', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                style={{ flex: 1, padding: '10px 15px', border: '1px solid #ddd', borderRadius: '20px', outline: 'none', fontSize: '0.9rem' }}
                            />
                            <button type="submit" disabled={!input.trim() || isTyping} style={{ background: input.trim() ? 'var(--accent-color)' : '#ccc', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s' }}>
                                <Send size={18} style={{ marginLeft: '2px' }} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: 'var(--accent-color)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                        marginLeft: 'auto'
                    }}
                >
                    <MessageSquare size={28} />
                </motion.button>
            )}
        </div>
    );
};

export default Chatbot;
