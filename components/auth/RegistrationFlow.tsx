"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Check } from "lucide-react"
import { useUser, type OnboardingData, type RegistrationData, type SubscriptionPlan } from "@/lib/user-context"

interface RegistrationFlowProps {
  onSwitchToLogin: () => void
}

type Step = "account" | "survey" | "plans" | "payment"

const COMPANY_TYPES = ["Food & Beverage Manufacturer", "Ingredient Supplier", "Retailer", "Restaurant/Food Service", "Startup", "Research Institution", "Consulting", "Other"]
const COMPANY_SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"]
const ROLES = ["Product Developer", "R&D Manager", "Supply Chain Manager", "Marketing", "Executive/Founder", "Food Scientist", "Quality Assurance", "Other"]

export function RegistrationFlow({ onSwitchToLogin }: RegistrationFlowProps) {
  const { register, completeOnboarding, selectPlan } = useUser()
  const [step, setStep] = useState<Step>("account")
  const [accountData, setAccountData] = useState<Partial<RegistrationData>>({})
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({})
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountData.email || !accountData.password || !accountData.firstName || !accountData.lastName) return setError("All fields are required")
    if (accountData.password !== accountData.confirmPassword) return setError("Passwords do not match")
    console.log("[auth] Registration account step complete", { email: accountData.email })
    setError("")
    setStep("survey")
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onboardingData.role || !onboardingData.company || !onboardingData.companySize || !onboardingData.useCase) return setError("All fields are required")
    setError("")
    setStep("plans")
  }

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return
    setIsLoading(true)
    try {
      await register({
        firstName: accountData.firstName || "",
        lastName: accountData.lastName || "",
        email: accountData.email || "",
        password: accountData.password || "",
        company: onboardingData.company || "",
        companyType: "",
        jobTitle: "",
        phone: "",
        city: "",
        state: "",
        country: "",
      } as RegistrationData)

      completeOnboarding({
        role: onboardingData.role || "",
        company: onboardingData.company || "",
        companySize: onboardingData.companySize || "",
        useCase: onboardingData.useCase || "personal",
        useCaseReason: onboardingData.useCaseReason || "other",
      } as OnboardingData)

      selectPlan(selectedPlan, selectedPlan === "fresh")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "account" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <Image src="/next.svg" alt="Next.js" width={168} height={32} className="h-8 w-auto" priority />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Create Account</h1>
            <p className="text-slate-600 mb-6 text-center">Transform your food operations</p>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="First Name" value={accountData.firstName || ""} onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })} className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <input type="text" placeholder="Last Name" value={accountData.lastName || ""} onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })} className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <input type="email" placeholder="Email" value={accountData.email || ""} onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="password" placeholder="Password" value={accountData.password || ""} onChange={(e) => setAccountData({ ...accountData, password: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="password" placeholder="Confirm Password" value={accountData.confirmPassword || ""} onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors">Next: Tell Us About You</button>
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin} className="text-teal-500 font-medium hover:underline">
                  Log in
                </button>
              </p>
            </form>
          </div>
        )}

        {step === "survey" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button type="button" onClick={() => setStep("account")} className="flex items-center gap-1 text-teal-500 mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Tell Us About Yourself</h1>
            <p className="text-slate-600 mb-6">Help us personalize your JourneyFoods experience</p>
            <form onSubmit={handleSurveySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">What&apos;s your role?</label>
                <select value={onboardingData.role || ""} onChange={(e) => setOnboardingData({ ...onboardingData, role: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select a role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Type</label>
                <select value={onboardingData.company || ""} onChange={(e) => setOnboardingData({ ...onboardingData, company: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select company type</option>
                  {COMPANY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Size</label>
                <select value={onboardingData.companySize || ""} onChange={(e) => setOnboardingData({ ...onboardingData, companySize: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">Using JourneyFoods for...</label>
                <div className="space-y-2">
                  {["personal", "team"].map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="useCase" value={option} checked={onboardingData.useCase === option} onChange={(e) => setOnboardingData({ ...onboardingData, useCase: e.target.value as "personal" | "team" })} className="w-4 h-4" />
                      <span className="text-slate-700 capitalize">{option} use</span>
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors">Next: Choose a Plan</button>
            </form>
          </div>
        )}

        {step === "plans" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button type="button" onClick={() => setStep("survey")} className="flex items-center gap-1 text-teal-500 mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Plan</h1>
            <p className="text-slate-600 mb-6">Start free, upgrade anytime</p>
            <div className="space-y-3 mb-6">
              {["free_trial", "growth", "enterprise"].map((planId) => {
                const plans: Record<string, { name: string; price: string; features: string[] }> = {
                  free_trial: { name: "Free Trial", price: "$0", features: ["14-day trial", "50 searches/mo", "Basic analytics"] },
                  growth: { name: "Growth", price: "$499/mo", features: ["Unlimited searches", "Advanced analytics", "3 brands", "200 searches/mo"] },
                  enterprise: { name: "Enterprise", price: "Custom", features: ["Unlimited everything", "50+ users", "Dedicated support", "Custom integrations"] },
                }
                const plan = plans[planId]
                return (
                  <button key={planId} onClick={() => handlePlanSelect(planId as SubscriptionPlan)} className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedPlan === planId ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                      <span className="text-lg font-bold text-teal-600">{plan.price}</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-teal-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep("payment")} disabled={!selectedPlan} className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50">
              Continue to Payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button type="button" onClick={() => setStep("plans")} className="flex items-center gap-1 text-teal-500 mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Registration</h1>
            <p className="text-slate-600 mb-6">Set up your payment method</p>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-3">
                  Plan: <span className="font-semibold text-slate-900">{selectedPlan}</span>
                </p>
                <input type="text" placeholder="Card Number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3" defaultValue="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" defaultValue="12/25" />
                  <input type="text" placeholder="CVC" className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" defaultValue="123" />
                </div>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={isLoading} className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50">
                {isLoading ? "Processing..." : "Create Account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
