"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useUser, type OnboardingData } from "@/lib/user-context"

const COMPANY_TYPES = ["Food & Beverage Manufacturer", "Ingredient Supplier", "Retailer", "Restaurant/Food Service", "Startup", "Research Institution", "Consulting", "Other"]
const COMPANY_SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"]
const ROLES = ["Product Developer", "R&D Manager", "Supply Chain Manager", "Marketing", "Executive/Founder", "Food Scientist", "Quality Assurance", "Other"]
const REASONS = [
  { id: "product-dev", label: "Product development" },
  { id: "ingredient-sourcing", label: "Ingredient sourcing" },
  { id: "compliance", label: "Compliance & regulatory" },
  { id: "cost-optimization", label: "Cost optimization" },
  { id: "sustainability", label: "Sustainability tracking" },
  { id: "market-research", label: "Market research" },
]

export function OnboardingSurvey() {
  const { completeOnboarding } = useUser()
  const [error, setError] = useState("")

  const [surveyData, setSurveyData] = useState<OnboardingData>({
    role: "",
    company: "",
    companySize: "",
    useCase: "team",
    useCaseReason: "",
  })

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyData.role || !surveyData.company || !surveyData.companySize || !surveyData.useCase || !surveyData.useCaseReason) {
      setError("Please complete all required fields")
      return
    }
    console.log("[auth] Onboarding submitted", surveyData)
    setError("")
    completeOnboarding(surveyData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Image src="/next.svg" alt="Next.js" width={168} height={32} className="h-8 w-auto" priority />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome!</h1>
          <p className="text-slate-600 mb-8">Let us know a bit about you to personalize your experience</p>

          <form onSubmit={handleSurveySubmit} className="space-y-6">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Your Role</label>
                <select value={surveyData.role} onChange={(e) => setSurveyData({ ...surveyData, role: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select a role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Company Size</label>
                <select value={surveyData.companySize} onChange={(e) => setSurveyData({ ...surveyData, companySize: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Company Type</label>
              <select value={surveyData.company} onChange={(e) => setSurveyData({ ...surveyData, company: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select company type</option>
                {COMPANY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">How will you use JourneyFoods?</label>
              <div className="space-y-2">
                {["personal", "team"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="useCase" value={option} checked={surveyData.useCase === option} onChange={(e) => setSurveyData({ ...surveyData, useCase: e.target.value as "personal" | "team" })} className="w-4 h-4" />
                    <span className="text-slate-700 capitalize">{option} use</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">What do you want to accomplish?</label>
              <div className="space-y-2">
                {REASONS.map((reason) => (
                  <label key={reason.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="reason" value={reason.id} checked={surveyData.useCaseReason === reason.id} onChange={(e) => setSurveyData({ ...surveyData, useCaseReason: e.target.value })} className="w-4 h-4" />
                    <span className="text-slate-700">{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2">
              Complete Setup
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
