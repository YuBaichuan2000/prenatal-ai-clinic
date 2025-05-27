// frontend/src/services/api.js
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for chat requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (development)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    
    if (error.response?.status === 503) {
      throw new Error('AI service temporarily unavailable');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests - please wait a moment');
    }
    
    throw error;
  }
);

// Chat API Functions
export const chatApi = {
  // Send a chat message
  sendMessage: async (message, conversationId = null, userId = 'default-user') => {
    try {
      const response = await apiClient.post('/api/chat', {
        message,
        conversation_id: conversationId,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to send message');
    }
  },

  // Get user's conversation history
  getConversations: async (userId = 'default-user') => {
    try {
      const response = await apiClient.get(`/api/conversations/${userId}`);
      return response.data.conversations;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch conversations');
    }
  },

  // Get messages from a specific conversation
  getConversationMessages: async (conversationId) => {
    try {
      const response = await apiClient.get(`/api/conversations/${conversationId}/messages`);
      return {
        conversation: response.data.conversation,
        messages: response.data.messages,
        totalMessages: response.data.total_messages
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch conversation messages');
    }
  },

  // Create a new conversation
  createNewConversation: async (userId = 'default-user', title = 'New Conversation') => {
    try {
      const response = await apiClient.post('/api/conversations/new', {
        user_id: userId,
        title
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create conversation');
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId, userId = 'default-user') => {
    try {
      const response = await apiClient.delete(`/api/conversations/${conversationId}`, {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete conversation');
    }
  }
};

// Health check API
export const healthApi = {
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Health check failed');
    }
  }
};

// Utility function to check if API is available
export const checkApiConnection = async () => {
  try {
    await healthApi.checkHealth();
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

export default apiClient;