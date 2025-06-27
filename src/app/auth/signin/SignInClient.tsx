"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"
import { useState, useEffect, ReactNode } from "react"
import Cookies from 'js-cookie'

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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
  </div>
);

const BackgroundMotif = () => {
  // Fixed positions for elements
  const connectionPositions = [
    { top: "20%", left: "15%" },
    { top: "35%", left: "35%" },
    { top: "50%", left: "55%" },
    { top: "65%", left: "75%" },
    { top: "80%", left: "25%" },
    { top: "25%", left: "85%" },
    { top: "40%", left: "45%" },
    { top: "55%", left: "65%" },
  ];

  const particlePositions = [
    { top: "15%", left: "20%" },
    { top: "30%", left: "40%" },
    { top: "45%", left: "60%" },
    { top: "60%", left: "80%" },
    { top: "75%", left: "30%" },
    { top: "20%", left: "70%" },
    { top: "35%", left: "50%" },
    { top: "50%", left: "90%" },
    { top: "65%", left: "10%" },
    { top: "80%", left: "35%" },
    { top: "25%", left: "55%" },
    { top: "40%", left: "75%" },
  ];

  const nodePositions = [
    { top: "20%", left: "15%" },
    { top: "35%", left: "35%" },
    { top: "50%", left: "55%" },
    { top: "65%", left: "75%" },
    { top: "80%", left: "25%" },
    { top: "25%", left: "85%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neural Network Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(168,85,247,0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Neural Network Connections */}
      {connectionPositions.map((pos, i) => (
        <motion.div
          key={`connection-${i}`}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Connection lines */}
          {[...Array(3)].map((_, j) => (
            <motion.div
              key={`line-${i}-${j}`}
              className="absolute w-24 h-[1px] bg-gradient-to-r from-purple-400/60 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              style={{
                top: '50%',
                left: '100%',
                transform: `translateY(-50%) rotate(${j * 45}deg)`,
              }}
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3 + j * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Floating Particles */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{
            top: pos.top,
            left: pos.left,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Circles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            className="w-[300px] h-[300px] rounded-full border border-purple-400/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Neural Network Nodes */}
      {nodePositions.map((pos, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-purple-400/70 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function SignInClient() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<ReactNode | null>(null)

  useEffect(() => {
    const error = searchParams?.get("error")
    if (error === "OAuthAccountNotLinked") {
      setError("This email is already associated with a different account. Please sign in with the original provider.")
    } else if (error === "AccessDenied") {
      setError(
        <div className="space-y-2">
          <p>No account found with this email.</p>
          <p>
            Please{" "}
            <Link
              href="/auth/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors underline"
            >
              create an account
            </Link>{" "}
            first.
          </p>
        </div>
      )
    }
  }, [searchParams])

  if (status === "authenticated") {
    router.replace(callbackUrl)
  }

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider)
    setError(null)
    try {
      // Set a cookie to indicate this is a login attempt
      Cookies.set('next-auth.login-attempt', '1', { path: '/' })
      await signIn(provider, { callbackUrl })
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <BackgroundMotif />
      <div className="relative z-10 max-w-md w-full space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-neutral-400">Sign in to continue your journey</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 text-center text-red-300 bg-red-900/50 rounded-lg border border-red-500/30"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-purple-400/20 rounded-lg bg-black/40 backdrop-blur-sm text-gray-200 hover:bg-purple-400/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="group-hover:scale-110 transition-transform">
                  <GoogleIcon />
                </div>
                <span className="font-medium">Continue with Google</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn("github")}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-purple-400/20 rounded-lg bg-black/40 backdrop-blur-sm text-gray-200 hover:bg-purple-400/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "github" ? (
              <LoadingSpinner />
            ) : (
              <>
                <FaGithub className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="font-medium">Continue with GitHub</span>
              </>
            )}
          </button>
        </motion.div>

        <p className="mt-8 text-sm text-center text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-purple-400 hover:text-purple-300 transition-colors underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 