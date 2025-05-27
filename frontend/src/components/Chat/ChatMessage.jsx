// frontend/src/components/Chat/ChatMessage.jsx
import React from 'react'
import { Bot, User, Clock } from 'lucide-react'
import { format } from 'date-fns'

const ChatMessage = ({ message, timestamp, isUser, isLoading = false }) => {
  const formatTime = (date) => {
    if (!date) return ''
    return format(new Date(date), 'HH:mm')
  }

  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="message-ai">
            <div className="flex items-center space-x-2">
              <div className="loading-shimmer w-4 h-4 rounded"></div>
              <span className="text-gray-500 text-sm">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 mb-4 justify-end">
        <div className="flex-1 flex flex-col items-end">
          <div className="message-user">
            {message}
          </div>
          {timestamp && (
            <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatTime(timestamp)}</span>
            </div>
          )}
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="message-ai">
          {message}
        </div>
        {timestamp && (
          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formatTime(timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage