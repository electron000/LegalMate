/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Loader, Menu, AlertTriangle, 
  Trash2, MessageSquare, ShieldX 
} from 'lucide-react';
import './sharedChatLayout.css';

const MessageRenderer = ({ message, renderBeforeMessage }) => {
  if (message.role === 'user') {
    return <p>{message.content}</p>;
  }

  if (message.role === 'error') {
    return (
      <div className="error-header">
        <AlertTriangle size={20} />
        <div>
          <h3>Error occurred</h3>
          <p>{message.content.message || "An unexpected error occurred."}</p>
        </div>
      </div>
    );
  }

  if (message.role === 'ai') {
    const { content } = message;
    const beforeContent = renderBeforeMessage ? renderBeforeMessage(message) : null;

    // Structured Answer (Markdown with styling)
    if (content.type === 'structured') {
      return (
        <div className="ai-response-card">
          {beforeContent}
          <ReactMarkdown
            components={{
              h2: (props) => <h2 className="ai-response-heading" {...props} />,
              h3: (props) => <h3 className="ai-subheading" {...props} />,
              p: (props) => <p className="ai-paragraph" {...props} />,
              strong: (props) => <strong className="ai-bold" {...props} />,
              ul: (props) => <ul className="ai-list" {...props} />,
              li: (props) => <li className="ai-list-item" {...props} />,
              blockquote: (props) => <blockquote className="ai-blockquote" {...props} />
            }}
          >
            {content.explanation}
          </ReactMarkdown>
        </div>
      );
    }

    // Thinking State
    if (content.type === 'thinking') {
      return (
        <div className="ai-response-card">
           {beforeContent}
           <div className="loading-indicator">
              <Loader size={16} className="spinner" /> 
              <span>Synthesizing answer...</span>
           </div>
        </div>
      );
    }

    // Fallback / Simple Text
    return (
      <div className="ai-response-simple">
         {beforeContent}
        <ReactMarkdown>{content.content || content}</ReactMarkdown>
      </div>
    );
  }
  return null;
};

const SideBar = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  onCreateNewSession,
  isExpanded,
  toggleSidebar,
  newChatLabel = "New Chat",
  NewChatIcon
}) => {
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`} aria-expanded={isExpanded}>
      <div className="sidebar-content-wrapper">
        {/* Collapsed View */}
        <div className="sidebar-view collapsed-view">
          <div className="top-icons">
            <button className="sidebar-icon-btn menu-btn" onClick={toggleSidebar} aria-label="Expand Menu">
              <Menu size={24} />
            </button>
            <button 
              className="sidebar-icon-btn new-chat-mini-btn" 
              onClick={onCreateNewSession} 
              aria-label={newChatLabel}
              title={newChatLabel}
            >
              <NewChatIcon size={20} />
            </button>
          </div>
        </div>

        {/* Expanded View */}
        <div className="sidebar-view expanded-view">
          <div className="sidebar-header">
             <button className="sidebar-icon-btn menu-btn-expanded" onClick={toggleSidebar} aria-label="Collapse Menu">
                <Menu size={24} />
             </button>
          </div>
          
          <div className="new-chat-container">
            <button className="new-chat-btn" onClick={onCreateNewSession}>
              <NewChatIcon size={18} className="plus-icon"/>
              <span>{newChatLabel}</span>
            </button>
          </div>
          
          <div className="threads-section">
            <div className="threads-header">Recent</div>
            <div className="threads-list">
              {sessions.map((session) => (
                <div key={session.id} className="thread-item-container">
                  <button
                    className={`thread-item ${session.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                    title={session.title}
                  >
                    <MessageSquare size={18} className="chat-icon" />
                    <span className="thread-title">{session.title || newChatLabel}</span>
                  </button>
                  <button 
                    className="delete-session-btn" 
                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                    aria-label="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sidebar-footer">
            <button className="footer-item" onClick={onClearAllSessions}>
              <ShieldX size={18} />
              <span>Clear history</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ showData, onClose, onConfirm }) => {
  if (!showData.visible) return null;
  const isSingle = showData.type === 'single';
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isSingle ? 'Delete Chat?' : 'Clear History?'}</h3>
        <p>
          {isSingle 
            ? 'This will permanently delete this session. This action cannot be undone.' 
            : 'This will permanently delete ALL your sessions. This action cannot be undone.'}
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete" onClick={onConfirm}>
            {isSingle ? 'Delete' : 'Clear All'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SharedChatLayout = ({
  messages = [],
  sessions = [],
  activeSessionId,
  isLoading = false,
  userInput,
  onInputChange,
  onSendMessage,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  onCreateNewSession,
  title = "AI Chat",
  subtitle = "How can I help you?",
  logo = "/legal-logo.webp",
  placeholder = "Type a message...",
  newChatLabel = "New Chat",
  NewChatIcon = MessageSquare,
  headerExtraContent = null,
  inputStartAdornment = null,
  inputDisabled = false,
  renderBeforeMessage = null
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ visible: false, type: null, id: null });
  
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  
  const handleMobileClose = () => { 
    if (window.innerWidth <= 768) setIsSidebarExpanded(false); 
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const handleCreateNew = () => {
    onCreateNewSession();
    handleMobileClose();
  };

  const initiateDelete = (type, id = null) => {
    setShowDeleteModal({ visible: true, type, id });
  };

  const confirmDelete = () => {
    const { type, id } = showDeleteModal;
    if (type === 'single') onDeleteSession(id);
    if (type === 'all') onClearAllSessions();
    setShowDeleteModal({ visible: false, type: null, id: null });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  return (
    <div className={`chatbot-page ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div className="chat-background-wave">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <SideBar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => { onSelectSession(id); handleMobileClose(); }}
        onDeleteSession={(id) => initiateDelete('single', id)}
        onClearAllSessions={() => initiateDelete('all')}
        onCreateNewSession={handleCreateNew}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        newChatLabel={newChatLabel}
        NewChatIcon={NewChatIcon}
      />

      {isSidebarExpanded && (
        <div className="mobile-backdrop" onClick={() => setIsSidebarExpanded(false)} />
      )}

      <main className="chat-main">
        <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Open Menu">
            <Menu size={24} />
        </button>

        <div className="chat-header">
            <div className="model-selector">
                <img src={logo} alt="Logo" className="header-logo" onError={(e) => e.target.style.display='none'}/>
                <span>{title}</span>
                {headerExtraContent}
            </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && !isLoading ? (
            <div className="welcome-message">
              <h1>
                <img src={logo} alt="" className="welcome-logo" onError={(e) => e.target.style.display='none'}/>
                {title}
              </h1>
              <p>{subtitle}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <MessageRenderer message={message} renderBeforeMessage={renderBeforeMessage} />
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <form className="input-form" onSubmit={onSendMessage}>
            <div className="input-container">
              {inputStartAdornment}
              <textarea
                ref={textareaRef} 
                className="message-input"
                value={userInput}
                onChange={(e) => onInputChange(e.target.value)} 
                placeholder={placeholder}
                disabled={isLoading || inputDisabled}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button type="submit" className="send-button" disabled={isLoading || !userInput.trim() || inputDisabled} aria-label="Send message">
                {isLoading ? <Loader size={16} className="spinner" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <DeleteModal 
        showData={showDeleteModal} 
        onClose={() => setShowDeleteModal({ visible: false, type: null, id: null })} 
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SharedChatLayout;