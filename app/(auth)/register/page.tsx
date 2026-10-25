"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Info,
  Loader2,
  Lock,
  Mail,
  Phone,
  Plus,
  Search,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Organization {
  id: string
  name: string
  about?: string
  website_link?: string
}

interface PersonalForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface OrgForm {
  name: string
  email: string
  about: string
  website_link: string
}

type PersonalErrors = Partial<Record<keyof PersonalForm, string>>
type OrgErrors = Partial<Record<keyof OrgForm, string>>

// ─── Mock org data (replace with real API) ───────────────────────────────────

const MOCK_ORGS: Organization[] = [
  { id: "1", name: "Acme Corp", about: "A global tech powerhouse", website_link: "acme.com" },
  { id: "2", name: "Beacon Digital", about: "Digital transformation agency", website_link: "beacondigital.io" },
  { id: "3", name: "Cloudnova Inc", about: "Cloud-first startup studio" },
  { id: "4", name: "Delta Systems", about: "Enterprise software solutions", website_link: "deltasystems.com" },
  { id: "5", name: "Elevate HR", about: "People-first HR platform", website_link: "elevatehr.co" },
]

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="step-indicator">
      {[1, 2].map((s) => (
        <React.Fragment key={s}>
          <div
            className={cn(
              "step-dot",
              step === s && "step-dot-active",
              step > s && "step-dot-done",
            )}
          >
            {step > s ? <Check size={12} /> : s}
          </div>
          {s < 2 && (
            <div className={cn("step-line", step > s && "step-line-done")} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Org Combobox ─────────────────────────────────────────────────────────────

function OrgCombobox({
  orgs,
  selected,
  onSelect,
}: {
  orgs: Organization[]
  selected: Organization | null
  onSelect: (org: Organization | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = orgs.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  function openDropdown() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function pick(org: Organization) {
    onSelect(org)
    setQuery("")
    setOpen(false)
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onSelect(null)
    setQuery("")
  }

  return (
    <div className="combobox-root" ref={ref}>
      <button
        type="button"
        id="org-select"
        className={cn("combobox-trigger", open && "combobox-trigger-open")}
        onClick={openDropdown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Building2 size={16} className="field-icon" style={{ position: "static", top: "auto", left: "auto", transform: "none", pointerEvents: "none" }} />
        <span className={cn("combobox-value", !selected && "combobox-placeholder")}>
          {selected ? selected.name : "Search for your organization…"}
        </span>
        {selected ? (
          <button
            type="button"
            onClick={clear}
            className="combobox-clear"
            aria-label="Clear selection"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown
            size={16}
            className={cn("combobox-chevron", open && "combobox-chevron-open")}
          />
        )}
      </button>

      {open && (
        <div className="combobox-dropdown" role="listbox">
          <div className="combobox-search-wrap">
            <Search size={14} className="combobox-search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="combobox-search"
              aria-label="Search organizations"
            />
          </div>
          <div className="combobox-list">
            {filtered.length === 0 ? (
              <div className="combobox-empty">No organizations found</div>
            ) : (
              filtered.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  role="option"
                  aria-selected={selected?.id === org.id}
                  className={cn(
                    "combobox-option",
                    selected?.id === org.id && "combobox-option-selected",
                  )}
                  onClick={() => pick(org)}
                >
                  <div className="combobox-org-icon">
                    {org.name.charAt(0)}
                  </div>
                  <div className="combobox-org-info">
                    <span className="combobox-org-name">{org.name}</span>
                    {org.about && (
                      <span className="combobox-org-about">{org.about}</span>
                    )}
                  </div>
                  {selected?.id === org.id && (
                    <Check size={14} className="combobox-check" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 1: Personal details ─────────────────────────────────────────────────

function Step1({
  form,
  setForm,
  onNext,
}: {
  form: PersonalForm
  setForm: React.Dispatch<React.SetStateAction<PersonalForm>>
  onNext: () => void
}) {
  const [errors, setErrors] = useState<PersonalErrors>({})
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)

  function validate(): PersonalErrors {
    const e: PersonalErrors = {}
    if (!form.name.trim()) e.name = "Full name is required"
    if (!form.email) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address"
    if (!form.phone) e.phone = "Phone number is required"
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
      e.phone = "Enter a valid phone number"
    if (!form.password) e.password = "Password is required"
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters"
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password"
    else if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords don't match"
    return e
  }

  function handleNext() {
    const errs = validate()
    setErrors(errs)
    if (!Object.keys(errs).length) onNext()
  }

  function field(key: keyof PersonalForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  return (
    <div className="auth-form">
      <div className="step-form-grid">
        {/* Name */}
        <div className="field-group full-col">
          <label htmlFor="reg-name" className="field-label">
            Full name
          </label>
          <div className={cn("field-wrap", errors.name && "field-error-state")}>
            <User className="field-icon" size={16} />
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className="field-input"
              {...field("name")}
            />
          </div>
          {errors.name && <p className="field-error-msg">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="field-group">
          <label htmlFor="reg-email" className="field-label">
            Work email
          </label>
          <div className={cn("field-wrap", errors.email && "field-error-state")}>
            <Mail className="field-icon" size={16} />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              className="field-input"
              {...field("email")}
            />
          </div>
          {errors.email && <p className="field-error-msg">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="field-group">
          <label htmlFor="reg-phone" className="field-label">
            Phone number
          </label>
          <div className={cn("field-wrap", errors.phone && "field-error-state")}>
            <Phone className="field-icon" size={16} />
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className="field-input"
              {...field("phone")}
            />
          </div>
          {errors.phone && <p className="field-error-msg">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="field-group">
          <label htmlFor="reg-password" className="field-label">
            Password
          </label>
          <div className={cn("field-wrap", errors.password && "field-error-state")}>
            <Lock className="field-icon" size={16} />
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className="field-input"
              {...field("password")}
            />
            <button
              type="button"
              className="field-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="field-error-msg">{errors.password}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="field-group">
          <label htmlFor="reg-confirm-password" className="field-label">
            Confirm password
          </label>
          <div className={cn("field-wrap", errors.confirmPassword && "field-error-state")}>
            <Lock className="field-icon" size={16} />
            <input
              id="reg-confirm-password"
              type={showCpw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter password"
              className="field-input"
              {...field("confirmPassword")}
            />
            <button
              type="button"
              className="field-toggle"
              onClick={() => setShowCpw((v) => !v)}
              aria-label={showCpw ? "Hide password" : "Show password"}
            >
              {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="field-error-msg">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleNext}
        className="auth-submit-btn"
      >
        Continue
        <ArrowRight size={16} />
      </Button>
    </div>
  )
}

// ─── Step 2: Organization setup ───────────────────────────────────────────────

function Step2({
  onBack,
  onSubmit,
  loading,
}: {
  onBack: () => void
  onSubmit: (data: { organizationId: string } | { organization: OrgForm }) => void
  loading: boolean
}) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [orgForm, setOrgForm] = useState<OrgForm>({
    name: "",
    email: "",
    about: "",
    website_link: "",
  })
  const [orgErrors, setOrgErrors] = useState<OrgErrors>({})

  function validateOrg(): OrgErrors {
    const e: OrgErrors = {}
    if (!orgForm.name.trim()) e.name = "Organization name is required"
    if (orgForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgForm.email))
      e.email = "Enter a valid email address"
    return e
  }

  function handleSelectOrg(org: Organization | null) {
    setSelectedOrg(org)
    if (org) setShowNewForm(false)
  }

  function handleShowNew() {
    setSelectedOrg(null)
    setShowNewForm(true)
  }

  function handleSubmit() {
    if (showNewForm) {
      const errs = validateOrg()
      setOrgErrors(errs)
      if (Object.keys(errs).length) return
      onSubmit({ organization: orgForm })
    } else if (selectedOrg) {
      onSubmit({ organizationId: selectedOrg.id })
    }
  }

  function orgField(key: keyof OrgForm) {
    return {
      value: orgForm[key],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setOrgForm((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  const canSubmit = showNewForm || selectedOrg !== null

  return (
    <div className="auth-form">
      <div className="field-group">
        <label htmlFor="org-select" className="field-label">
          Select your organization
        </label>
        <OrgCombobox
          orgs={MOCK_ORGS}
          selected={selectedOrg}
          onSelect={handleSelectOrg}
        />
      </div>

      {/* Divider */}
      <div className="org-divider">
        <span className="org-divider-line" />
        <span className="org-divider-text">or</span>
        <span className="org-divider-line" />
      </div>

      <button
        type="button"
        className={cn("org-create-btn", showNewForm && "org-create-btn-active")}
        onClick={handleShowNew}
        id="create-new-org-btn"
      >
        <div className={cn("org-create-icon", showNewForm && "org-create-icon-active")}>
          <Plus size={14} />
        </div>
        <span>
          {showNewForm
            ? "Creating a new organization"
            : "My organization isn't listed — create it"}
        </span>
        {showNewForm && <Check size={14} className="org-create-check" />}
      </button>

      {/* New org form */}
      {showNewForm && (
        <div className="new-org-form">
          <div className="new-org-form-header">
            <Info size={14} />
            <span>Fill in your organization details</span>
          </div>

          <div className="step-form-grid">
            <div className="field-group full-col">
              <label htmlFor="org-name" className="field-label">
                Organization name <span className="field-required">*</span>
              </label>
              <div
                className={cn(
                  "field-wrap",
                  orgErrors.name && "field-error-state",
                )}
              >
                <Building2 className="field-icon" size={16} />
                <input
                  id="org-name"
                  type="text"
                  placeholder="Acme Corporation"
                  className="field-input"
                  {...orgField("name")}
                />
              </div>
              {orgErrors.name && (
                <p className="field-error-msg">{orgErrors.name}</p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="org-email" className="field-label">
                Contact email
              </label>
              <div
                className={cn(
                  "field-wrap",
                  orgErrors.email && "field-error-state",
                )}
              >
                <Mail className="field-icon" size={16} />
                <input
                  id="org-email"
                  type="email"
                  placeholder="hello@company.com"
                  className="field-input"
                  {...orgField("email")}
                />
              </div>
              {orgErrors.email && (
                <p className="field-error-msg">{orgErrors.email}</p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="org-website" className="field-label">
                Website
              </label>
              <div className="field-wrap">
                <Globe className="field-icon" size={16} />
                <input
                  id="org-website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  className="field-input"
                  {...orgField("website_link")}
                />
              </div>
            </div>

            <div className="field-group full-col">
              <label htmlFor="org-about" className="field-label">
                About
              </label>
              <div className="field-wrap field-wrap-textarea">
                <textarea
                  id="org-about"
                  rows={3}
                  placeholder="Brief description of your organization…"
                  className="field-input field-textarea"
                  {...orgField("about")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="step2-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="step2-back-btn"
          disabled={loading}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className={cn("auth-submit-btn step2-submit", !canSubmit && "opacity-40")}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Register page ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [personalForm, setPersonalForm] = useState<PersonalForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleFinalSubmit = useCallback(
    async (orgData: { organizationId: string } | { organization: OrgForm }) => {
      setLoading(true)
      const payload = {
        name: personalForm.name,
        email: personalForm.email,
        phone: personalForm.phone,
        password: personalForm.password,
        ...("organizationId" in orgData
          ? { organization_id: orgData.organizationId }
          : { organization: orgData.organization }),
      }
      console.log("Register payload:", payload)
      // TODO: wire up to API
      await new Promise((r) => setTimeout(r, 2000))
      setLoading(false)
    },
    [personalForm],
  )

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-center auth-center-wide">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5L14 2Z"
                fill="url(#logo-grad-reg)"
                opacity="0.9"
              />
              <path
                d="M14 8L19 11V17L14 20L9 17V11L14 8Z"
                fill="white"
                opacity="0.85"
              />
              <defs>
                <linearGradient
                  id="logo-grad-reg"
                  x1="4"
                  y1="2"
                  x2="24"
                  y2="26"
                  gradientUnits="userSpaceOnUse"
                >
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
            <StepIndicator step={step} />
            <h1 className="auth-heading" style={{ marginTop: "1.25rem" }}>
              {step === 1 ? "Create your account" : "Set up your organization"}
            </h1>
            <p className="auth-subheading">
              {step === 1 ? "Step 1 of 2 — Personal details" : "Step 2 of 2 — Organization"}
            </p>
          </div>

          {step === 1 ? (
            <Step1
              form={personalForm}
              setForm={setPersonalForm}
              onNext={() => setStep(2)}
            />
          ) : (
            <Step2
              onBack={() => setStep(1)}
              onSubmit={handleFinalSubmit}
              loading={loading}
            />
          )}

          <p className="auth-footer-text" style={{ marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
