"use client"

import { useState } from "react"
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react"

const SITE_PASSWORD = "papaya"
const STORAGE_KEY = "jf-site-auth"

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(STORAGE_KEY) === "authenticated"
  })
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[auth] Password gate submitted")

    setTimeout(() => {
      if (password === SITE_PASSWORD) {
        localStorage.setItem(STORAGE_KEY, "authenticated")
        setIsAuthenticated(true)
      } else {
        setError("Incorrect password. Please try again.")
        setPassword("")
      }
      setIsLoading(false)
    }, 300)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Journey Foods</h1>
            <p className="text-slate-400 text-sm">This site is password protected</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Enter password to continue
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading || !password} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Enter Site"
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
