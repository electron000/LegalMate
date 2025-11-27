import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, Loader, Menu, Plus, 
  Trash2, MessageSquare, ShieldX, SquarePen, AlertTriangle, FileText, UploadCloud 
} from 'lucide-react';
import '../shared/ChatInterface.css';
import legalLogo from '../../../../assets/legal-logo.png'; 
import DocAnalyzerModal from './DocAnalyzerModal'; 
import { DocAnalyzerAPI } from '../../../../api';

// --- Message Renderer Component (No Changes) ---
const DocMessageRenderer = ({ message }) => {
  if (message.role === 'user') {
    return <p>{message.content}</p>;
  }

  if (message.role === 'error') {
    return (
      <div className="error-header">
        <AlertTriangle size={20} />
        <div>
          <h3>Error occurred</h3>
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

// --- Sidebar Component (No Changes) ---
const DocSideBar = ({
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
              aria-label="New Chat"
              title="New Chat"
            >
              <SquarePen size={20} />
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
              <SquarePen size={18} className="plus-icon"/>
              <span>New analysis</span>
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
                    <span className="thread-title">{session.title || 'New Analysis'}</span>
                  </button>
                  
                  <button 
                    className="delete-session-btn" 
                    aria-label="Delete chat"
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
              <span>Clear all history</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const DocAnalyzer = () => {
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [showModal, setShowModal] = useState(true); 
  
  const [currentDocName, setCurrentDocName] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState({ visible: false, type: null, id: null });
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // --- MODAL INTEGRATION HANDLERS ---
  
  const handleAnalysisComplete = ({ fileName, summary }) => {
    setShowModal(false);
    setIsSessionReady(true);
    setCurrentDocName(fileName);

    const newId = Date.now().toString();
    setActiveSessionId(newId);

    // Initial message with summary from backend
    const initialMessages = [
        { 
            role: 'ai', 
            content: { 
                type: 'structured', 
                explanation: `## Analysis Ready for: ${fileName}\n\nI have successfully processed your document. Here is the summary:\n\n${summary}\n\n**You may now ask specific questions regarding this document.**` 
            } 
        }
    ];
    setMessages(initialMessages);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const openNewAnalysis = () => {
      setMessages([]);
      setIsSessionReady(false);
      setShowModal(true);
      closeSidebarOnMobile();
  };

  // --- EXISTING HANDLERS ---

  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarExpanded(false);
    }
  };

  const processUserMessage = async (text) => {
    if (!text || !text.trim()) return;

    // 1. Add User Message
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);

    // Update session title if new
    setSessions(prev => {
        if (!prev.find(s => s.id === activeSessionId)) {
            return [{ id: activeSessionId, title: text.slice(0, 30) + '...' }, ...prev];
        }
        return prev;
    });

    setIsLoading(true);

    try {
        // 2. ACTUAL API CALL TO QnA ENDPOINT
        const data = await DocAnalyzerAPI.askQuestion(text);
        
        const aiResponse = {
            role: 'ai',
            content: {
                type: 'structured',
                explanation: data.answer // Backend returns { answer: "..." }
            }
        };
        setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
        console.error("QnA Error:", error);
        const errorResponse = {
            role: 'error',
            content: {
                message: "I encountered an error retrieving the answer. Please ensure the document context is loaded."
            }
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
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

  const handleDelete = () => {
    const { type, id } = showDeleteModal;
    if (type === 'single') {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (id === activeSessionId) {
            openNewAnalysis();
        }
    } else if (type === 'all') {
        setSessions([]);
        openNewAnalysis();
    }
    setShowDeleteModal({ visible: false, type: null, id: null });
  };

  const DeleteModal = () => {
    if (!showDeleteModal.visible) return null;
    const isSingle = showDeleteModal.type === 'single';
    
    return (
      <div className="modal-overlay" onClick={() => setShowDeleteModal({ visible: false, type: null, id: null })}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>{isSingle ? 'Delete Analysis?' : 'Clear All History?'}</h3>
          <p>
            {isSingle 
              ? 'This will permanently delete this analysis session.' 
              : 'This will permanently delete ALL your analysis sessions.'}
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

      <DocAnalyzerModal 
        isOpen={showModal} 
        onClose={handleModalClose} 
        onAnalysisComplete={handleAnalysisComplete}
      />

      <DocSideBar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
            setActiveSessionId(id);
            setShowModal(false);
            setIsSessionReady(true);
            closeSidebarOnMobile(); 
        }}
        onDeleteSession={(id) => setShowDeleteModal({ visible: true, type: 'single', id })}
        onClearAllSessions={() => setShowDeleteModal({ visible: true, type: 'all', id: null })}
        createNewSession={openNewAnalysis}
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
                <img src={legalLogo} alt="DocAnalyzer" className="header-logo" onError={(e) => e.target.style.display='none'} />
                <span>Doc Analyzer</span>
                {currentDocName && <span className="text-xs ml-2 text-gray-500 font-normal border-l pl-2 border-gray-300">{currentDocName}</span>}
            </div>
        </div>

        {!isSessionReady ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                <FileText size={64} className="mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Document Loaded</h2>
                <p className="max-w-md text-gray-500 mb-6">
                    Please upload a legal document (Contract, Agreement, Judgment) to start the analysis session.
                </p>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                >
                    <UploadCloud size={20} />
                    Upload Document
                </button>
            </div>
        ) : (
            <>
                <div className="chat-messages">
                    {messages.length === 0 && !isLoading ? (
                    <div className="welcome-message">
                        <h1>
                        <img src={legalLogo} alt="DocAnalyzer" className="welcome-logo" onError={(e) => e.target.style.display='none'} />
                        Doc Analyzer
                        </h1>
                        <p>Your intelligent assistant for legal document analysis.</p>
                    </div>
                    ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                        <DocMessageRenderer message={message} />
                        </div>
                    ))
                    )}
                    {isLoading && (
                    <div className="message ai">
                        <div className="loading-indicator">
                        <Loader size={16} className="spinner" /> Analyzing your document...
                        </div>
                    </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="input-area">
                    <form className="input-form" onSubmit={handleSendMessage}>
                    <div className="input-container">
                        <input 
                        type="file" 
                        accept=".pdf,.docx,.txt" 
                        ref={fileInputRef}
                        onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) setUserInput(prev => (prev ? prev + " " : "") + `[Attached: ${file.name}]`);
                        }}
                        style={{ display: 'none' }} 
                        />
                        <button 
                        type="button" 
                        className="upload-button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload additional reference"
                        >
                        <Plus size={20} />
                        </button>

                        <textarea
                        ref={textareaRef} 
                        className="message-input"
                        value={userInput}
                        onChange={handleInputChange} 
                        placeholder="Ask about your documents..."
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
            </>
        )}
      </main>
      
      <DeleteModal />
    </div>
  );
};

export default DocAnalyzer;