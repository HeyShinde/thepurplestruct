"use client"

import Link from 'next/link'
import { FaTachometerAlt, FaBook, FaUser, FaCog, FaSignOutAlt, FaTimes, FaHome, FaBookmark } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navLinks = [
  { name: 'Home', href: '/', icon: FaHome },
  { name: 'Dashboard', href: '/dashboard', icon: FaTachometerAlt },
  { name: 'My Courses', href: '/dashboard/courses', icon: FaBook },
  { name: 'Bookmarks', href: '/dashboard/bookmarks', icon: FaBookmark },
  { name: 'My Profile', href: '/dashboard/profile', icon: FaUser },
  { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
]

interface SidebarProps {
  onLinkClick: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-black border-r border-purple-400/20 text-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-400/20 md:hidden">
        <h2 className="text-lg font-semibold text-purple-400">Menu</h2>
        <button onClick={onLinkClick} aria-label="Close sidebar">
          <FaTimes className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4 pt-8 md:pt-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-400/20 text-purple-400 border border-purple-400/40'
                  : 'text-gray-300 hover:bg-purple-400/10 hover:text-purple-400'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </div>
      <div className="p-6 border-t border-purple-400/20">
        <button
          onClick={() => {
            signOut();
            onLinkClick();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
} 