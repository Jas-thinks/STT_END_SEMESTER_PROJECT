import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageCircle, 
    X, 
    Send, 
    Loader, 
    ExternalLink, 
    Sparkles, 
    Trash2,
    Youtube,
    FileCode,
    MessageSquare,
    FileText,
    ChevronDown
} from 'lucide-react';
import './Chatbot.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history on mount
    useEffect(() => {
        loadWelcomeOrHistory();
    }, []);

    const loadWelcomeOrHistory = async () => {
        setIsLoadingHistory(true);
        try {
            // Try to load history first
            const historyResponse = await api.get('/chatbot/history');
            
            if (historyResponse.data.success && historyResponse.data.data.messages.length > 0) {
                setMessages(historyResponse.data.data.messages);
            } else {
                // If no history, get welcome message
                const welcomeResponse = await api.get('/chatbot/welcome');
                if (welcomeResponse.data.success) {
                    setMessages([
                        {
                            role: 'assistant',
                            content: welcomeResponse.data.data.message,
                            quickActions: welcomeResponse.data.data.quickActions,
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error('Failed to load chat:', error);
            // Fallback welcome message
            setMessages([
                {
                    role: 'assistant',
                    content: '👋 Hi! I\'m your AI Learning Assistant. How can I help you prepare for interviews today?',
                },
            ]);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to UI
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await api.post('/chatbot/message', {
                message: userMessage,
            });

            if (response.data.success) {
                const { message, resources, summary, quickActions } = response.data.data;

                // Add bot response
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: message,
                        resources,
                        summary,
                        quickActions,
                    },
                ]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '😕 Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        if (action.type === 'quiz') {
            navigate('/practice', { state: { selectedTopic: action.topic } });
        } else if (action.type === 'navigate') {
            navigate(action.path);
        } else if (action.type === 'search') {
            setInputMessage(action.query);
        }
    };

    const handleClearHistory = async () => {
        if (!confirm('Clear all chat history?')) return;

        try {
            await api.delete('/chatbot/history');
            await loadWelcomeOrHistory();
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'video':
                return <Youtube size={16} className="resource-icon video" />;
            case 'code':
                return <FileCode size={16} className="resource-icon code" />;
            case 'qna':
                return <MessageSquare size={16} className="resource-icon qna" />;
            default:
                return <FileText size={16} className="resource-icon article" />;
        }
    };

    return (
        <div className="chatbot-page">
            {/* Page Header */}
            <div className="chatbot-page-header">
                <div className="chatbot-title-section">
                    <Sparkles size={32} className="sparkle-icon" />
                    <div>
                        <h1>AI Learning Assistant</h1>
                        <p>Your personal tutor for DSA, System Design, ML, and more!</p>
                    </div>
                </div>
                <button
                    onClick={handleClearHistory}
                    className="btn-clear-chat-page"
                    title="Clear history"
                >
                    <Trash2 size={18} />
                    Clear History
                </button>
            </div>

            {/* Chat Container */}
            <div className="chatbot-page-container">
                {/* Messages */}
                <div className="chatbot-messages-page">
                    {isLoadingHistory ? (
                        <div className="loading-history">
                            <Loader className="spinner" size={32} />
                            <p>Loading conversation...</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>

                                {/* Summary (from Tavily) */}
                                {msg.summary && (
                                    <div className="message-summary">
                                        <strong>📝 Quick Summary:</strong>
                                        <p>{msg.summary}</p>
                                    </div>
                                )}

                                {/* Resources */}
                                {msg.resources && msg.resources.length > 0 && (
                                    <div className="message-resources">
                                        <div className="resources-title">
                                            🔍 Found {msg.resources.length} Resources:
                                        </div>
                                        {msg.resources.map((resource, rIdx) => (
                                            <a
                                                key={rIdx}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="resource-card"
                                            >
                                                <div className="resource-header">
                                                    {getResourceIcon(resource.type)}
                                                    <div className="resource-title">{resource.title}</div>
                                                </div>
                                                <div className="resource-snippet">{resource.snippet}...</div>
                                                <div className="resource-url">
                                                    <ExternalLink size={12} />
                                                    {new URL(resource.url).hostname}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Quick Actions */}
                                {msg.quickActions && msg.quickActions.length > 0 && (
                                    <div className="quick-actions">
                                        {msg.quickActions.map((action, aIdx) => (
                                            <button
                                                key={aIdx}
                                                onClick={() => handleQuickAction(action)}
                                                className="quick-action-btn"
                                            >
                                                {action.icon && <span>{action.icon}</span>}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content typing">
                                <Loader className="spinner" size={16} />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="chatbot-input-form-page">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me anything about DSA, System Design, ML, DL, or any interview topic..."
                        disabled={isLoading || isLoadingHistory}
                        className="chatbot-input-page"
                    />
                    <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading || isLoadingHistory}
                        className="btn-send-page"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
