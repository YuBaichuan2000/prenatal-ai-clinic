import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Calendar, Heart, Dumbbell, TestTube, Users, Check } from 'lucide-react'
import { useChatContext } from '../../contexts/ChatContext'

const PrenatalRoadmap = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  const [completedItems, setCompletedItems] = useState({})
  const { messages, conversations } = useChatContext()

  // Roadmap data organized by trimesters
  const roadmapData = {
    'First Trimester (1-12 weeks)': {
      icon: Calendar,
      color: 'green',
      categories: {
        'Diet & Nutrition': {
          icon: Heart,
          items: [
            {
              id: 'folic-acid',
              title: 'Start taking folic acid (400-800 mcg daily)',
              details: 'Essential for preventing neural tube defects. Start before conception if possible.',
              priority: 'high'
            },
            {
              id: 'prenatal-vitamins',
              title: 'Begin prenatal vitamins',
              details: 'Choose vitamins with iron, calcium, and DHA. Consult your healthcare provider.',
              priority: 'high'
            },
            {
              id: 'avoid-harmful-foods',
              title: 'Avoid harmful foods and substances',
              details: 'Raw fish, deli meats, alcohol, high-mercury fish, unpasteurized products.',
              priority: 'high'
            }
          ]
        },
        'Exercise & Wellness': {
          icon: Dumbbell,
          items: [
            {
              id: 'gentle-exercise',
              title: 'Establish gentle exercise routine',
              details: 'Walking, swimming, prenatal yoga. Aim for 30 minutes most days.',
              priority: 'medium'
            },
            {
              id: 'sleep-routine',
              title: 'Optimize sleep habits',
              details: 'Aim for 7-9 hours nightly. Use pregnancy pillows if needed.',
              priority: 'medium'
            }
          ]
        },
        'Medical Care': {
          icon: TestTube,
          items: [
            {
              id: 'first-prenatal-visit',
              title: 'Schedule first prenatal appointment',
              details: 'Usually between 8-12 weeks. Confirm pregnancy and establish care.',
              priority: 'high'
            },
            {
              id: 'genetic-counseling',
              title: 'Consider genetic counseling consultation',
              details: 'Especially important if you have family history of genetic conditions.',
              priority: 'medium'
            }
          ]
        },
        'Family History': {
          icon: Users,
          items: [
            {
              id: 'family-medical-history',
              title: 'Compile family medical history',
              details: 'Both maternal and paternal family histories of genetic conditions, pregnancy complications.',
              priority: 'high'
            }
          ]
        }
      }
    },
    'Second Trimester (13-26 weeks)': {
      icon: Calendar,
      color: 'blue',
      categories: {
        'Diet & Nutrition': {
          icon: Heart,
          items: [
            {
              id: 'calcium-increase',
              title: 'Increase calcium intake (1000mg daily)',
              details: 'Critical for baby\'s bone development. Include dairy, leafy greens, fortified foods.',
              priority: 'high'
            },
            {
              id: 'protein-focus',
              title: 'Focus on protein-rich foods',
              details: 'Aim for 75-100g daily from lean meats, beans, eggs, nuts.',
              priority: 'medium'
            }
          ]
        },
        'Exercise & Wellness': {
          icon: Dumbbell,
          items: [
            {
              id: 'pelvic-floor-exercises',
              title: 'Start pelvic floor exercises (Kegels)',
              details: 'Help prevent incontinence and prepare for delivery. Practice daily.',
              priority: 'high'
            },
            {
              id: 'prenatal-classes',
              title: 'Research prenatal classes',
              details: 'Childbirth education, breastfeeding, newborn care classes.',
              priority: 'medium'
            }
          ]
        },
        'Medical Care': {
          icon: TestTube,
          items: [
            {
              id: 'anatomy-scan',
              title: 'Schedule anatomy scan (18-22 weeks)',
              details: 'Detailed ultrasound to check baby\'s development and anatomy.',
              priority: 'high'
            },
            {
              id: 'genetic-testing',
              title: 'Complete genetic testing if recommended',
              details: 'Quad screen, cell-free DNA testing, or amniocentesis as advised.',
              priority: 'medium'
            }
          ]
        },
        'Family History': {
          icon: Users,
          items: [
            {
              id: 'partner-history',
              title: 'Review partner\'s family history',
              details: 'Important for understanding genetic risks and planning care.',
              priority: 'medium'
            }
          ]
        }
      }
    },
    'Third Trimester (27-40 weeks)': {
      icon: Calendar,
      color: 'purple',
      categories: {
        'Diet & Nutrition': {
          icon: Heart,
          items: [
            {
              id: 'iron-rich-foods',
              title: 'Emphasize iron-rich foods',
              details: 'Prevent anemia. Include red meat, spinach, lentils, fortified cereals.',
              priority: 'high'
            },
            {
              id: 'frequent-small-meals',
              title: 'Eat frequent, small meals',
              details: 'Helps with heartburn and provides steady energy as space becomes limited.',
              priority: 'medium'
            }
          ]
        },
        'Exercise & Wellness': {
          icon: Dumbbell,
          items: [
            {
              id: 'birth-prep-exercises',
              title: 'Practice birth preparation exercises',
              details: 'Breathing techniques, relaxation methods, birthing positions.',
              priority: 'high'
            },
            {
              id: 'hospital-bag',
              title: 'Prepare hospital bag (36 weeks)',
              details: 'Pack essentials for labor, delivery, and postpartum stay.',
              priority: 'high'
            }
          ]
        },
        'Medical Care': {
          icon: TestTube,
          items: [
            {
              id: 'group-b-strep',
              title: 'Group B Strep screening (35-37 weeks)',
              details: 'Routine test to check for bacteria that could affect baby during delivery.',
              priority: 'high'
            },
            {
              id: 'birth-plan',
              title: 'Finalize birth plan',
              details: 'Discuss preferences with healthcare team, including pain management options.',
              priority: 'medium'
            }
          ]
        },
        'Family History': {
          icon: Users,
          items: [
            {
              id: 'newborn-care-plan',
              title: 'Plan newborn care support',
              details: 'Arrange family help, discuss childcare plans, prepare siblings.',
              priority: 'medium'
            }
          ]
        }
      }
    }
  }

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('prenatalRoadmapProgress')
    if (savedProgress) {
      setCompletedItems(JSON.parse(savedProgress))
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prenatalRoadmapProgress', JSON.stringify(completedItems))
  }, [completedItems])

  // Analyze chat history for adaptive suggestions (basic implementation)
  const analyzeProgress = () => {
    if (!messages || messages.length === 0) return {}
    
    const suggestions = {}
    const allMessages = messages.map(m => m.content.toLowerCase()).join(' ')
    
    // Simple keyword detection for suggestions
    if (allMessages.includes('genetic') || allMessages.includes('testing')) {
      suggestions['genetic-testing'] = true
      suggestions['genetic-counseling'] = true
    }
    if (allMessages.includes('nutrition') || allMessages.includes('diet')) {
      suggestions['folic-acid'] = true
      suggestions['prenatal-vitamins'] = true
    }
    if (allMessages.includes('exercise') || allMessages.includes('workout')) {
      suggestions['gentle-exercise'] = true
      suggestions['pelvic-floor-exercises'] = true
    }
    
    return suggestions
  }

  const suggestions = analyzeProgress()

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleItem = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-50 to-emerald-50 border-green-200 text-green-800',
      blue: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-800',
      purple: 'from-purple-50 to-violet-50 border-purple-200 text-purple-800'
    }
    return colors[color] || colors.blue
  }

  const calculateProgress = (trimester) => {
    const allItems = Object.values(roadmapData[trimester].categories)
      .flatMap(category => category.items)
    const completedCount = allItems.filter(item => completedItems[item.id]).length
    return allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0
  }

  return (
    <div className={`bg-white border-l border-gray-200 transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-12' : 'w-96'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 relative">
        {!isCollapsed && (
          <div className="pr-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Prenatal Journey</h2>
            <p className="text-sm text-gray-600">Track your pregnancy milestones</p>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          title={isCollapsed ? "Expand roadmap" : "Collapse roadmap"}
        >
          {isCollapsed ? (
            <ChevronLeft className="h-3 w-3 text-gray-600" />
          ) : (
            <ChevronRight className="h-3 w-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(roadmapData).map(([trimester, data]) => {
            const progress = calculateProgress(trimester)
            return (
              <div key={trimester} className={`rounded-xl border bg-gradient-to-br ${getColorClasses(data.color)} p-4`}>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection(trimester)}
                >
                  <div className="flex items-center space-x-3">
                    <data.icon className="h-5 w-5" />
                    <div>
                      <h3 className="font-semibold text-sm">{trimester}</h3>
                      <div className="text-xs opacity-75">{progress}% complete</div>
                    </div>
                  </div>
                  {expandedSections[trimester] ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {expandedSections[trimester] && (
                  <div className="mt-4 space-y-3">
                    {Object.entries(data.categories).map(([categoryName, category]) => (
                      <div key={categoryName} className="bg-white bg-opacity-60 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <category.icon className="h-4 w-4" />
                          <h4 className="font-medium text-sm">{categoryName}</h4>
                        </div>
                        <div className="space-y-2">
                          {category.items.map((item) => (
                            <div key={item.id} className="flex items-start space-x-2">
                              <button
                                onClick={() => toggleItem(item.id)}
                                className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                  completedItems[item.id]
                                    ? 'bg-current border-current text-white'
                                    : 'border-gray-400 hover:border-current'
                                }`}
                              >
                                {completedItems[item.id] && <Check className="h-2.5 w-2.5" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm ${completedItems[item.id] ? 'line-through opacity-75' : ''}`}>
                                  {item.title}
                                  {suggestions[item.id] && (
                                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                      Suggested
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs opacity-75 mt-1">{item.details}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 p-2">
          <div className="space-y-2">
            {Object.entries(roadmapData).map(([trimester, data]) => {
              const progress = calculateProgress(trimester)
              return (
                <div key={trimester} className="flex flex-col items-center" title={trimester}>
                  <data.icon className={`h-5 w-5 text-${data.color}-600 mb-1`} />
                  <div className="text-xs font-medium">{progress}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PrenatalRoadmap 