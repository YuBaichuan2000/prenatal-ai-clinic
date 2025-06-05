// frontend/src/components/Chat/ChatInput.jsx
import React, { useState, useEffect } from 'react'
import { Send, Paperclip, Mic, MicOff, AlertCircle } from 'lucide-react'
import useSpeechRecognition from '../../hooks/useSpeechRecognition'

const ChatInput = ({ onSendMessage, isLoading = false, placeholder = "Ask about your pregnancy..." }) => {
  const [message, setMessage] = useState('')
  
  const {
    isListening,
    transcript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  // Update message with speech transcript
  useEffect(() => {
    if (transcript) {
      setMessage(transcript)
    }
  }, [transcript])

  // Auto-stop listening after 30 seconds to prevent indefinite recording
  useEffect(() => {
    let timer
    if (isListening) {
      timer = setTimeout(() => {
        stopListening()
      }, 30000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isListening, stopListening])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
      resetTranscript()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleVoiceInput = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Safari, or Edge.')
      return
    }

    if (isListening) {
      stopListening()
    } else {
      // Clear any existing content before starting new recording
      setMessage('')
      resetTranscript()
      startListening()
    }
  }

  const handleManualTextChange = (e) => {
    const newValue = e.target.value
    setMessage(newValue)
    
    // If user starts typing manually while recording, stop the recording
    if (isListening && newValue !== transcript) {
      stopListening()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Speech Error Display */}
      {speechError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Recording Indicator */}
      {isListening && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700 font-medium">Recording... Speak now</span>
          </div>
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={stopListening}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Stop
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleManualTextChange}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : placeholder}
            disabled={isLoading}
            className={`input-primary resize-none min-h-[44px] max-h-32 py-3 px-4 ${
              isListening ? 'bg-blue-50 border-blue-200' : ''
            }`}
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isLoading || !isSupported}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                : isSupported
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title={
              !isSupported 
                ? 'Speech recognition not supported in this browser' 
                : isListening 
                ? 'Stop recording' 
                : 'Start voice input'
            }
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
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
      <div className="mt-3 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-4">
          <span>Always consult your healthcare provider for medical advice</span>
          <span>•</span>
          <span>Press Enter to send</span>
          {isSupported && (
            <>
              <span>•</span>
              <span className="text-blue-600">Click mic to use voice input</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput