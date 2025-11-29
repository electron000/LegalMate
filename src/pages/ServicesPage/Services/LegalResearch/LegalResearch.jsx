// src/pages/LegalChat/LegalResearch.jsx

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import SharedChatLayout from '../shared/sharedChatLayout';

const LegalResearch = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');

  // Logic
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
    // Simulation Logic
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const text = userInput;
    setUserInput('');
    await processUserMessage(text);
  };

  const createNewSession = () => {
    const newId = Date.now().toString(); 
    setActiveSessionId(newId);
    setMessages([]);
  };

  const handleDeleteSession = (id) => {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (id === activeSessionId) createNewSession();
  };

  const handleClearAll = () => {
      setSessions([]);
      createNewSession();
  };

  return (
    <SharedChatLayout
      title="Legal Research"
      subtitle="Deep dive into case laws, statutes, and legal precedents."
      placeholder="Search for cases, acts, or precedents..."
      logo="/legal-logo.webp"
      newChatLabel="New Research"
      NewChatIcon={BookOpen}
      
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
    />
  );
};

export default LegalResearch;