import React, { useState, useEffect } from 'react'
import { Heart, ChevronDown, ChevronUp, MessageCircle, Calendar, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { favoritesApi } from '../services/api'
import { format } from 'date-fns'

const PregnancyTips = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [removingItems, setRemovingItems] = useState(new Set())
  
  const navigate = useNavigate()

  // Load favorites when component mounts or page changes
  useEffect(() => {
    loadFavorites()
  }, [pagination.page])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await favoritesApi.getFavorites('default-user', pagination.page, pagination.limit)
      
      setFavorites(response.favorites)
      setPagination(response.pagination)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (messageId, favoriteId) => {
    try {
      setRemovingItems(prev => new Set(prev).add(favoriteId))
      
      await favoritesApi.removeFavorite(messageId)
      
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.favorite_id !== favoriteId))
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit)
      }))
      
      console.log('💔 Favorite removed from tips page')
    } catch (err) {
      console.error('Failed to remove favorite:', err)
      // Could show toast notification here
    } finally {
      setRemovingItems(prev => {
        const updated = new Set(prev)
        updated.delete(favoriteId)
        return updated
      })
    }
  }

  const handleGoToConversation = (conversationId, messageId) => {
    // Navigate to the specific conversation
    navigate(`/chat/${conversationId}`)
    
    // Note: We could potentially add message highlighting by passing messageId as state
    // navigate(`/chat/${conversationId}`, { state: { highlightMessageId: messageId } })
  }

  const toggleExpanded = (favoriteId) => {
    setExpandedItems(prev => {
      const updated = new Set(prev)
      if (updated.has(favoriteId)) {
        updated.delete(favoriteId)
      } else {
        updated.add(favoriteId)
      }
      return updated
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const stripMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/#{1,6}\s*(.*)/g, '$1') // Headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/^\s*[-*+]\s+/gm, '• ') // Unordered lists
      .replace(/^\s*\d+\.\s+/gm, '• ') // Ordered lists
      .trim()
  }

  if (loading && favorites.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="medical-header px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Pregnancy Tips</h2>
          <p className="text-gray-600 text-sm mt-1">Your saved AI responses and tips</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading your saved tips...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="medical-header px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Pregnancy Tips</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your saved AI responses and tips • {pagination.total} total
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadFavorites}
            className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved tips yet</h3>
              <p className="text-gray-600 max-w-md">
                Start a conversation with the AI and save helpful responses by clicking the heart icon.
                Your saved tips will appear here for easy reference.
              </p>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const isExpanded = expandedItems.has(favorite.favorite_id)
              const isRemoving = removingItems.has(favorite.favorite_id)
              const cleanContent = stripMarkdown(favorite.message_content)
              const shouldTruncate = cleanContent.length > 200

              return (
                <div
                  key={favorite.favorite_id}
                  className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 ${
                    isRemoving ? 'opacity-50' : 'hover:border-gray-300'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        {favorite.conversation_title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(favorite.favorited_at), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{format(new Date(favorite.message_timestamp), 'HH:mm')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFavorite(favorite.message_id, favorite.favorite_id)}
                      disabled={isRemoving}
                      className={`p-1 rounded-lg transition-all duration-200 ${
                        isRemoving 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove from favorites"
                    >
                      <Heart className={`h-4 w-4 fill-current ${isRemoving ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700 leading-relaxed mb-3">
                    {isExpanded || !shouldTruncate 
                      ? cleanContent 
                      : truncateText(cleanContent)
                    }
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleGoToConversation(favorite.conversation_id, favorite.message_id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>Go to conversation</span>
                    </button>
                    
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpanded(favorite.favorite_id)}
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} 
              <span className="mx-1">•</span>
              {pagination.total} total tips
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className={`p-2 rounded-lg transition-colors ${
                  pagination.hasPrev 
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                {pagination.page}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={`p-2 rounded-lg transition-colors ${
                  pagination.hasNext 
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PregnancyTips 