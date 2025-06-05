// frontend/src/hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../services/api';

export const useChat = (userId = 'default-user') => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isNewConversationStarted, setIsNewConversationStarted] = useState(false);

  // Refs for managing state
  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [userId]);

  // Auto-scroll when typing indicator changes
  useEffect(() => {
    if (isTyping) {
      // Small delay to ensure typing indicator is rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isTyping]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Immediate scroll to bottom (for instant feedback)
  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  // Scroll to a specific message by ID
  const scrollToMessage = (messageId) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Load user's conversations
  const loadConversations = useCallback(async () => {
    try {
      setError(null);
      const conversationList = await chatApi.getConversations(userId);
      console.log('Loaded conversations:', conversationList);
      setConversations(conversationList);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversation history');
      setIsConnected(false);
    }
  }, [userId]);

  // Load messages for a specific conversation
  const loadConversation = useCallback(async (conversationId) => {
    try {
      console.log('Loading conversation:', conversationId);
      setIsLoading(true);
      setError(null);
      
      // First verify the conversation exists in our list
      const conversation = conversations.find(c => c.conversation_id === conversationId);
      console.log('Found conversation:', conversation);
      
      if (!conversation) {
        console.warn('Conversation not found in local list, but attempting to load anyway');
      }
      
      const result = await chatApi.getConversationMessages(conversationId);
      console.log('API result:', result);
      
      const { messages: conversationMessages } = result;
      console.log('Loaded messages:', conversationMessages);
      
      // Check if conversationMessages is an array
      if (!Array.isArray(conversationMessages)) {
        console.error('Messages is not an array:', conversationMessages);
        throw new Error('Invalid messages format received from server');
      }
      
      // Transform backend messages to frontend format
      const formattedMessages = conversationMessages.map((msg, index) => {
        console.log(`Formatting message ${index}:`, msg);
        return {
          id: msg.message_id || `msg-${index}`,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          status: 'received',
          metadata: msg.metadata
        };
      });
      
      console.log('Formatted messages:', formattedMessages);
      console.log('Setting messages state with:', formattedMessages);
      
      // Use functional update to ensure state change
      setMessages(prevMessages => {
        console.log('Previous messages:', prevMessages);
        console.log('New messages:', formattedMessages);
        return formattedMessages;
      });
      
      setCurrentConversationId(conversationId);
      setIsConnected(true);
      setIsNewConversationStarted(false);
      
      // Force a small delay to ensure state has updated
      setTimeout(() => {
        console.log('State should be updated now');
      }, 100);
      
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError(`Failed to load conversation: ${err.message}`);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [conversations]);

  // Send a message
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim()) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Optimistically add user message
    const userMessage = {
      id: `temp-${Date.now()}`,
      type: 'user',
      content: messageContent.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);
    setIsNewConversationStarted(false);

    // Scroll to show the user's message at the top for better context
    setTimeout(() => {
      scrollToMessage(userMessage.id);
    }, 50);

    try {
      // Send message to backend
      const response = await chatApi.sendMessage(
        messageContent.trim(),
        currentConversationId,
        userId
      );

      // Update user message with real ID
      const updatedUserMessage = {
        ...userMessage,
        id: `user-${response.message_id}`,
        status: 'sent'
      };

      // Add AI response
      const aiMessage = {
        id: response.message_id,
        type: 'ai',
        content: response.response,
        timestamp: new Date(response.timestamp),
        status: 'received'
      };

      // Update messages
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== userMessage.id),
        updatedUserMessage,
        aiMessage
      ]);

      // Update current conversation ID if this was a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        // Reload conversations to show the new one
        loadConversations();
      }

      setIsConnected(true);
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Update user message to show error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error', error: err.message }
            : msg
        )
      );
      
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [currentConversationId, userId, loadConversations]);

  // Start a new conversation - FIXED to ensure chat interface shows
  const startNewConversation = useCallback(() => {
    console.log('Starting new conversation');
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
    setIsNewConversationStarted(true);
    
    // Remove the automatic welcome message to show the empty state UI
    // The ChatContainer.jsx will handle the empty state display
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId) => {
    try {
      await chatApi.deleteConversation(conversationId, userId);
      
      // Remove from conversations list
      setConversations(prev => 
        prev.filter(conv => conv.conversation_id !== conversationId)
      );
      
      // Clear messages if this was the current conversation
      if (conversationId === currentConversationId) {
        startNewConversation();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
    }
  }, [userId, currentConversationId, startNewConversation]);

  // Retry failed message
  const retryMessage = useCallback((messageId) => {
    const failedMessage = messages.find(msg => msg.id === messageId);
    if (failedMessage && failedMessage.status === 'error') {
      // Remove the failed message and resend
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      sendMessage(failedMessage.content);
    }
  }, [messages, sendMessage]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages,
    conversations,
    currentConversationId,
    isLoading,
    isTyping,
    error,
    isConnected,
    isNewConversationStarted,
    
    // Actions
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation,
    retryMessage,
    loadConversations,
    clearError,
    
    // Refs
    messagesEndRef,
    
    // Utils
    scrollToBottom,
    scrollToBottomImmediate,
    scrollToMessage
  };
};