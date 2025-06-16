// frontend/src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MessageCircle, Heart, Baby, Sparkles, Shield, Clock, Wifi, WifiOff } from 'lucide-react'
import MainLayout from './components/Layout/MainLayout'
import ChatContainer from './components/Chat/ChatContainer'
import PregnancyTips from './components/PregnancyTips'
import { ChatContextProvider, useChatContext } from './contexts/ChatContext'
import { checkApiConnection } from './services/api'

// Welcome Screen Component (extracted from original App)
function WelcomeScreen({ isApiConnected }) {
  return (
    <MainLayout>
      {/* Combined Main Container */}
      <div className="w-full bg-white shadow-sm rounded-2xl px-6 py-8 max-w-3xl mx-auto mt-8 flex flex-col">
        {/* Profile + Heading Section */}
        <div className="flex flex-col md:flex-row items-center md:items-center mb-6">
          <div className="flex-shrink-0 flex justify-center items-center mb-4 md:mb-0 md:mr-8">
            <img
              src="/Dr-Tristan-Hardy.png"
              alt="Dr. Tristan Hardy"
              className="rounded-full object-cover shadow-lg border-4 border-white"
              style={{ width: 120, height: 120 }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center md:items-start w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center md:text-left">
              Welcome to <span className="prenatal-accent">Prenatal AI Clinic</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-600 leading-relaxed text-center md:text-left">
            Hello, my name is Dr. Tristan Hardy. Prenatal AI Clinic is the most advanced application, thoughtfully developed by myself and my expert technical team. We look forward to assisting you on your pregnancy journey.
            </p>
          </div>
        </div>
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-center">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-blue-800 mb-1">Trusted Information</div>
            <div className="text-xs text-blue-600">Evidence-based medical guidance</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-center">
            <Heart className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-green-800 mb-1">Personalized Care</div>
            <div className="text-xs text-green-600">Tailored to your pregnancy journey</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 text-center">
            <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-orange-800 mb-1">24/7 Available</div>
            <div className="text-xs text-orange-600">Support whenever you need it</div>
          </div>
        </div>
        {/* Demo Conversation Section */}
        <div className="bg-gray-50 rounded-2xl p-4 md:p-6 w-full">
          <div className="space-y-3">
            <div className="text-left">
              <div className="message-ai">
                Hello! I'm your prenatal AI assistant. I'm here to help with any questions about your pregnancy journey. How can I assist you today?
              </div>
            </div>
            <div className="text-right">
              <div className="message-user">
                I have questions about nutrition during my second trimester.
              </div>
            </div>
            <div className="text-left">
              <div className="message-ai">
                Great question! Second trimester nutrition is crucial for your baby's development. I'd be happy to provide guidance on nutrition, supplements, and healthy eating patterns. What specific aspects would you like to explore?
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// Main App Content Component (preserves existing logic)
function AppContent() {
  const [isApiConnected, setIsApiConnected] = useState(null)
  const { 
    conversations, 
    currentConversationId,
    loadConversation, 
    isLoading,
    messages,
    isNewConversationStarted
  } = useChatContext()
  const [hasCheckedInitialLoad, setHasCheckedInitialLoad] = useState(false)

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection()
      setIsApiConnected(connected)
    }
    
    checkConnection()
    
    // Check connection periodically - reduced frequency to avoid rate limiting
    const interval = setInterval(checkConnection, 120000) // Every 2 minutes instead of 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Auto-load conversation logic (preserved from original)
  // Only auto-load if we have a currentConversationId (from URL or localStorage)
  useEffect(() => {
    if (!hasCheckedInitialLoad && conversations.length > 0 && !isLoading && currentConversationId) {
      console.log('Auto-loading conversation logic triggered for:', currentConversationId);
      
      const persistedConversation = conversations.find(c => c.conversation_id === currentConversationId);
      if (persistedConversation) {
        console.log('Loading persisted conversation:', currentConversationId);
        loadConversation(currentConversationId);
        setHasCheckedInitialLoad(true);
        return;
      } else {
        console.log('Persisted conversation not found, clearing localStorage');
        // Clear invalid persisted ID
        localStorage.removeItem('currentConversationId');
      }
      setHasCheckedInitialLoad(true);
    } else if (!hasCheckedInitialLoad && conversations.length === 0 && !currentConversationId && !isLoading) {
      // No conversations exist AND no current conversation ID, mark as checked
      setHasCheckedInitialLoad(true);
    }
  }, [conversations, loadConversation, isLoading, hasCheckedInitialLoad, currentConversationId])

  // Show loading while we're checking for conversations or loading the initial conversation
  if (!hasCheckedInitialLoad || (currentConversationId && conversations.length > 0 && isLoading) || (currentConversationId && conversations.length === 0 && !isLoading)) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Loading your conversations...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  return {
    isApiConnected,
    conversations: conversations || [], // Ensure conversations is always an array
    hasCheckedInitialLoad
  }
}

// Route Components
function ChatRoute() {
  const result = AppContent()
  
  if (typeof result !== 'object') {
    return result // Return loading component
  }

  return (
    <MainLayout>
      <ChatContainer />
    </MainLayout>
  )
}

function HomeRoute() {
  // Make HomeRoute independent of chat context auto-loading to prevent 
  // automatic redirection to recent chat when clicking logo
  const [isApiConnected, setIsApiConnected] = useState(null)

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection()
      setIsApiConnected(connected)
    }
    
    checkConnection()
    
    // Check connection periodically - reduced frequency to avoid rate limiting
    const interval = setInterval(checkConnection, 120000) // Every 2 minutes instead of 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Always show welcome screen at home, no automatic redirection
  return <WelcomeScreen isApiConnected={isApiConnected} />
}

function PregnancyTipsRoute() {
  // Make this route independent of chat context to avoid navigation conflicts
  return (
    <MainLayout>
      <PregnancyTips />
    </MainLayout>
  )
}

// Main App Component with Router
function App() {
  return (
    <BrowserRouter>
      <ChatContextProvider>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/chat" element={<ChatRoute />} />
          <Route path="/chat/:conversationId" element={<ChatRoute />} />
          <Route path="/pregnancy-tips" element={<PregnancyTipsRoute />} />
        </Routes>
      </ChatContextProvider>
    </BrowserRouter>
  )
}

export default App