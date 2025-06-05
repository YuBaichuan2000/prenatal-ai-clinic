import { useState, useEffect, useRef } from 'react'

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState(null)
  
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current
      
      // Configuration
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      
      // Event handlers
      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }
      
      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = finalTranscriptRef.current
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcriptPart = result[0].transcript
          
          if (result.isFinal) {
            finalTranscript += transcriptPart + ' '
          } else {
            interimTranscript += transcriptPart
          }
        }
        
        finalTranscriptRef.current = finalTranscript
        setTranscript(finalTranscript + interimTranscript)
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
        
        // Handle specific error types
        switch (event.error) {
          case 'network':
            setError('Network error occurred during speech recognition')
            break
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone permissions.')
            break
          case 'no-speech':
            setError('No speech was detected. Please try again.')
            break
          case 'audio-capture':
            setError('No microphone was found. Please ensure a microphone is connected.')
            break
          default:
            setError(`Speech recognition error: ${event.error}`)
        }
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser')
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && isSupported && !isListening) {
      finalTranscriptRef.current = ''
      setTranscript('')
      setError(null)
      
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting speech recognition:', err)
        setError('Failed to start speech recognition')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
    finalTranscriptRef.current = ''
  }

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
}

export default useSpeechRecognition 