// frontend/src/App.jsx
import React from 'react'
import { MessageCircle, Heart, Baby, Sparkles, Shield, Clock } from 'lucide-react'
import MainLayout from './components/Layout/MainLayout'

function App() {
  return (
    <MainLayout>
      {/* Professional Medical Welcome Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="max-w-2xl w-full">
          {/* Main Welcome Card */}
          <div className="medical-card text-center mb-8">
            {/* Header with Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Professional Heading */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to <span className="prenatal-accent">Prenatal AI Clinic</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Your AI-powered companion for pregnancy questions, guidance, and support. 
              Get personalized answers based on trusted medical resources and evidence-based care.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-blue-800 mb-1">Trusted Information</div>
                <div className="text-xs text-blue-600">Evidence-based medical guidance</div>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <Heart className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-green-800 mb-1">Personalized Care</div>
                <div className="text-xs text-green-600">Tailored to your pregnancy journey</div>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-orange-800 mb-1">24/7 Available</div>
                <div className="text-xs text-orange-600">Support whenever you need it</div>
              </div>
            </div>
            
            {/* Sample Chat Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="space-y-4 max-w-md mx-auto">
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
            
            {/* Call to Action */}
            <div className="space-y-4">
              <button className="btn-primary w-full md:w-auto px-8 py-3 text-base">
                <Sparkles className="h-5 w-5" />
                <span>Start Your First Conversation</span>
              </button>
              
              <div className="text-sm text-gray-500">
                Free to use • No registration required • HIPAA-compliant conversations
              </div>
            </div>
          </div>
          
          {/* Medical Disclaimer Card */}
          <div className="medical-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Important Medical Notice</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  This AI assistant provides general information and support. Always consult with your healthcare provider 
                  for medical advice, diagnosis, and treatment decisions. In case of emergencies, contact your doctor 
                  immediately or call emergency services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App