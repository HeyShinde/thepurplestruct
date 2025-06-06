"use client"

import { useSession } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import Link from "next/link"
import { FaHome, FaBook, FaUser, FaCog, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa"
import Image from "next/image"
import { signOut } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  console.log({ session, status })
  const pathname = usePathname()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "My Courses", href: "/dashboard/courses", icon: <FaBook /> },
    { name: "Profile", href: "/dashboard/profile", icon: <FaUser /> },
    { name: "Settings", href: "/dashboard/settings", icon: <FaCog /> },
  ]

  // Top nav bar links
  const topNav = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Courses", href: "/courses", icon: <FaBook /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-md border-b border-purple-900/40 h-16 flex items-center px-8">
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            <Image src="/images/profile-img.webp" alt="Logo" width={36} height={36} className="rounded-full border-2 border-purple-500" />
            HeyShinde
          </Link>
          {topNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white hover:bg-purple-900/40 transition-colors ${pathname === item.href ? "bg-purple-900/60 text-purple-300" : ""}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white hover:bg-purple-900/40 transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen bg-black/70 border-r border-purple-900/40 flex flex-col items-stretch py-8 px-4 relative z-30">
          {/* User Info */}
          <div className="flex flex-col items-center mb-10">
            <Image src={session?.user?.image || "/images/profile-img.webp"} alt="Avatar" width={64} height={64} className="rounded-full border-2 border-purple-500 shadow-lg" />
            <h2 className="mt-4 text-lg font-semibold text-white">{session?.user?.name || "User"}</h2>
            <p className="text-sm text-purple-300">{session?.user?.email}</p>
          </div>
          {/* Nav Items */}
          <nav className="flex flex-col gap-2 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-colors text-white hover:bg-purple-900/40 hover:text-purple-300 ${pathname === item.href ? "bg-purple-900/60 text-purple-300 border-l-4 border-purple-500" : ""}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Logout at bottom for mobile UX, hidden on desktop since it's in top nav */}
          <button
            onClick={() => signOut()}
            className="mt-8 flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white hover:bg-purple-900/40 transition-colors md:hidden"
          >
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 bg-transparent min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
} 