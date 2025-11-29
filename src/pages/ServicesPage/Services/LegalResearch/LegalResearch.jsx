// src/pages/LegalChat/LegalResearch.jsx

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import SharedChatLayout from '../shared/sharedChatLayout';
import { fetchLegalResearchAnswer } from '../../../../api';
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
    try {
        const aiResponseText = await fetchLegalResearchAnswer(text); 
        const aiMessage = { 
            role: 'ai', 
            content: { 
                type: 'structured', 
                explanation: aiResponseText 
            } 
        };
        setMessages(prev => [...prev, aiMessage]);
        
    } catch (error) {
        console.error("Legal Research API Error:", error);
        const errorMessage = {
            role: 'ai',
            content: {
                type: 'structured',
                explanation: `**Error:** Failed to fetch legal research. Please check the server connection and API keys. Details: _${error.message}_`
            }
        };
        setMessages(prev => [...prev, errorMessage]);
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