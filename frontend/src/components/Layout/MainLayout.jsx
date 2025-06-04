"use client"
import { Baby, Plus, MessageCircle, Clock, Heart, Trash2 } from "lucide-react"
import { useChatContext } from "../../contexts/ChatContext"

const MainLayout = ({ children }) => {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    startNewConversation,
    deleteConversation,
    isLoading,
  } = useChatContext()

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
      <div className="w-80 medical-sidebar flex flex-col">
        {/* Sidebar Header - Medical Branding */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
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
        </div>

        {/* New Chat Section */}
        <div className="p-4">
          <button className="btn-primary w-full" onClick={startNewConversation} disabled={isLoading}>
            <Plus className="h-4 w-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Navigation & Features */}
        <div className="px-4 pb-4">
          <div className="space-y-1">
            <div className="sidebar-item sidebar-item-active">
              <MessageCircle className="h-4 w-4 mr-3" />
              <span>Chat</span>
            </div>
            <div className="sidebar-item">
              <Heart className="h-4 w-4 mr-3" />
              <span>Pregnancy Tips</span>
            </div>
            <div className="sidebar-item">
              <Clock className="h-4 w-4 mr-3" />
              <span>Appointments</span>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Conversations ({conversations.length})</h3>

            {isLoading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">Start chatting to see your history here</p>
              </div>
            ) : (
              // Conversation list
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    onClick={() => handleConversationClick(conversation.conversation_id)}
                    className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 border relative ${
                      currentConversationId === conversation.conversation_id
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 mb-1 truncate">
                          {conversation.title || "Untitled Conversation"}
                        </div>
                        <div className="text-xs text-gray-500 mb-1 line-clamp-2">
                          {conversation.last_message_preview && conversation.last_message_preview.length > 0
                            ? conversation.last_message_preview
                            : "No messages yet"}
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medical Disclaimer Footer */}
        <div className="p-4 border-t border-gray-200 gradient-sidebar">
          <div className="text-xs text-gray-500 text-center leading-relaxed medical-text">
            <div className="font-medium text-gray-600 mb-1 medical-heading">Medical Disclaimer</div>
            Always consult your healthcare provider for medical advice and decisions.
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gradient-medical">{children}</div>
    </div>
  )
}

export default MainLayout
