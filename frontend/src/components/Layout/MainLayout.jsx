// frontend/src/components/Layout/MainLayout.jsx
import React from 'react'
import { Baby, Plus, MessageCircle, Clock, Heart } from 'lucide-react'

const MainLayout = ({ children }) => {
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
              <h1 className="text-lg font-bold text-gray-900">Prenatal AI Clinic</h1>
              <p className="text-xs text-gray-500 font-medium">Your pregnancy companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="status-online status-indicator"></div>
            <span>AI Assistant Available</span>
          </div>
        </div>
        
        {/* New Chat Section */}
        <div className="p-4">
          <button className="btn-primary w-full">
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
        <div className="flex-1 px-4 pb-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {/* Professional Chat History Items */}
              <div className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="text-sm font-medium text-gray-800 mb-1">Prenatal Nutrition Guide</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  2 hours ago
                </div>
              </div>
              
              <div className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="text-sm font-medium text-gray-800 mb-1">Exercise During Pregnancy</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Yesterday
                </div>
              </div>
              
              <div className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="text-sm font-medium text-gray-800 mb-1">Sleep & Rest Guidelines</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  3 days ago
                </div>
              </div>
              
              <div className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200">
                <div className="text-sm font-medium text-gray-800 mb-1">First Trimester Questions</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  1 week ago
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical Disclaimer Footer */}
        <div className="p-4 border-t border-gray-200 gradient-sidebar">
          <div className="text-xs text-gray-500 text-center leading-relaxed">
            <div className="font-medium text-gray-600 mb-1">Medical Disclaimer</div>
            Always consult your healthcare provider for medical advice and decisions.
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gradient-medical">
        {children}
      </div>
    </div>
  )
}

export default MainLayout