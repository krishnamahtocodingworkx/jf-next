"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type SubscriptionStatus = "none" | "trial" | "active" | "expired"
export type SubscriptionPlan = "supplier" | "fresh" | "starter" | "growth" | "group" | "enterprise" | "guava" | null

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  companyType?: string
  companySize?: string
  role?: string
  jobTitle?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  useCase?: "personal" | "team"
  useCaseReason?: string
  subscriptionStatus: SubscriptionStatus
  subscriptionPlan: SubscriptionPlan
  trialEndsAt?: string
  onboardingCompleted: boolean
  createdAt: string
}

export interface OnboardingData {
  role: string
  company: string
  companySize: string
  useCase: "personal" | "team"
  useCaseReason: string
}

export interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
  company: string
  companyType: string
  jobTitle: string
  phone: string
  city: string
  state: string
  country: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegistrationData) => Promise<boolean>
  completeOnboarding: (data: OnboardingData) => void
  selectPlan: (plan: SubscriptionPlan, isTrial: boolean) => void
  updateUser: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = "journeyfoods_user"

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const DEFAULT_USER: User = {
  id: "demo-user-001",
  email: "riana@journeyfoods.com",
  firstName: "Riana",
  lastName: "Lynn",
  company: "JourneyFoods",
  companyType: "Food & Beverage",
  jobTitle: "CEO",
  phone: "+1 (512) 555-0123",
  city: "Austin",
  state: "Texas",
  country: "United States",
  subscriptionStatus: "active",
  subscriptionPlan: "starter",
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER)
  const [isLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      console.log("[auth] User persisted to localStorage", { email: user.email })
    }
  }, [user])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log("[auth] Login attempt", { email })
    console.log("[auth] Password length", { length: password.length })

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.email === email) {
        setUser(parsed)
        console.log("[auth] Login success using stored user", { email })
        return true
      }
    }

    const newUser: User = {
      id: generateId(),
      email,
      firstName: email.split("@")[0],
      lastName: "",
      subscriptionStatus: "none",
      subscriptionPlan: null,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    console.log("[auth] Login fallback user created", { email })
    return true
  }, [])

  const logout = useCallback(() => {
    console.log("[auth] Logout called")
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const register = useCallback(async (data: RegistrationData): Promise<boolean> => {
    console.log("[auth] Register called", { email: data.email })

    const newUser: User = {
      id: generateId(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      companyType: data.companyType,
      jobTitle: data.jobTitle,
      phone: data.phone,
      city: data.city,
      state: data.state,
      country: data.country,
      subscriptionStatus: "none",
      subscriptionPlan: null,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return true
  }, [])

  const completeOnboarding = useCallback((data: OnboardingData) => {
    console.log("[auth] Complete onboarding", data)
    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        role: data.role,
        company: data.company || prev.company,
        companySize: data.companySize,
        useCase: data.useCase,
        useCaseReason: data.useCaseReason,
        onboardingCompleted: true,
      }
    })
  }, [])

  const selectPlan = useCallback((plan: SubscriptionPlan, isTrial: boolean) => {
    console.log("[auth] Plan selected", { plan, isTrial })
    setUser((prev) => {
      if (!prev) return prev
      const trialEndsAt = isTrial ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : undefined
      return {
        ...prev,
        subscriptionPlan: plan,
        subscriptionStatus: isTrial ? "trial" : "active",
        trialEndsAt,
        onboardingCompleted: true,
      }
    })
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    console.log("[auth] Update user", updates)
    setUser((prev) => {
      if (!prev) return prev
      return { ...prev, ...updates }
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        completeOnboarding,
        selectPlan,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
