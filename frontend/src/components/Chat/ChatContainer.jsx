// frontend/src/components/Chat/ChatContainer.jsx
import React, { useState, useEffect } from 'react';
import { Send, Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';

const ChatContainer = () => {
  const {
    messages,
    isLoading,
    isTyping,
    error,
    isConnected,
    sendMessage,
    retryMessage,
    clearError,
    messagesEndRef,
    currentConversationId
  } = useChatContext();

  const [inputMessage, setInputMessage] = useState('');
  const [forceRender, setForceRender] = useState(0);

  // Force re-render when messages change
  useEffect(() => {
    setForceRender(prev => prev + 1);
  }, [messages, currentConversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleQuickMessage = async (message) => {
    await sendMessage(message);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="medical-header px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Pregnancy Assistant</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span>Connection issues</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" key={forceRender}>
        {/* Simplified conditional logic */}
        {(() => {
          if (isLoading && messages.length === 0) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading conversation...</span>
                </div>
              </div>
            );
          } else if (messages.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation</h3>
                  <p className="text-gray-600 max-w-md">
                    Ask me anything about pregnancy, nutrition, exercises, or general prenatal care. 
                    I'm here to help with evidence-based information.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  <button
                    onClick={() => handleQuickMessage("What should I eat during my second trimester?")}
                    className="p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">Nutrition Questions</div>
                    <div className="text-sm text-gray-600">What to eat during pregnancy</div>
                  </button>
                  <button
                    onClick={() => handleQuickMessage("What exercises are safe during pregnancy?")}
                    className="p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-800">Exercise & Activity</div>
                    <div className="text-sm text-gray-600">Safe exercises and activities</div>
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <>
                {/* Messages */}
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onRetry={() => retryMessage(message.id)}
                  />
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="message-ai">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            );
          }
        })()}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about pregnancy, nutrition, exercises, or any prenatal questions..."
              className="input-primary resize-none"
              rows={1}
              style={{
                minHeight: '50px',
                maxHeight: '120px',
                resize: 'none'
              }}
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Always consult your healthcare provider for medical advice • Press Enter to send
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, onRetry }) => {
  const isUser = message.type === 'user';
  const hasError = message.status === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-3`}>
      {!isUser && (
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'ml-auto' : ''}`}>
        <div className={`${isUser ? 'message-user' : 'message-ai'} ${hasError ? 'border-red-200 bg-red-50' : ''}`}>
          {message.content}
          
          {hasError && (
            <div className="mt-2 pt-2 border-t border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600">{message.error}</span>
                <button
                  onClick={onRetry}
                  className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.status === 'sending' && <span className="ml-1">Sending...</span>}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;