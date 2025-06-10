import React, { useState } from 'react'
import { Info, X } from 'lucide-react'

const TopHeader = () => {
  const [isDefinitionVisible, setIsDefinitionVisible] = useState(true)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 shadow-sm">
      {isDefinitionVisible && (
        <div className="px-6 py-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-blue-700">
                  <span className="font-semibold">"Prenatal"</span> refers to anything relating to the period before birth, specifically during pregnancy.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDefinitionVisible(false)}
              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-lg hover:bg-blue-100"
              title="Hide definition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {!isDefinitionVisible && (
        <div className="px-6 py-2">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setIsDefinitionVisible(true)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
              title="Show prenatal definition"
            >
              <Info className="h-3 w-3" />
              <span>Show prenatal definition</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopHeader 