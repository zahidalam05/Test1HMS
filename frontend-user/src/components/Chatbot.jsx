import { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import API from '../services/api';
import AuthContext from '../context/AuthContext';

const Chatbot = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${user?.name?.split(' ')[0] || ''}! I'm your HMS AI Assistant. How can I help you today?`, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setIsLoading(true);

        try {
            const { data } = await API.post('/chatbot', { message: userMsg });
            setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error("Chat error", error);
            const errorMsg = error.response?.data?.reply || "Sorry, I am having trouble connecting to AI. Please try again later.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMsg, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-[#5145ff] to-indigo-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(81,69,255,0.4)] hover:shadow-[0_12px_35px_rgba(81,69,255,0.6)] hover:-translate-y-1 transition-all duration-300 animate-bounce"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-[#2c263d] to-[#453664] flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">HMS AI Assistant</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-indigo-200 font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] shadow-sm ${msg.sender === 'user' ? 'bg-[#5145ff] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                                    <Loader2 className="animate-spin text-gray-400" size={16} />
                                    <span className="text-xs text-gray-500 font-medium">AI is typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-800 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-[#5145ff] focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-[#5145ff] hover:bg-indigo-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                            >
                                <Send size={16} className="ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
