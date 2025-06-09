"use client"
import { Baby, Plus, MessageCircle, Clock, Heart, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useChatContext } from "../../contexts/ChatContext"

const MainLayout = ({ children }) => {
  const { conversationId: urlConversationId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const {
    conversations,
    currentConversationId,
    loadConversation,
    startNewConversation,
    deleteConversation,
    isLoading,
  } = useChatContext()

  // Use URL conversation ID for highlighting, fallback to context
  const activeConversationId = urlConversationId || currentConversationId

  // Check which navigation item is active based on the current path
  const isActiveRoute = (routePath) => {
    if (routePath === '/chat') {
      return location.pathname === '/chat' || location.pathname.startsWith('/chat/')
    }
    return location.pathname === routePath
  }

  // Navigation items configuration
  const navigationItems = [
    {
      path: '/chat',
      icon: MessageCircle,
      label: 'Chat',
      onClick: () => {
        // Use replace to ensure navigation works from any chat state
        navigate('/chat', { replace: true })
      }
    },
    {
      path: '/pregnancy-tips',
      icon: Heart,
      label: 'Pregnancy Tips',
      onClick: () => {
        // Use replace to ensure navigation works from any chat state
        navigate('/pregnancy-tips', { replace: true })
      }
    },
    {
      path: '/appointments',
      icon: Clock,
      label: 'Appointments',
      onClick: () => {} // Placeholder for future feature
    }
  ]

  // Utility function to strip markdown formatting for preview
  const stripMarkdown = (text) => {
    if (!text) return ""
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
      .replace(/`(.*?)`/g, '$1')       // Remove inline code `text`
      .replace(/#{1,6}\s/g, '')        // Remove headers # ## ###
      .replace(/>\s/g, '')             // Remove blockquotes >
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url) -> text
      .replace(/\n+/g, ' ')            // Replace newlines with spaces
      .trim()
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleConversationClick = (conversationId) => {
    console.log("Clicking conversation:", conversationId, "Current:", currentConversationId)
    console.log("Available conversations:", conversations)
    // Always load the conversation, even if it's the same ID (for refresh purposes)
    loadConversation(conversationId)
  }

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation() // Prevent triggering conversation click
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      await deleteConversation(conversationId)
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="h-screen flex">
      {/* Medical Professional Sidebar */}
      <div className={`medical-sidebar flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Sidebar Header - Medical Branding */}
        <div className="p-6 border-b border-gray-200 relative">
          {!isSidebarCollapsed && (
            <>
              <div 
                className="flex items-center space-x-3 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/', { replace: true })}
                title="Go to Home"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Baby className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 clinic-heading">Prenatal AI Clinic</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="status-online status-indicator"></div>
                <span>AI Assistant Available</span>
              </div>
            </>
          )}
          
          {isSidebarCollapsed && (
            <div 
              className="flex justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/', { replace: true })}
              title="Go to Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Baby className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            )}
          </button>
        </div>

        {/* New Chat Section */}
        <div className="p-4">
          {isSidebarCollapsed ? (
            <button 
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors" 
              onClick={startNewConversation} 
              disabled={isLoading}
              title="New Conversation"
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          ) : (
            <button className="btn-primary w-full" onClick={startNewConversation} disabled={isLoading}>
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </button>
          )}
        </div>

        {/* Navigation & Features */}
        {!isSidebarCollapsed && (
          <div className="px-4 pb-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div 
                  key={item.path}
                  className={`sidebar-item ${isActiveRoute(item.path) ? 'sidebar-item-active' : ''} ${
                    item.path === '/appointments' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={item.path !== '/appointments' ? item.onClick : undefined}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.label}</span>
                  {item.path === '/appointments' && <span className="text-xs ml-auto">(Soon)</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed Navigation Icons */}
        {isSidebarCollapsed && (
          <div className="px-2 pb-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div 
                  key={item.path}
                  className={`flex justify-center p-2 rounded-lg transition-colors ${
                    isActiveRoute(item.path) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  } ${
                    item.path === '/appointments' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title={item.label}
                  onClick={item.path !== '/appointments' ? item.onClick : undefined}
                >
                  <item.icon className={`h-4 w-4 ${
                    isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="mb-4">
            {!isSidebarCollapsed && (
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Conversations ({conversations.length})</h3>
            )}

            {isLoading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`p-3 rounded-xl bg-gray-50 animate-pulse ${
                    isSidebarCollapsed ? 'h-8' : ''
                  }`}>
                    {!isSidebarCollapsed && (
                      <>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              // Empty state
              <div className={`text-center py-8 text-gray-500 ${isSidebarCollapsed ? 'py-4' : ''}`}>
                <MessageCircle className={`mx-auto mb-3 text-gray-300 ${
                  isSidebarCollapsed ? 'h-6 w-6' : 'h-12 w-12'
                }`} />
                {!isSidebarCollapsed && (
                  <>
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs">Start chatting to see your history here</p>
                  </>
                )}
              </div>
            ) : (
              // Conversation list
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    onClick={() => handleConversationClick(conversation.conversation_id)}
                    className={`group rounded-xl cursor-pointer transition-all duration-200 border relative ${
                      activeConversationId === conversation.conversation_id
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                    } ${isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}
                    title={isSidebarCollapsed ? conversation.title || "Untitled Conversation" : undefined}
                  >
                    {isSidebarCollapsed ? (
                      // Collapsed view - just show a dot or icon
                      <div className={`w-2 h-2 rounded-full ${
                        activeConversationId === conversation.conversation_id ? 'bg-blue-600' : 'bg-gray-400'
                      }`}></div>
                    ) : (
                      // Expanded view - full conversation details
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 mb-1 truncate">
                            {conversation.title || "Untitled Conversation"}
                          </div>
                          <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                            {stripMarkdown(conversation.last_message_preview) || "No messages yet"}
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTimeAgo(conversation.updated_at)}</span>
                            {conversation.message_count > 0 && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{conversation.message_count} messages</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteConversation(e, conversation.conversation_id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg ml-2"
                          title="Delete conversation"
                        >
                          <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medical Disclaimer Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 gradient-sidebar">
            <div className="text-xs text-gray-500 text-center leading-relaxed medical-text">
              <div className="font-medium text-gray-600 mb-1 medical-heading">Medical Disclaimer</div>
              Always consult your healthcare provider for medical advice and decisions.
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gradient-medical">{children}</div>
    </div>
  )
}

export default MainLayout
