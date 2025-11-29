// src/pages/LegalChat/DocAnalyzer.jsx

import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import SharedChatLayout from '../shared/sharedChatLayout';
import DocAnalyzerModal from './DocAnalyzerModal'; 
import { DocAnalyzerAPI } from '../../../../api';

const DocAnalyzer = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  
  // Doc Analyzer Specific State
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [showModal, setShowModal] = useState(true); 
  const [currentDocName, setCurrentDocName] = useState('');

  // Reset Logic
  const resetSessionView = () => {
    setMessages([]);
    setIsSessionReady(false);
    setShowModal(true);
    setActiveSessionId('');
    setCurrentDocName('');
  };

  // Handlers
  const handleAnalysisComplete = ({ fileName, summary }) => {
    setShowModal(false);
    setIsSessionReady(true);
    setCurrentDocName(fileName);
    const newId = Date.now().toString();
    setActiveSessionId(newId);
    setMessages([{ 
        role: 'ai', 
        content: { type: 'structured', explanation: summary } 
    }]);
  };

  const openNewAnalysis = () => {
      setSessions([]);
      resetSessionView();
  };

  const processUserMessage = async (text) => {
    if (!text?.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setSessions(prev => {
        if (!prev.find(s => s.id === activeSessionId)) {
            return [{ id: activeSessionId, title: text.slice(0, 30) + '...' }, ...prev];
        }
        return prev;
    });

    setIsLoading(true);
    try {
        const data = await DocAnalyzerAPI.askQuestion(text);
        setMessages(prev => [...prev, {
            role: 'ai',
            content: { type: 'structured', explanation: data.answer }
        }]);
    } catch {
        setMessages(prev => [...prev, {
            role: 'error',
            content: { message: "I encountered an error retrieving the answer. Please ensure the document context is loaded." }
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const text = userInput;
    setUserInput('');
    await processUserMessage(text);
  };

  const handleDeleteSession = (id) => {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (id === activeSessionId) resetSessionView();
  };

  const handleClearAll = () => {
      setSessions([]);
      resetSessionView();
  };

  return (
    <>
      <DocAnalyzerModal 
        isOpen={showModal} 
        onAnalysisComplete={handleAnalysisComplete} 
      />

      <SharedChatLayout
        title="Doc Analyzer"
        subtitle="Your intelligent assistant for legal document analysis."
        placeholder={!isSessionReady ? "Upload a document to start..." : "Ask about your documents..."}
        logo="/legal-logo.webp"
        newChatLabel="New Analysis"
        NewChatIcon={FileText}
        
        // Pass Logic Props
        messages={messages}
        sessions={sessions}
        activeSessionId={activeSessionId}
        isLoading={isLoading}
        userInput={userInput}
        inputDisabled={!isSessionReady}
        
        // Pass Handlers
        onInputChange={setUserInput}
        onSendMessage={handleSendMessage}
        onSelectSession={(id) => {
            setActiveSessionId(id);
            setShowModal(false);
            setIsSessionReady(true);
        }}
        onCreateNewSession={openNewAnalysis}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAll}

        // Specific Slots
        headerExtraContent={currentDocName && (
            <span className="doc-header-filename" title={currentDocName}>
              {currentDocName}
            </span>
        )}
        inputStartAdornment={!isSessionReady && (
            <button 
                type="button" 
                className="upload-button" 
                onClick={() => setShowModal(true)} 
                title="Upload Document"
            >
                <Plus size={20} />
            </button>
        )}
      />
    </>
  );
};

export default DocAnalyzer;