import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

/**
 * Chatbot Component
 * 
 * A floating AI assistant chat window. It uses localStorage to remember chat history,
 * and calls our backend API (via axios) to get bot responses.
 */
const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  // State variables to control the UI
  const [isOpen, setIsOpen] = useState(false); // Controls if the chat window is visible
  const [messages, setMessages] = useState([]); // Stores the list of chat messages
  const [input, setInput] = useState(''); // Stores the user's current typed message
  const [isTyping, setIsTyping] = useState(false); // Shows a loading animation when the bot is 'thinking'
  
  // A reference to the bottom of the message list so we can auto-scroll
  const messagesEndRef = useRef(null);

  // Generate a unique storage key for localStorage based on the user's ID
  const storageKey = useMemo(() => `bloodconnect-chat-history-${user?.id ?? 'guest'}`, [user?.id]);

  // Helper function to create a standardized welcome message
  const getWelcomeMessage = () => ({
    id: `welcome-${i18n.language}`,
    text: t('chatbot.welcome'),
    sender: 'bot',
  });

  // Effect 1: Load chat history from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(storageKey);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([getWelcomeMessage()]);
      }
    } catch (error) {
      console.error('Failed to restore chat history:', error);
      setMessages([getWelcomeMessage()]);
    }
  }, [storageKey, i18n.language]);

  // Effect 2: Save chat history to localStorage every time the 'messages' array changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Effect 3: Automatically scroll to the bottom when a new message is added or typing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /**
   * Helper function to quickly add a bot message to the state
   */
  const appendBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        text,
        sender: 'bot',
      },
    ]);
  };

  /**
   * Main function to handle sending a message to the backend AI
   */
  const handleSend = async (text = input) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // 1. Add user message to UI immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      text: trimmedText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true); // Show typing animation

    // 2. Call the backend API
    try {
      const response = await axios.post('/chatbot', {
        message: trimmedText,
        lang: i18n.language, // Send language so the bot replies in the same language
      });

      // 3. Add the bot's response to the UI
      appendBotMessage(response.data.response);
    } catch (error) {
      console.error('Chatbot error:', error);
      appendBotMessage(t('chatbot.error'));
    } finally {
      setIsTyping(false); // Hide typing animation
    }
  };

  // Pre-defined quick questions the user can click
  const quickSuggestions = [
    { id: 'where', label: t('chatbot.suggestions.where_label'), question: t('chatbot.suggestions.where_question') },
    { id: 'eligible', label: t('chatbot.suggestions.eligible_label'), question: t('chatbot.suggestions.eligible_question') },
    { id: 'process', label: t('chatbot.suggestions.process_label'), question: t('chatbot.suggestions.process_question') },
  ];

  return (
    <div className="chatbot-container">
      {/* Conditionally render the chat window only if isOpen is true */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header section */}
          <div className="chatbot-header">
            <div className="chatbot-header-main">
              <div className="chatbot-badge">
                <Bot size={22} />
              </div>
              <div>
                <h3>{t('chatbot.title')}</h3>
                <p>{t('chatbot.subtitle')}</p>
              </div>
            </div>
            {/* Close button */}
            <button type="button" className="chatbot-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-scope-note">{t('chatbot.scope')}</div>

          {/* Chat Messages List */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.sender}`}>
                <div className={`message-avatar ${msg.sender}`}>
                  {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`message ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}

            {/* Simulated typing indicator ("Bot is typing...") */}
            {isTyping && (
              <div className="message-row bot">
                <div className="message-avatar bot">
                  <Bot size={16} />
                </div>
                <div className="message bot typing">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible div used as an anchor to scroll to the bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Buttons */}
          <div className="chatbot-faqs">
            {quickSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                className="faq-btn"
                onClick={() => handleSend(item.question)}
                disabled={isTyping}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Box Area */}
          <form
            className="chatbot-input-area"
            onSubmit={(event) => {
              event.preventDefault(); // Prevent page reload on form submit
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={t('chatbot.placeholder')}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isTyping} // Disable typing if the bot is currently answering
              maxLength={1000}
            />
            <button type="submit" className="send-btn" disabled={isTyping || !input.trim()} aria-label="Send message">
              {isTyping ? <Loader2 className="chatbot-spinner" size={20} /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) that toggles the chat window */}
      <button
        type="button"
        className={`chatbot-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      >
        {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
};

export default Chatbot;
