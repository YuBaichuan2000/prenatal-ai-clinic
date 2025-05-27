// frontend/src/components/Chat/ChatInput.jsx
import React, { useState } from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'

const ChatInput = ({ onSendMessage, isLoading = false, placeholder = "Ask about your pregnancy..." }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="input-primary resize-none min-h-[44px] max-h-32 py-3 pr-12"
            rows="1"
            style={{
              height: 'auto',
              minHeight: '44px',
              resize: 'none',
              lineHeight: '1.5'
            }}
            onInput={(e) => {
              // Auto-resize textarea
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          
          {/* Attachment Button */}
          <button
            type="button"
            className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Attach file (Coming soon)"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title="Voice input (Coming soon)"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              message.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            {isLoading ? (
              <div className="loading-shimmer w-5 h-5 rounded"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {/* Input Helper Text */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className={`${message.length > 500 ? 'text-orange-500' : ''}`}>
          {message.length}/1000
        </span>
      </div>
    </div>
  )
}

export default ChatInput