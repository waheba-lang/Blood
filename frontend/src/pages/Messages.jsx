import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import echo from '../utils/echo';
import './Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        const handleInitialContact = async () => {
            await fetchConversations();
            
            if (location.state?.contactId) {
                const contactId = location.state.contactId;
                // Check if user already in conversations
                const existing = conversations.find(c => c.id === contactId);
                if (existing) {
                    handleSelectUser(existing);
                } else {
                    // Fetch user info for a new conversation
                    try {
                        const response = await axios.get(`/users/${contactId}`);
                        const newUser = response.data;
                        setSelectedUser(newUser);
                        fetchMessages(newUser.id);
                        // Add to conversations locally so it shows in sidebar
                        setConversations(prev => [newUser, ...prev]);
                    } catch (error) {
                        console.error('Failed to fetch user for chat', error);
                    }
                }
            }
        };

        handleInitialContact();

        // Listen for new messages globally
        const channel = echo.private(`chat.${user.id}`);
        channel.listen('MessageSent', (event) => {
            if (selectedUser && event.message.sender_id === selectedUser.id) {
                setMessages((prev) => [...prev, event.message]);
            }
            fetchConversations(); // Refresh sidebar to show latest contact/snippet
        });

        return () => {
            echo.leave(`chat.${user.id}`);
        };
    }, [user, selectedUser, location.state]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get('/messages/conversations');
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`/messages/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchMessages(user.id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const response = await axios.post('/messages', {
                receiver_id: selectedUser.id,
                content: newMessage,
            });
            setMessages((prev) => [...prev, response.data]);
            setNewMessage('');
            fetchConversations();
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div className="messages-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="conversations-sidebar">
                <div className="sidebar-header">
                    <h2>{t('nav.messages')}</h2>
                </div>
                <div className="conversations-list">
                    {loading ? (
                        <p style={{ padding: '20px', color: 'var(--text-muted)' }}>{t('common.loading')}</p>
                    ) : conversations.length === 0 ? (
                        <p style={{ padding: '20px', color: 'var(--text-muted)' }}>{t('dashboard.no_activity')}</p>
                    ) : (
                        conversations.map((contact) => (
                            <div
                                key={contact.id}
                                className={`conversation-item ${selectedUser?.id === contact.id ? 'active' : ''}`}
                                onClick={() => handleSelectUser(contact)}
                            >
                                <div className="user-avatar">
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-name">{contact.name}</div>
                                    <div className="conversation-role">{contact.role}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="chat-window">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="user-avatar">
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="conversation-info">
                                <div className="conversation-name">{selectedUser.name}</div>
                                <div className="conversation-role">{selectedUser.role}</div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message-bubble ${msg.sender_id === user.id ? 'message-sent' : 'message-received'
                                        }`}
                                >
                                    {msg.content}
                                    <small className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input-area">
                            <form onSubmit={handleSendMessage} className="chat-input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder={t('dashboard.support_desc')}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="send-button">
                                    <span style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }}>➤</span>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="no-chat-icon">💬</div>
                        <p>{t('dashboard.no_activity')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
