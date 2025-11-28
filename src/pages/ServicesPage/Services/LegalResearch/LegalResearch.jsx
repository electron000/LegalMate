import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Loader, Menu, AlertTriangle, 
  Trash2, MessageSquare, ShieldX, BookOpen 
} from 'lucide-react';
import legalLogo from '../../../../assets/legal-logo.png';
import '../shared/ChatInterface.css';

const ResearchMessageRenderer = ({ message }) => {
  if (message.role === 'user') {
    return <p>{message.content}</p>;
  }

  if (message.role === 'error') {
    return (
      <div className="error-header">
        <AlertTriangle size={20} />
        <div>
          <h3>Research Error</h3>
          <p>{message.content.message}</p>
        </div>
      </div>
    );
  }

  if (message.role === 'ai') {
    const { content } = message;

    if (content.type === 'structured') {
      return (
        <div className="ai-response-card">
          <ReactMarkdown
            components={{
              h2: ({...props}) => <h2 className="ai-response-heading" {...props} />,
              h3: ({...props}) => <h3 className="ai-subheading" {...props} />,
              p: ({...props}) => <p className="ai-paragraph" {...props} />,
              strong: ({...props}) => <strong className="ai-bold" {...props} />,
              ul: ({...props}) => <ul className="ai-list" {...props} />,
              li: ({...props}) => <li className="ai-list-item" {...props} />,
              blockquote: ({...props}) => (
                <blockquote style={{ borderLeft: '4px solid #fff', paddingLeft: '1rem', fontStyle: 'italic', margin: '1rem 0' }} {...props} />
              )
            }}
          >
            {content.explanation}
          </ReactMarkdown>
        </div>
      );
    }
    return (
      <div className="ai-response-simple">
        <ReactMarkdown>{content.content || content}</ReactMarkdown>
      </div>
    );
  }
  return null;
};

const ResearchSideBar = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
  createNewSession,
  isExpanded,
  toggleSidebar
}) => {
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-content-wrapper">
        <div className="sidebar-view collapsed-view">
          <div className="top-icons">
            <button className="sidebar-icon-btn menu-btn" onClick={toggleSidebar} aria-label="Expand Menu">
              <Menu size={24} />
            </button>
            <button 
              className="sidebar-icon-btn new-chat-mini-btn" 
              onClick={createNewSession} 
              aria-label="New Research"
              title="New Research"
            >
              <BookOpen size={20} /> 
            </button>
          </div>
        </div>

        <div className="sidebar-view expanded-view">
          <div className="sidebar-header">
             <button className="sidebar-icon-btn menu-btn-expanded" onClick={toggleSidebar}>
                <Menu size={24} />
             </button>
          </div>
          
          <div className="new-chat-container">
            <button className="new-chat-btn" onClick={createNewSession}>
              <BookOpen size={18} className="plus-icon"/>
              <span>New Research</span>
            </button>
          </div>
          
          <div className="threads-section">
            <div className="threads-header">Recent Topics</div>
            <div className="threads-list">
              {sessions.map((session) => (
                <div key={session.id} className="thread-item-container">
                  <button
                    className={`thread-item ${session.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                    title={session.title}
                  >
                    <MessageSquare size={18} className="chat-icon" />
                    <span className="thread-title">{session.title || 'New Topic'}</span>
                  </button>
                  
                  <button 
                    className="delete-session-btn" 
                    aria-label="Delete topic"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
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

const LegalResearch = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState({ visible: false, type: null, id: null });
  
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) setIsSidebarExpanded(false);
  };

  const processUserMessage = async (text) => {
    if (!text || !text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);

    setSessions(prev => {
        if (!prev.find(s => s.id === activeSessionId)) {
            return [{ id: activeSessionId, title: text.slice(0, 30) + '...' }, ...prev];
        }
        return prev;
    });

    setIsLoading(true);
    setTimeout(() => {
      const mockResponse = { 
        role: 'ai', 
        content: { 
          type: 'structured', 
          explanation: `**Research Simulation**\n\nI have received your query regarding *" ${text} "*.\n\nSince I am currently in **Static Mode**, I cannot search the live legal database. \n\n### What I would usually do:\n* Search Case Law databases.\n* Analyze relevant Statutes.\n* Summarize Precedents.\n\n_Please connect the API to get real legal research results._` 
        } 
      };
      setMessages(prev => [...prev, mockResponse]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const text = userInput;
    setUserInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await processUserMessage(text);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };
  
  const createNewSession = () => {
    const newId = Date.now().toString(); 
    setActiveSessionId(newId);
    setMessages([]);
    closeSidebarOnMobile();
  };

  const handleDelete = async () => {
    const { type, id } = showDeleteModal;
    
    if (type === 'single') {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (id === activeSessionId) createNewSession();
    } else if (type === 'all') {
        setSessions([]);
        createNewSession();
    }
    
    setShowDeleteModal({ visible: false, type: null, id: null });
  };

  const DeleteModal = () => {
    if (!showDeleteModal.visible) return null;
    const isSingle = showDeleteModal.type === 'single';
    
    return (
      <div className="modal-overlay" onClick={() => setShowDeleteModal({ visible: false, type: null, id: null })}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>{isSingle ? 'Delete Topic?' : 'Clear Research History?'}</h3>
          <p>
            {isSingle 
              ? 'This will permanently delete this research session. This action cannot be undone.' 
              : 'This will permanently delete ALL your research sessions. This action cannot be undone.'}
          </p>
          <div className="modal-buttons">
            <button 
              className="btn-cancel" 
              onClick={() => setShowDeleteModal({ visible: false, type: null, id: null })}
            >
              Cancel
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              {isSingle ? 'Delete' : 'Clear All'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`chatbot-page ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div className="chat-background-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
      </div>

      <ResearchSideBar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
            setActiveSessionId(id);
            closeSidebarOnMobile(); 
        }}
        onDeleteSession={(id) => setShowDeleteModal({ visible: true, type: 'single', id })}
        onClearAllSessions={() => setShowDeleteModal({ visible: true, type: 'all', id: null })}
        createNewSession={createNewSession}
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar} 
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
                <img src={legalLogo} alt="Research AI" className="header-logo" />
                <span>Legal Research AI</span>
            </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && !isLoading ? (
            <div className="welcome-message">
              <h1>
                <img src={legalLogo} alt="Legal Research" className="welcome-logo" />
                Legal Research
              </h1>
              <p>Deep dive into case laws, statutes, and legal precedents.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <ResearchMessageRenderer message={message} />
              </div>
            ))
          )}
          {isLoading && (
            <div className="message ai">
              <div className="loading-indicator">
                <Loader size={16} className="spinner" /> Searching legal databases...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <form className="input-form" onSubmit={handleSendMessage}>
            <div className="input-container">
              <textarea
                ref={textareaRef} 
                className="message-input"
                value={userInput}
                onChange={handleInputChange} 
                placeholder="Search for cases, acts, or precedents..."
                disabled={isLoading}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                rows={1}
              />
              <button type="submit" className="send-button" disabled={isLoading || !userInput.trim()}>
                {isLoading ? <Loader size={16} /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <DeleteModal />
    </div>
  );
};

export default LegalResearch;