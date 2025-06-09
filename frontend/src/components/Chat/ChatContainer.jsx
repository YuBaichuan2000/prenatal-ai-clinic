// frontend/src/components/Chat/ChatContainer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

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
    currentConversationId,
    scrollToBottomImmediate,
    scrollToMessage
  } = useChatContext();

  const handleQuickMessage = async (message) => {
    await sendMessage(message);
    // The sendMessage function will handle the scrolling to show the user's message
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
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
                {/* Scroll anchor for consistent behavior */}
                <div ref={messagesEndRef} />
              </div>
            );
          } else {
            return (
              <>
                {/* Messages */}
                {messages.map((message, index) => (
                  <div key={message.id} data-message-id={message.id}>
                    <ChatMessage
                      message={message.content}
                      timestamp={message.timestamp}
                      isUser={message.type === 'user'}
                      isLoading={false}
                      messageId={message.id}
                      conversationId={currentConversationId}
                    />
                    {message.status === 'error' && (
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-red-600">{message.error}</span>
                          <button
                            onClick={() => retryMessage(message.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <ChatMessage
                    message=""
                    isUser={false}
                    isLoading={true}
                    messageId={null}
                    conversationId={currentConversationId}
                  />
                )}
                
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            );
          }
        })()}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleQuickMessage}
        isLoading={isTyping}
        placeholder="Ask me about pregnancy, nutrition, exercises, or any prenatal questions..."
      />
    </div>
  );
};

export default ChatContainer;