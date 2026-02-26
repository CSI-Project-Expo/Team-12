import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am the Smart Inventory Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages;

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
                message: userMessage.text,
                history: history
            });

            if (response.data.success) {
                setMessages(prev => [...prev, { role: 'model', text: response.data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting to the server. Please ensure the backend is running and GEMINI_API_KEY is set.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 rounded-full bg-brand-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-brand-500 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
            >
                <MessageCircle size={28} />
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] glass-card flex flex-col z-50 overflow-hidden shadow-card-hover"
                    >
                        {/* Header */}
                        <div className="bg-slate-800/80 backdrop-blur border-b border-slate-700 text-brand-400 p-4 flex justify-between items-center z-10">
                            <div className="flex items-center gap-2">
                                <Bot size={24} className="text-brand-500" />
                                <h3 className="font-semibold text-lg text-slate-100">Smart Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-brand-500 border border-slate-700'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div
                                        className={`p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                                            : 'bg-slate-800 text-slate-200 shadow-md border border-slate-700 rounded-tl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-brand-500 border border-slate-700 flex items-center justify-center shadow-sm">
                                        <Bot size={16} />
                                    </div>
                                    <div className="p-4 bg-slate-800 text-slate-200 shadow-md border border-slate-700 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-[44px]">
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
