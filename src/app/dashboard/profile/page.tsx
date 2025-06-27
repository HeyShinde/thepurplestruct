"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session, update, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        await update({ name }) // Using update to refresh session
        setMessage("Profile updated successfully!")
        setIsEditing(false)
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update profile")
      }
    } catch {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  if (status === "loading") {
    return <div className="text-white text-center p-10">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black py-12 relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: `url('/themes/projects-background.svg')`,
        backgroundSize: '220px 220px'
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
        </motion.div>

        {message && (
            <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-6 rounded-lg text-center ${
                message.includes("successfully")
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
            >
            {message}
            </motion.div>
        )}
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">Name</label>
                            <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/10 text-white border-purple-400/50 border rounded-lg py-2 px-3 focus:ring-purple-500 focus:border-purple-500"
                            required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        key="display"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-6 mb-8">
                            {session?.user?.image && (
                                <Image src={session.user.image} alt="User" width={80} height={80} className="rounded-full" />
                            )}
                            <div>
                                <h2 className="text-3xl font-bold">{session?.user?.name}</h2>
                                <p className="text-purple-300">{session?.user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Edit Profile
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 