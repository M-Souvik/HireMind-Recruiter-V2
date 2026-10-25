"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLoginMutation } from "@/mutations/auth/useLoginMutation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const { mutate: login, isPending } = useLoginMutation()

  function validate() {
    const errs: typeof errors = {}
    if (!email) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email"
    if (!password) errs.password = "Password is required"
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters"
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setServerError(null)

    login(
      { email, password },
      {
        onSuccess: (data) => {
          // TODO: persist token (e.g. cookie / localStorage) then redirect
          console.log("Login successful", data)
          toast.success("Login successful !")
          sessionStorage.setItem("recruiter", JSON.stringify(data.recruiter))
          sessionStorage.setItem("token", JSON.stringify(data.access_token))

          // Example: 
          router.push("/dashboard")
        },
        onError: (err: unknown) => {
          const message =
            typeof err === "object" &&
              err !== null &&
              "detail" in err &&
              typeof (err as { detail: unknown }).detail === "string"
              ? (err as { detail: string }).detail
              : "Invalid email or password. Please try again."
          setServerError(message)
          toast.error(message)
        },
      },
    )
  }

  return (
    <div className="auth-root">
      {/* Animated gradient background */}
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-center">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5L14 2Z"
                fill="url(#logo-grad)"
                opacity="0.9"
              />
              <path
                d="M14 8L19 11V17L14 20L9 17V11L14 8Z"
                fill="white"
                opacity="0.85"
              />
              <defs>
                <linearGradient id="logo-grad" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa" />
                  <stop offset="1" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-brand-name">HireMind</span>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-heading">Welcome back</h1>
            <p className="auth-subheading">Sign in to your recruiter portal</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Server-level error banner */}
            {serverError && (
              <div className="field-server-error" role="alert">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="field-group">
              <label htmlFor="login-email" className="field-label">
                Email address
              </label>
              <div className={cn("field-wrap", errors.email && "field-error-state")}>
                <Mail className="field-icon" size={16} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                />
              </div>
              {errors.email && (
                <p className="field-error-msg">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="login-password" className="field-label">
                  Password
                </label>
                <a href="#" className="field-link">
                  Forgot password?
                </a>
              </div>
              <div className={cn("field-wrap", errors.password && "field-error-state")}>
                <Lock className="field-icon" size={16} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="field-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error-msg">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="auth-submit-btn"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <p className="auth-footer-text">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="auth-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
