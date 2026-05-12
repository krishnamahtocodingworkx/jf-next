"use client"

import { useState } from "react"
import Image from "next/image"
import { useUser } from "@/lib/user-context"

interface LoginPageProps {
  onSwitchToRegister: () => void
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[auth] Login form submitted", { email })

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid email or password")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative bg-white overflow-hidden">
        <div className="absolute top-8 left-8 z-10">
          <Image src="/next.svg" alt="Next.js" width={168} height={32} className="h-8 w-auto" priority />
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 200 Q100 300 50 500 Q0 700 200 750" stroke="url(#curveGradient1)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="150" cy="500" r="120" stroke="url(#curveGradient2)" strokeWidth="4" fill="none" />
          <path d="M150 380 Q350 350 400 500 Q450 650 600 700" stroke="url(#curveGradient3)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <defs>
            <linearGradient id="curveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="curveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="curveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="flex justify-end items-center p-6">
          <span className="text-sm text-slate-500 mr-2">Need an account?</span>
          <button onClick={onSwitchToRegister} className="text-sm text-teal-500 hover:text-teal-600 font-medium">
            Create account
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold text-slate-800 text-center mb-8">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

              <div>
                <input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <button type="submit" disabled={isLoading} className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center">
                <button type="button" className="text-sm text-teal-500 hover:text-teal-600">
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
