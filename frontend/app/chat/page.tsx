/**
 * Main chat page using the unified ChatInterface
 * Location: app/chat/page.tsx
 */

"use client";

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/chat/ChatInterface'

import type { Message } from '@/components/chat/ChatInterface'
import { Section } from '@/components/ui/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('')
  
  // DEMO MODE: API key management
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('')
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true)
  const [apiKeyError, setApiKeyError] = useState<string>('')
  const [keyValidated, setKeyValidated] = useState<boolean>(false)
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Add demo welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: "Welcome to the Climate Economy Assistant (CEA) demo! I'm here to help with your questions about Massachusetts clean energy careers, skills, and job opportunities. To use the chat functionality, you'll need to provide your own OpenAI API key.",
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // Function to validate API key format
  const validateApiKey = (key: string) => {
    const apiKeyRegex = /^sk-[A-Za-z0-9_-]+$/;
    return apiKeyRegex.test(key);
  };
  
  const handleApiKeySubmit = () => {
    if (!openaiApiKey) {
      setApiKeyError('API key is required');
      return;
    }
    
    if (!validateApiKey(openaiApiKey)) {
      setApiKeyError('Invalid API key format. It should start with "sk-" followed by alphanumeric characters.');
      return;
    }
    
    // Store in localStorage for session persistence
    localStorage.setItem('openai_api_key', openaiApiKey);
    setKeyValidated(true);
    setShowApiKeyInput(false);
    setApiKeyError('');
    
    // Add a confirmation message
    const confirmationMessage: Message = {
      id: 'api-confirmed',
      content: "API key accepted! You can now chat with the Climate Economy Assistant. Feel free to ask questions about Massachusetts clean energy careers, skills needed for different roles, job market trends, and more.",
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };
  
  // Check for existing API key in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setOpenaiApiKey(savedKey);
      setKeyValidated(true);
      setShowApiKeyInput(false);
    }
  }, []);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() || isLoading) return
    
    // DEMO MODE: Prevent sending if API key not provided
    if (!keyValidated) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Please provide your OpenAI API key before sending messages.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setIsStreaming(false)
    setCurrentStreamingMessage('')

    try {
      // Prepare request body
      const requestBody: Record<string, unknown> = { 
        content: content.trim(),
        user_id: crypto.randomUUID(), // Generate proper UUID
        conversation_id: crypto.randomUUID() // Generate proper UUID for conversation
      }

      // Handle file attachments
      if (attachments && attachments.length > 0) {
        const files = await Promise.all(
          attachments.map(async (file) => {
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
            })
            
            return {
              filename: file.name,
              content: base64.split(',')[1], // Remove data URL prefix
              mime_type: file.type
            }
          })
        )
        requestBody.files = files
      }

      // Call API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': openaiApiKey
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is streaming
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        setIsStreaming(true)
        
        // Add initial assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '',
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        let accumulatedContent = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Decode the chunk
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // Stream complete
                setIsStreaming(false)
                setCurrentStreamingMessage('')
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.response) {
                  accumulatedContent += parsed.response
                  setCurrentStreamingMessage(accumulatedContent)
                  
                  // Update the last message
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = accumulatedContent
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } else {
        // Handle regular JSON response
        const data = await response.json()

        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message?.content || data.response || 'Sorry, I couldn\'t process your request.',
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setCurrentStreamingMessage('')
      abortControllerRef.current = null
    }
  }

  return (
    <Section className="flex flex-col h-[calc(100vh-4rem)] p-0">
      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Enter OpenAI API Key</h2>
            <p className="text-sm text-gray-600 mb-4">
              This demo requires your own OpenAI API key to function. Your key is stored only in your browser and is sent directly to OpenAI.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Input 
                  type="password" 
                  placeholder="sk-..." 
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="pr-10 w-full"
                />
                {openaiApiKey && (
                  <button
                    onClick={() => setOpenaiApiKey('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear API key"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <Button onClick={handleApiKeySubmit}>
                Submit
              </Button>
            </div>
            {apiKeyError && <p className="text-red-500 text-sm">{apiKeyError}</p>}
            <div className="mt-4 text-xs text-gray-500">
              <p>You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI</a>.</p>
              <p>For security, your API key is stored only in your browser's local storage and is never saved on our servers.</p>
            </div>
          </Card>
        </div>
      )}
      
      {/* API Key Management (when already validated) */}
      {keyValidated && (
        <div className="bg-base-200 border-b border-base-300 p-2 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">API Key:</span> •••••••••••••••••
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('openai_api_key');
                setOpenaiApiKey('');
                setKeyValidated(false);
                setShowApiKeyInput(true);
              }}
              className="flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear API Key
            </Button>
          </div>
        </div>
      )}
      
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        disabled={isLoading}
        className="flex-1"
      />
    </Section>
  )
} 