// frontend/src/components/Chat/ChatMessage.jsx
import React from 'react'
import { Bot, User, Clock } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

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
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              // Ensure proper line breaks
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              // Style links properly
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target={href?.startsWith('http') ? '_blank' : '_self'}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              // Ensure lists render properly
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              // Style headings
              h1: ({ children }) => <h1 className="text-xl font-semibold mb-3 text-gray-800">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-gray-800">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold mb-2 text-gray-800">{children}</h3>,
              // Style code blocks
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto mb-3">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              },
              // Style blockquotes
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic bg-gray-50 py-2 mb-3">
                  {children}
                </blockquote>
              ),
              // Style tables
              table: ({ children }) => (
                <div className="overflow-x-auto mb-3">
                  <table className="min-w-full border-collapse border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-3 py-2">
                  {children}
                </td>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
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