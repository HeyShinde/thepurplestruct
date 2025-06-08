"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState } from 'react'
import { Sidebar } from "@/components/Sidebar"
import { FaBars, FaTimes } from 'react-icons/fa'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      {/* Mobile Header */}
      <header className="md:hidden bg-black/70 backdrop-blur-md border-b border-purple-900/40 sticky top-0 z-50 flex items-center justify-between p-4">
        {/* You can add a logo or title here if you want */}
        <div className="text-lg font-semibold text-purple-400">Dashboard</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle sidebar">
            {isSidebarOpen ? <FaTimes className="w-6 h-6 text-white" /> : <FaBars className="w-6 h-6 text-white" />}
        </button>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-40 h-full w-72 transform transition-transform duration-300 ease-in-out
            pt-16 md:pt-0 md:relative md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Overlay for mobile - no longer needed as the main content is not interactive when sidebar is open */}

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
} 