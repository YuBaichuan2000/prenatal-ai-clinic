// frontend/src/contexts/ChatContext.jsx
import React, { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const chatState = useChat('default-user');
  
  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};