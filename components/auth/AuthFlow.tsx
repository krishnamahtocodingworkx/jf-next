"use client"

import { useState } from "react"
import { LoginPage } from "./LoginPage"
import { RegistrationFlow } from "./RegistrationFlow"

export type AuthView = "login" | "register"

export function AuthFlow() {
  const [view, setView] = useState<AuthView>("login")

  if (view === "register") {
    return <RegistrationFlow onSwitchToLogin={() => setView("login")} />
  }

  return <LoginPage onSwitchToRegister={() => setView("register")} />
}
