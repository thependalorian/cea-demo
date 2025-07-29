/**
 * ChatInterface Component - ACT Climate Economy Assistant
 * 
 * Purpose: Complete chat interface combining messages and input
 * Location: /app/components/ui/chat-interface.tsx
 * Used by: Chat pages and conversation interfaces
 * 
 * Features:
 * - Message list with scrolling
 * - Input area with attachments
 * - Optional voice input
 * - Massachusetts climate branding
 * - Accessibility features
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Bot, RefreshCw, Settings, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"

// Message type definition
export interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
}

// Chat container variants
const chatContainerVariants = cva(
  "flex flex-col w-full h-full bg-white overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-sand-gray-200 rounded-lg shadow-md",
        embedded: "border-0 shadow-none",
        glass: "glass-card backdrop-blur-md bg-white/70",
      },
      padding: {
        none: "",
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface ChatInterfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatContainerVariants> {
  messages: Message[]
  onSendMessage: (message: string, attachments?: File[]) => void
  isLoading?: boolean
  isStreaming?: boolean
  streamingContent?: string
  enableAttachments?: boolean
  enableVoice?: boolean
  enableCommands?: boolean
  showHeader?: boolean
  headerTitle?: string
  emptyState?: React.ReactNode
  onRegenerate?: () => void
  onClearChat?: () => void
  onSettings?: () => void
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  isStreaming = false,
  streamingContent = "",
  enableAttachments = true,
  enableVoice = false,
  enableCommands = false,
  showHeader = false,
  headerTitle = "Climate Economy Assistant",
  emptyState,
  onRegenerate,
  onClearChat,
  onSettings,
  variant,
  padding,
  className,
  ...props
}: ChatInterfaceProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = React.useState(true)
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, streamingContent, autoScroll])
  
  // Handle scroll events to detect if user has scrolled up
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
    setAutoScroll(isAtBottom)
  }
  
  // Create streaming message if needed
  const allMessages = React.useMemo(() => {
    if (isStreaming && streamingContent) {
      return [
        ...messages,
        {
          id: "streaming",
          content: streamingContent,
          role: "assistant" as const,
          timestamp: new Date(),
        },
      ]
    }
    return messages
  }, [messages, isStreaming, streamingContent])
  
  // Show empty state when no messages and not loading
  const showEmptyState = !isLoading && messages.length === 0 && !isStreaming

  return (
    <div
      className={cn(
        chatContainerVariants({ variant, padding }),
        "flex flex-col h-full",
        className
      )}
      {...props}
    >
      {/* Chat Header */}
      {showHeader && (
        <div className="flex items-center justify-between border-b border-sand-gray-200 pb-3 mb-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-spring-green-100 flex items-center justify-center mr-2">
              <Bot className="h-4 w-4 text-midnight-forest-700" />
            </div>
            <h2 className="text-lg font-medium text-midnight-forest-900">{headerTitle}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {onSettings && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onSettings}
                className="text-sand-gray-500 hover:text-midnight-forest-700"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            
            {onClearChat && messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClearChat}
                className="text-sand-gray-500 hover:text-midnight-forest-700"
                aria-label="Clear chat"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto px-1 pb-4 scroll-smooth"
        onScroll={handleScroll}
      >
        {showEmptyState ? (
          <div className="h-full flex items-center justify-center">
            {emptyState || (
              <div className="text-center p-6 max-w-md mx-auto">
                <div className="w-16 h-16 bg-spring-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-spring-green-700" />
                </div>
                <h3 className="text-xl font-medium text-midnight-forest-900 mb-2">
                  Welcome to the Climate Economy Assistant
                </h3>
                <p className="text-sand-gray-600 mb-6">
                  I can help you find clean energy opportunities, translate your skills for the climate economy, 
                  and connect you with Massachusetts resources.
                </p>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-medium text-midnight-forest-800">Try asking:</p>
                  <div className="bg-sand-gray-50 p-2 rounded-md text-sm">
                    "What clean energy jobs are growing in Massachusetts?"
                  </div>
                  <div className="bg-sand-gray-50 p-2 rounded-md text-sm">
                    "How can I translate my military experience to climate jobs?"
                  </div>
                  <div className="bg-sand-gray-50 p-2 rounded-md text-sm">
                    "What training programs are available for solar installation?"
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Message List */}
            {allMessages.map((message, index) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
                isLoading={isLoading && index === allMessages.length - 1 && message.role === "assistant"}
                showActions={message.role === "assistant"}
                onRegenerate={index === allMessages.length - 1 && message.role === "assistant" ? onRegenerate : undefined}
              />
            ))}
            
            {/* Loading indicator for first message */}
            {isLoading && messages.length === 0 && (
              <ChatMessage
                content=""
                role="assistant"
                isLoading={true}
              />
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input Area */}
      <div className="mt-auto pt-4 border-t border-sand-gray-200">
        {!autoScroll && messages.length > 2 && (
          <div className="flex justify-center mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAutoScroll(true)
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="text-sand-gray-600 text-xs py-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Scroll to bottom
            </Button>
          </div>
        )}
        
        <ChatInput
          onSend={onSendMessage}
          loading={isLoading}
          disabled={isLoading && !isStreaming}
          enableAttachments={enableAttachments}
          enableVoice={enableVoice}
          placeholder="Type your message..."
          maxLength={4000}
        />
        
        {/* Command palette or suggestions could go here */}
        {enableCommands && (
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendMessage("What clean energy jobs are growing in Massachusetts?")}
              className="text-xs bg-sand-gray-50 hover:bg-sand-gray-100 text-sand-gray-700"
            >
              Clean energy jobs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendMessage("How can I translate my skills to climate jobs?")}
              className="text-xs bg-sand-gray-50 hover:bg-sand-gray-100 text-sand-gray-700"
            >
              Skill translation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendMessage("What training programs are available in Massachusetts?")}
              className="text-xs bg-sand-gray-50 hover:bg-sand-gray-100 text-sand-gray-700"
            >
              Training programs
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}