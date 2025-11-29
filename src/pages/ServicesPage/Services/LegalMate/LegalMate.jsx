// src/pages/LegalChat/LegalMate.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scale, Globe, BookOpen, BrainCircuit, ArrowRight } from 'lucide-react';
import SharedChatLayout from '../shared/sharedChatLayout';
import { 
  askAdaptive,
  getChatStrategy,
  getHistory, 
  deleteCurrentSession, 
  clearAllHistories,
  getSessionId, 
  clearAndResetSession 
} from '../../../../api';

// --- REASONING BADGE ---
const ReasoningBadge = ({ metadata }) => {
  if (!metadata || !metadata.strategy) return null;

  const { use_web, use_rag, use_general } = metadata.strategy;

  return (
    <div className="thinking-process-container">
      <span className="thinking-label">SOURCE:</span>
      
      {/* General Knowledge */}
      {use_general && !use_web && !use_rag && (
        <div className="thinking-tag tag-general">
          <BrainCircuit size={12} />
          <span>General Concept</span>
        </div>
      )}

      {/* Web Search */}
      {use_web && (
        <div className="thinking-tag tag-web">
          <Globe size={12} />
          <span>Live Web Search</span>
        </div>
      )}

      {/* RAG / Database */}
      {use_rag && (
        <div className="thinking-tag tag-rag">
          <BookOpen size={12} />
          <span>Legal Database</span>
        </div>
      )}
      
      {/* Connector Arrow */}
      {(use_web || use_rag) && (
        <ArrowRight size={12} className="thinking-arrow" />
      )}

      {/* Synthesis Badge */}
      {(use_web || use_rag) && (
        <div className="thinking-tag tag-synthesis">
          <BrainCircuit size={12} />
          <span>AI Synthesis</span>
        </div>
      )}
    </div>
  );
};

const formatResponse = (apiResponse) => {
  if (apiResponse.response) {
    return {
      type: 'structured',
      explanation: apiResponse.response,
      metadata: apiResponse.metadata || {},
    };
  }
  return { type: 'simple', content: 'Could not parse the API response.' };
};

const LegalMate = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const isNewSession = useRef(true);

  // Logic: Process Message
  const processUserMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMessage = { role: 'user', content: text };

    setMessages(prev => {
      if (prev.length === 0) {
        const currentId = activeSessionId || getSessionId();
        setSessions(currentSessions => {
           if (!currentSessions.some(s => s.id === currentId)) {
             return [{ id: currentId, title: text.substring(0, 40) + '...' }, ...currentSessions];
           }
           return currentSessions;
        });
      }
      return [...prev, userMessage];
    });

    setIsLoading(true);

    try {
      const tempAiMsgId = Date.now();
      
      let strategyMetadata = {};

      try {
          const planData = await getChatStrategy(text);
          strategyMetadata = {
            strategy: {
              use_rag: !!planData.rag_query,
              use_web: !!planData.web_query,
              use_general: planData.direct_answer_possible
            }
          };
          setMessages(prev => [
            ...prev, 
            { 
              role: 'ai', 
              id: tempAiMsgId,
              content: { 
                type: 'thinking', 
                metadata: strategyMetadata 
              } 
            }
          ]);

      } catch (planError) {
          console.warn("Could not fetch plan separately, falling back to standard loader", planError);
          setMessages(prev => [...prev, { role: 'ai', id: tempAiMsgId, content: { type: 'thinking', metadata: {} } }]);
      }

      const apiResponse = await askAdaptive(text); 
      const formattedResponse = formatResponse(apiResponse);

      setMessages(prev => prev.map(msg => {
          if (msg.id === tempAiMsgId) {
              return { role: 'ai', content: formattedResponse };
          }
          return msg;
      }));

    } catch (err) {
      const errorMessage = { role: 'error', content: { type: 'error', message: err.message } };
      setMessages(prev => [...prev.filter(msg => msg.content.type !== 'thinking'), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId]);

  // Logic: Initialization
  useEffect(() => {
    const initFreshSession = async () => {
      clearAndResetSession(); 
      const newId = getSessionId();
      setActiveSessionId(newId);
      setMessages([]);
      setSessions([]);
      setIsHistoryLoaded(true);
    };
    initFreshSession();
  }, []);

  // Logic: Load History
  useEffect(() => {
    const loadHistory = async () => {
      if (!activeSessionId) return;
      if (isNewSession.current) {
         isNewSession.current = false;
         setIsHistoryLoaded(true);
         return; 
      }
      setIsLoading(true);
      try {
        const historyData = await getHistory(activeSessionId);
        const formattedMessages = historyData.messages.map(msg => ({
          role: msg.type === 'human' ? 'user' : msg.type,
          content: msg.type === 'ai' ? formatResponse({ 
            response: msg.content, 
            metadata: msg.metadata || {} 
          }) : msg.content,
        }));
        setMessages(formattedMessages);
      } catch {
        setMessages([]);
      } finally {
        setIsLoading(false);
        setIsHistoryLoaded(true);
      }
    };
    if (activeSessionId) loadHistory();
  }, [activeSessionId]);

  // Logic: URL Params
  useEffect(() => {
    if (!isHistoryLoaded) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('new')) {
      createNewSession();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const queryParam = params.get('query');
    if (queryParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      processUserMessage(queryParam);
    }
  }, [isHistoryLoaded, processUserMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const text = userInput;
    setUserInput('');
    await processUserMessage(text);
  };

  const createNewSession = () => {
    clearAndResetSession();
    const newId = getSessionId();
    isNewSession.current = true; 
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleDeleteSession = async (id) => {
    try {
        await deleteCurrentSession(id);
        if (id === activeSessionId) createNewSession();
        setSessions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
        console.error("Failed delete:", error);
    }
  };

  const handleClearAll = async () => {
    try {
        await clearAllHistories();
        setSessions([]);
        createNewSession(); 
    } catch (error) {
        console.error("Failed clear all:", error);
    }
  };

  return (
    <SharedChatLayout
      title="LegalMate AI"
      subtitle="Your intelligent legal assistant for Indian law queries."
      placeholder="Ask me about Indian law..."
      logo="/legal-logo.webp"
      NewChatIcon={Scale}
      
      messages={messages}
      sessions={sessions}
      activeSessionId={activeSessionId}
      isLoading={isLoading}
      userInput={userInput}
      
      onInputChange={setUserInput}
      onSendMessage={handleSendMessage}
      onSelectSession={setActiveSessionId}
      onCreateNewSession={createNewSession}
      onDeleteSession={handleDeleteSession}
      onClearAllSessions={handleClearAll}
      renderBeforeMessage={(msg) => (
         msg.role === 'ai' && msg.content.metadata && (
             <ReasoningBadge metadata={msg.content.metadata} />
         )
      )}
    />
  );
};

export default LegalMate;