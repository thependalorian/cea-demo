/**
 * ChatInput Component - ACT Climate Economy Assistant
 * 
 * Purpose: User input field for chat interface with attachments and voice support
 * Location: /app/components/ui/chat-input.tsx
 * Used by: Chat pages and conversation interfaces
 * 
 * Features:
 * - Auto-expanding textarea
 * - File attachment support
 * - Voice input option
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 * - Massachusetts climate branding
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Send, Paperclip, Mic, MicOff, X, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

// Chat input container variants
const chatInputContainerVariants = cva(
  "flex flex-col w-full rounded-lg border bg-white transition-shadow focus-within:shadow-md",
  {
    variants: {
      variant: {
        default: "border-sand-gray-200",
        error: "border-red-300",
        focused: "border-spring-green-400 ring-2 ring-spring-green-100",
      },
      size: {
        default: "p-3",
        sm: "p-2",
        lg: "p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChatInputProps 
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onError'>,
    VariantProps<typeof chatInputContainerVariants> {
  onSend: (message: string, attachments?: File[]) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  loading?: boolean
  enableAttachments?: boolean
  enableVoice?: boolean
  maxAttachments?: number
  acceptedFileTypes?: string
  maxAttachmentSize?: number // in MB
  voiceRecordingMaxDuration?: number // in seconds
  sendButtonLabel?: string
  attachmentButtonLabel?: string
  voiceButtonLabel?: string
  containerClassName?: string
  textareaClassName?: string
  actionsClassName?: string
  sendButtonClassName?: string
  attachmentButtonClassName?: string
  voiceButtonClassName?: string
  onError?: (error: string) => void
}

export function ChatInput({
  onSend,
  placeholder = "Type a message...",
  maxLength = 4000,
  disabled = false,
  loading = false,
  enableAttachments = true,
  enableVoice = false,
  maxAttachments = 5,
  acceptedFileTypes = "*",
  maxAttachmentSize = 10, // 10MB
  voiceRecordingMaxDuration = 60, // 60 seconds
  sendButtonLabel = "Send message",
  attachmentButtonLabel = "Attach files",
  voiceButtonLabel = "Voice input",
  variant,
  size,
  containerClassName,
  textareaClassName,
  actionsClassName,
  sendButtonClassName,
  attachmentButtonClassName,
  voiceButtonClassName,
  onError,
  className,
  ...props
}: ChatInputProps) {
  const [message, setMessage] = React.useState("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingTime, setRecordingTime] = React.useState(0)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const recordingTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  
  // Auto-resize textarea based on content
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [message])
  
  // Clean up recording timer on unmount
  React.useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])
  
  // Handle message submission
  const handleSend = () => {
    if (loading || disabled || (!message.trim() && attachments.length === 0)) return
    
    onSend(message.trim(), attachments.length > 0 ? attachments : undefined)
    setMessage("")
    setAttachments([])
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  // Handle file attachment
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Check if adding new files would exceed the limit
    if (attachments.length + files.length > maxAttachments) {
      onError?.(`You can only attach up to ${maxAttachments} files.`)
      return
    }
    
    // Check file sizes
    const newAttachments: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size > maxAttachmentSize * 1024 * 1024) {
        onError?.(`File "${file.name}" exceeds the maximum size of ${maxAttachmentSize}MB.`)
        continue
      }
      newAttachments.push(file)
    }
    
    setAttachments([...attachments, ...newAttachments])
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }
  
  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' })
        
        setAttachments([...attachments, audioFile])
        setIsRecording(false)
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop())
        
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
        
        setRecordingTime(0)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= voiceRecordingMaxDuration - 1) {
            // Stop recording when max duration is reached
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop()
            }
            return 0
          }
          return prev + 1
        })
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      onError?.('Could not access microphone. Please check your browser permissions.')
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div
      className={cn(
        chatInputContainerVariants({ 
          variant: isFocused ? "focused" : variant,
          size 
        }),
        containerClassName
      )}
    >
      {/* File attachments display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {attachments.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="flex items-center gap-1 bg-sand-gray-100 text-midnight-forest-800 text-xs rounded-full pl-2 pr-1 py-1"
            >
              <Paperclip className="h-3 w-3 text-sand-gray-500" />
              <span className="max-w-[150px] truncate">{file.name}</span>
                              <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => removeAttachment(index)}
                  className="rounded-full hover:bg-sand-gray-200 h-5 w-5 p-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3 w-3" />
                </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Voice recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 bg-red-100 text-red-700 text-xs rounded-full px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>Recording {formatTime(recordingTime)}</span>
          </div>
        </div>
      )}
      
      {/* Main input area */}
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled || loading}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none p-0 placeholder-sand-gray-400 text-midnight-forest-900",
            textareaClassName
          )}
          {...props}
        />
        
        {/* Action buttons */}
        <div className={cn("flex items-center gap-1 ml-2", actionsClassName)}>
          {/* Attachment button */}
          {enableAttachments && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || loading || attachments.length >= maxAttachments}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleAttachmentClick}
                disabled={disabled || loading || attachments.length >= maxAttachments}
                className={cn("text-sand-gray-500 hover:text-midnight-forest-700", attachmentButtonClassName)}
                aria-label={attachmentButtonLabel}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Voice button */}
          {enableVoice && (
            <Button
              type="button"
              variant={isRecording ? "destructive" : "ghost"}
              size="icon-sm"
              onClick={toggleRecording}
              disabled={disabled || loading}
              className={cn(
                "text-sand-gray-500 hover:text-midnight-forest-700",
                isRecording && "text-red-600 hover:text-red-700",
                voiceButtonClassName
              )}
              aria-label={voiceButtonLabel}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          {/* Send button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={disabled || loading || (!message.trim() && attachments.length === 0)}
            className={cn(
              "text-midnight-forest-900 ml-1",
              sendButtonClassName
            )}
            aria-label={sendButtonLabel}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Character counter */}
      {maxLength && (
        <div className="flex justify-end mt-1">
          <span className={cn(
            "text-xs",
            message.length > maxLength * 0.8 ? "text-amber-600" : "text-sand-gray-400"
          )}>
            {message.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
} 