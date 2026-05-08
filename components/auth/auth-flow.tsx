"use client"

import { useState } from "react"
import { LoginPage } from "./login-page"
import { RegistrationFlow } from "./registration-flow"

export type AuthView = "login" | "register"

export function AuthFlow() {
  const [view, setView] = useState<AuthView>("login")

  if (view === "register") {
    return <RegistrationFlow onSwitchToLogin={() => setView("login")} />
  }

  return <LoginPage onSwitchToRegister={() => setView("register")} />
}
