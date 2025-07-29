'use client'

import { useState } from 'react'
import ConversationsList from '@/components/ConversationsList'

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } bg-base-200 transition-all duration-300 overflow-hidden border-r`}
      >
        <ConversationsList />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="navbar bg-base-100 border-b">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}