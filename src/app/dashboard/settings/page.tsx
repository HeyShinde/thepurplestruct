"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { FaGithub, FaSpinner } from "react-icons/fa"

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const ServiceIcon = ({ provider }: { provider: string }) => {
  switch (provider) {
    case 'google':
      return <GoogleIcon />;
    case 'github':
      return <FaGithub className="w-5 h-5 text-white" />;
    default:
      return null;
  }
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
  </div>
);

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [connectedProviders, setConnectedProviders] = useState<string[]>([])
  const [isFetchingProviders, setIsFetchingProviders] = useState(true)

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      if (session) {
        try {
          setIsFetchingProviders(true)
          const response = await fetch('/api/user/connected-accounts')
          if (response.ok) {
            const data = await response.json()
            setConnectedProviders(data.connectedProviders)
          }
        } catch {
          // console.error('Failed to fetch connected accounts', error)
        } finally {
          setIsFetchingProviders(false)
        }
      }
    }
    fetchConnectedAccounts()
  }, [session])

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    if (deleteConfirmation !== "DELETE") {
      setMessage("Please type DELETE to confirm account deletion")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete account")
      }

      await signOut({ callbackUrl: '/' })
    } catch (error){
      setMessage(error instanceof Error ? error.message : "An error occurred while deleting your account.")
      setShowDeleteConfirm(false)
      setDeleteConfirmation("")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isFetchingProviders) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-purple-400 text-lg">Loading your settings</div>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black text-white">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-900/80 to-black/90 py-14 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white leading-tight">
            Account Settings
          </h1>
          <p className="text-lg text-neutral-300">Manage your connected services and account preferences</p>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-900/50 text-green-300 border border-green-500/30"
                : "bg-red-900/50 text-red-300 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Connected Services Section */}
          <div className="bg-white/5 rounded-2xl border border-purple-400/20 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-400/20">
              <h2 className="text-2xl font-semibold text-purple-400">Connected Services</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {connectedProviders.length > 0 ? (
                  connectedProviders.map((provider) => (
                    <div key={provider} className="flex items-center p-4 bg-black/40 rounded-xl border border-purple-400/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-400/20">
                          <ServiceIcon provider={provider} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white capitalize">{provider}</h3>
                          <p className="text-sm text-neutral-400">Connected</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 text-center py-4">No services connected</p>
                )}
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white/5 rounded-2xl border border-purple-400/20 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-purple-400/20">
              <h2 className="text-2xl font-semibold text-purple-400">Delete Account</h2>
            </div>
            <div className="p-6">
              <p className="text-neutral-400 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              {showDeleteConfirm && (
                <div className="mb-6">
                  <p className="text-red-400 mb-2">This action cannot be undone. Type DELETE to confirm.</p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full px-4 py-2 bg-black/40 border border-red-500/30 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  showDeleteConfirm
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-black/40 hover:bg-black/60 text-white border border-purple-400/20 hover:border-purple-400/30"
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : showDeleteConfirm ? (
                  "Confirm Deletion"
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 