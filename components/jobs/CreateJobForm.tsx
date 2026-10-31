"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  MapPinIcon,
  TagIcon,
  DollarSignIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  PlusIcon,
  ClockIcon,
  BuildingIcon,
  WifiIcon,
  HomeIcon,
  IndianRupeeIcon,
  ZapIcon,
  CalendarClockIcon,
} from "lucide-react"
import { useCreateJobMutation } from "@/mutations/jobs/useCreateJobMutation"
import { toast } from "sonner"
import RichTextEditor from "@/components/ui/RichTextEditor"

// ── Constants ─────────────────────────────────────────────────────────────────

const LOC_TYPE_OPTIONS = [
  { value: "remote", label: "Remote", icon: WifiIcon },
  { value: "hybrid", label: "Hybrid", icon: HomeIcon },
  { value: "on-site", label: "On-Site", icon: BuildingIcon },
]

const JOB_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
]

const EXPERIENCE_OPTIONS = [
  { value: "fresher", label: "Fresher / 0 yrs" },
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 Years" },
  { value: "6", label: "6+ Years" },
  { value: "10", label: "10+ Years" },
]

const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Next.js",
  "Vue.js",
  "Angular",
  "Flutter",
  "Swift",
  "Kotlin",
  "C++",
  "Machine Learning",
  "Data Science",
  "DevOps",
  "Figma",
  "Product Management",
]

const VALIDITY_OPTIONS = [7, 14, 30, 60] as const

const STEPS = [
  { label: "Basic Info", icon: BriefcaseIcon },
  { label: "Requirements", icon: TagIcon },
  { label: "Timeline", icon: CalendarIcon },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  title: string
  description: string
  location: string
  loc_type: string
  type: string
  skills: string[]
  req_experience: string
  min_salary_range: string
  max_salary_range: string
  status: "open" | "scheduled"
  validity: number
  start_time: string
  end_time: string
}

const INITIAL: FormData = {
  title: "",
  description: "",
  location: "",
  loc_type: "",
  type: "",
  skills: [],
  req_experience: "",
  min_salary_range: "",
  max_salary_range: "",
  status: "open",
  validity: 30,
  start_time: "",
  end_time: "",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toLocalDatetimeValue(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toISOFromLocal(local: string) {
  if (!local) return ""
  return new Date(local).toISOString()
}

function formatDatePretty(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ── Step 1: Basic Info ────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
}) {
  return (
    <div className="cjf-fields">
      {/* Title */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-title">
          Job Title <span className="field-required">*</span>
        </label>
        <div className="field-wrap">
          <BriefcaseIcon className="field-icon" size={16} />
          <input
            id="cjf-title"
            className="field-input"
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-desc">
          Job Description <span className="field-required">*</span>
        </label>
        <RichTextEditor
          id="cjf-desc"
          value={data.description}
          onChange={(html) => onChange({ description: html })}
        />
      </div>

      {/* Location */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-location">
          Office Address <span className="field-required">*</span>
        </label>
        <div className="field-wrap">
          <MapPinIcon className="field-icon" size={16} />
          <input
            id="cjf-location"
            className="field-input"
            type="text"
            placeholder="e.g. 123 Main St, San Francisco, CA"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Location Type */}
      <div className="field-group">
        <label className="field-label">Work Mode</label>
        <div className="cjf-badge-group">
          {LOC_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              id={`cjf-loctype-${value}`}
              className={`cjf-badge ${data.loc_type === value ? "cjf-badge--active" : ""}`}
              onClick={() =>
                onChange({ loc_type: data.loc_type === value ? "" : value })
              }
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="field-group">
        <label className="field-label">Job Type</label>
        <div className="cjf-badge-group cjf-badge-group--wrap">
          {JOB_TYPE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              id={`cjf-jobtype-${value}`}
              className={`cjf-badge ${data.type === value ? "cjf-badge--active" : ""}`}
              onClick={() =>
                onChange({ type: data.type === value ? "" : value })
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Skills & Compensation ─────────────────────────────────────────────

function Step2({
  data,
  onChange,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
}) {
  const [skillInput, setSkillInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (!trimmed || data.skills.includes(trimmed)) return
    onChange({ skills: [...data.skills, trimmed] })
    setSkillInput("")
    inputRef.current?.focus()
  }

  const removeSkill = (skill: string) => {
    onChange({ skills: data.skills.filter((s) => s !== skill) })
  }

  const filteredSuggestions = SUGGESTED_SKILLS.filter(
    (s) =>
      !data.skills.includes(s) &&
      s.toLowerCase().includes(skillInput.toLowerCase()),
  ).slice(0, 8)

  return (
    <div className="cjf-fields">
      {/* Skill input */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-skill-input">
          Required Skills
        </label>
        <div className="cjf-skill-input-wrap">
          <div className="field-wrap">
            <TagIcon className="field-icon" size={16} />
            <input
              ref={inputRef}
              id="cjf-skill-input"
              className="field-input"
              type="text"
              placeholder="Type a skill and press Enter…"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill(skillInput)
                }
              }}
            />
            {skillInput && (
              <button
                type="button"
                className="cjf-skill-add-btn"
                onClick={() => addSkill(skillInput)}
              >
                <PlusIcon size={14} />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="cjf-suggestions">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="cjf-suggestion-chip"
                  onClick={() => addSkill(s)}
                >
                  <PlusIcon size={10} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected skills */}
        {data.skills.length > 0 && (
          <div className="cjf-selected-skills">
            {data.skills.map((s) => (
              <span key={s} className="cjf-skill-tag">
                {s}
                <button
                  type="button"
                  aria-label={`Remove ${s}`}
                  onClick={() => removeSkill(s)}
                >
                  <XIcon size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-experience">
          Required Experience
        </label>
        <div className="field-wrap">
          <ClockIcon className="field-icon" size={16} />
          <select
            id="cjf-experience"
            className="field-input cjf-select"
            value={data.req_experience}
            onChange={(e) => onChange({ req_experience: e.target.value })}
          >
            <option value="">Select experience level…</option>
            {EXPERIENCE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary range */}
      <div className="field-group">
        <label className="field-label">
          Salary Range <span className="field-required">*</span>
        </label>
        <div className="cjf-salary-row">
          <div className="field-wrap" style={{ flex: 1 }}>
            <IndianRupeeIcon className="field-icon" size={16} />
            <input
              id="cjf-min-salary"
              className="field-input"
              type="number"
              placeholder="Min (e.g. 60000)"
              min={0}
              value={data.min_salary_range}
              onChange={(e) => onChange({ min_salary_range: e.target.value })}
              required
            />
          </div>
          <span className="cjf-salary-sep">—</span>
          <div className="field-wrap" style={{ flex: 1 }}>
            <IndianRupeeIcon className="field-icon" size={16} />
            <input
              id="cjf-max-salary"
              className="field-input"
              type="number"
              placeholder="Max (e.g. 120000)"
              min={0}
              value={data.max_salary_range}
              onChange={(e) => onChange({ max_salary_range: e.target.value })}
              required
            />
          </div>
        </div>
        {data.min_salary_range &&
          data.max_salary_range &&
          Number(data.max_salary_range) > 0 && (
            <p className="cjf-salary-preview">
              ₹{Number(data.min_salary_range).toLocaleString()} –{" "}
              ₹{Number(data.max_salary_range).toLocaleString()} / year
            </p>
          )}
      </div>
    </div>
  )
}

// ── Step 3: Timeline ──────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: FormData
  onChange: (patch: Partial<FormData>) => void
}) {
  const isScheduled = data.status === "scheduled"

  const handleModeSwitch = (mode: "open" | "scheduled") => {
    if (mode === "open") {
      const now = new Date()
      const validity = data.validity || 30
      const end = new Date(now.getTime() + validity * 24 * 60 * 60 * 1000)
      onChange({
        status: "open",
        start_time: now.toISOString(),
        end_time: end.toISOString(),
      })
    } else {
      let start = data.start_time ? new Date(data.start_time) : null
      if (!start || isNaN(start.getTime()) || start.getTime() <= Date.now()) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9, 0, 0, 0)
        start = tomorrow
      }
      const validity = data.validity || 30
      const end = new Date(start.getTime() + validity * 24 * 60 * 60 * 1000)
      onChange({
        status: "scheduled",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      })
    }
  }

  const handleValidityChange = (days: number) => {
    const base = isScheduled && data.start_time ? new Date(data.start_time) : new Date()
    const validBase = isNaN(base.getTime()) ? new Date() : base
    const newEnd = new Date(validBase.getTime() + days * 24 * 60 * 60 * 1000)
    onChange({
      validity: days,
      end_time: newEnd.toISOString(),
    })
  }

  const handleStartTimeChange = (localVal: string) => {
    if (!localVal) {
      onChange({ start_time: "" })
      return
    }
    const iso = toISOFromLocal(localVal)
    const start = new Date(iso)
    const validity = data.validity || 30
    const newEnd = new Date(start.getTime() + validity * 24 * 60 * 60 * 1000)
    onChange({
      start_time: iso,
      end_time: newEnd.toISOString(),
    })
  }

  const handleEndTimeChange = (localVal: string) => {
    if (!localVal) {
      onChange({ end_time: "" })
      return
    }
    const iso = toISOFromLocal(localVal)
    const end = new Date(iso)
    const base = isScheduled && data.start_time ? new Date(data.start_time) : new Date()
    const validBase = isNaN(base.getTime()) ? new Date() : base
    const diffDays = Math.max(1, Math.round((end.getTime() - validBase.getTime()) / (24 * 60 * 60 * 1000)))
    onChange({
      end_time: iso,
      validity: diffDays,
    })
  }

  const minStartTimeLocal = toLocalDatetimeValue(new Date().toISOString())
  const minEndTimeLocal = isScheduled && data.start_time
    ? toLocalDatetimeValue(data.start_time)
    : minStartTimeLocal

  return (
    <div className="cjf-fields">
      <div className="cjf-timeline-note">
        <CalendarIcon size={15} />
        {isScheduled
          ? "Set when this job posting will go live and choose how long it will remain open."
          : "Your job will publish immediately and remain open for the specified duration."}
      </div>

      {/* Publishing Mode Toggle */}
      <div className="field-group">
        <label className="field-label">
          Publishing Option <span className="field-required">*</span>
        </label>
        <div className="cjf-toggle-group">
          <button
            type="button"
            id="cjf-publish-immediate"
            className={`cjf-toggle-card ${!isScheduled ? "cjf-toggle-card--active" : ""}`}
            onClick={() => handleModeSwitch("open")}
          >
            <div className="cjf-toggle-card-icon">
              <ZapIcon size={18} />
            </div>
            <div className="cjf-toggle-card-body">
              <span className="cjf-toggle-card-title">Publish immediately</span>
              <span className="cjf-toggle-card-desc">Go live right after posting</span>
            </div>
            <div className="cjf-toggle-radio">
              {!isScheduled && <div className="cjf-toggle-radio-dot" />}
            </div>
          </button>

          <button
            type="button"
            id="cjf-publish-scheduled"
            className={`cjf-toggle-card ${isScheduled ? "cjf-toggle-card--active" : ""}`}
            onClick={() => handleModeSwitch("scheduled")}
          >
            <div className="cjf-toggle-card-icon">
              <CalendarClockIcon size={18} />
            </div>
            <div className="cjf-toggle-card-body">
              <span className="cjf-toggle-card-title">Scheduled</span>
              <span className="cjf-toggle-card-desc">Set a future start date</span>
            </div>
            <div className="cjf-toggle-radio">
              {isScheduled && <div className="cjf-toggle-radio-dot" />}
            </div>
          </button>
        </div>
      </div>

      {/* If Scheduled: Show Posting Start Date */}
      {isScheduled && (
        <div className="field-group">
          <label className="field-label" htmlFor="cjf-start-time">
            Posting Start Date <span className="field-required">*</span>
          </label>
          <div className="field-wrap">
            <CalendarIcon className="field-icon" size={16} />
            <input
              id="cjf-start-time"
              className="field-input cjf-datetime"
              type="datetime-local"
              value={toLocalDatetimeValue(data.start_time)}
              min={minStartTimeLocal}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* Validity Selection (Open for: ) */}
      <div className="field-group">
        <label className="field-label">
          Open for: <span className="field-required">*</span>
        </label>
        <div className="cjf-badge-group">
          {VALIDITY_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              id={`cjf-validity-${days}`}
              className={`cjf-badge ${data.validity === days ? "cjf-badge--active" : ""}`}
              onClick={() => handleValidityChange(days)}
            >
              <ClockIcon size={13} />
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Posting End Date */}
      <div className="field-group">
        <label className="field-label" htmlFor="cjf-end-time">
          Posting End Date <span className="field-required">*</span>
        </label>
        <div className="field-wrap">
          <CalendarIcon className="field-icon" size={16} />
          <input
            id="cjf-end-time"
            className="field-input cjf-datetime"
            type="datetime-local"
            value={toLocalDatetimeValue(data.end_time)}
            min={minEndTimeLocal}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            required
          />
        </div>
        {data.end_time && (
          <p className="cjf-salary-preview">
            {isScheduled
              ? `Listing will run for ${data.validity} days (from ${formatDatePretty(data.start_time)} to ${formatDatePretty(data.end_time)})`
              : `Listing will remain active for ${data.validity} days (closes on ${formatDatePretty(data.end_time)})`}
          </p>
        )}
      </div>

      {/* Summary card */}
      <div className="cjf-summary">
        <h3 className="cjf-summary-title">Review Your Job Posting</h3>
        <div className="cjf-summary-grid">
          <SummaryRow label="Title" value={data.title || "—"} />
          <SummaryRow label="Location" value={data.location || "—"} />
          <SummaryRow
            label="Work Mode"
            value={data.loc_type ? data.loc_type.replace("-", " ") : "—"}
          />
          <SummaryRow label="Job Type" value={data.type || "—"} />
          <SummaryRow
            label="Skills"
            value={data.skills.length > 0 ? data.skills.join(", ") : "—"}
          />
          <SummaryRow
            label="Experience"
            value={
              data.req_experience
                ? EXPERIENCE_OPTIONS.find((e) => e.value === data.req_experience)
                  ?.label ?? data.req_experience
                : "—"
            }
          />
          <SummaryRow
            label="Salary"
            value={
              data.min_salary_range && data.max_salary_range
                ? `₹${Number(data.min_salary_range).toLocaleString()} – ₹${Number(data.max_salary_range).toLocaleString()}`
                : "—"
            }
          />
          <SummaryRow
            label="Status"
            value={isScheduled ? "Scheduled" : "Publish immediately"}
          />
          {isScheduled && (
            <SummaryRow
              label="Start Date"
              value={formatDatePretty(data.start_time)}
            />
          )}
          <SummaryRow
            label="Open For"
            value={`${data.validity} Days`}
          />
          <SummaryRow
            label="End Date"
            value={formatDatePretty(data.end_time)}
          />
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="cjf-summary-row">
      <span className="cjf-summary-label">{label}</span>
      <span className="cjf-summary-value">{value}</span>
    </div>
  )
}

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="cjf-step-indicator">
      {STEPS.map((step, idx) => {
        const done = idx < current
        const active = idx === current
        return (
          <div key={step.label} className="cjf-step-item">
            {idx > 0 && (
              <div
                className={`cjf-step-line ${done ? "cjf-step-line--done" : ""}`}
              />
            )}
            <div className="cjf-step-dot-wrap">
              <div
                className={`cjf-step-dot ${active ? "cjf-step-dot--active" : ""} ${done ? "cjf-step-dot--done" : ""}`}
              >
                {done ? <CheckIcon size={13} /> : <span>{idx + 1}</span>}
              </div>
              <span
                className={`cjf-step-label ${active ? "cjf-step-label--active" : ""}`}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): string | null {
  if (step === 0) {
    if (!data.title.trim()) return "Job title is required."
    if (!data.description.trim()) return "Description is required."
    if (!data.location.trim()) return "Office address is required."
  }
  if (step === 1) {
    if (!data.min_salary_range) return "Minimum salary is required."
    if (!data.max_salary_range) return "Maximum salary is required."
    if (Number(data.min_salary_range) > Number(data.max_salary_range))
      return "Minimum salary cannot exceed maximum."
  }
  if (step === 2) {
    const isScheduled = data.status === "scheduled"
    if (isScheduled) {
      if (!data.start_time) return "Posting start date and time is required."
      if (new Date(data.start_time).getTime() < Date.now() - 60000) {
        return "Posting start date must be in the future."
      }
    }
    if (!data.end_time) return "Posting end date is required."
    const effectiveStart = isScheduled && data.start_time
      ? new Date(data.start_time)
      : new Date()
    if (new Date(data.end_time) <= effectiveStart) {
      return "Posting end date must be after start date."
    }
    if (!data.validity || Number(data.validity) <= 0) {
      return "Please select a validity period."
    }
  }
  return null
}

// ── Main Form ─────────────────────────────────────────────────────────────────

export default function CreateJobForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize dates on client-side to prevent SSR hydration discrepancy
    if (!data.start_time || !data.end_time) {
      const now = new Date()
      const validityDays = data.validity || 30
      const end = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000)
      setData((prev) => ({
        ...prev,
        start_time: prev.start_time || now.toISOString(),
        end_time: prev.end_time || end.toISOString(),
      }))
    }
  }, [])

  const { mutate, isPending } = useCreateJobMutation()

  const onChange = (patch: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setError(null)
  }

    const handleNext = (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      const err = validateStep(step, data)
      if (err) { setError(err); return }
      setError(null)
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }

      const handleBack = (e?: React.MouseEvent) => {
        if (e) {
          e.preventDefault()
          e.stopPropagation()
        }
        setError(null)
        setStep((s) => Math.max(s - 1, 0))
      }

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Prevent submission if not on the final step
        if (step < STEPS.length - 1) {
          handleNext()
          return
        }

        const err = validateStep(step, data)
        if (err) { setError(err); return }

        const isScheduled = data.status === "scheduled"
        const nowIso = new Date().toISOString()
        const startTime = isScheduled ? data.start_time : nowIso
        const validity = Number(data.validity) || 30

        let endTime = data.end_time
        if (!endTime || (!isScheduled && new Date(endTime) <= new Date(startTime))) {
          endTime = new Date(new Date(startTime).getTime() + validity * 24 * 60 * 60 * 1000).toISOString()
        }

        mutate(
          {
            title: data.title,
            description: data.description,
            location: data.location,
            skills: data.skills,
            min_salary_range: Number(data.min_salary_range),
            max_salary_range: Number(data.max_salary_range),
            type: data.type || null,
            req_experience: data.req_experience || null,
            loc_type: data.loc_type || null,
            start_time: startTime,
            end_time: endTime,
            status: isScheduled ? "scheduled" : "open",
            validity: validity,
          },
          {
            onSuccess: () => {
              toast.success(
                isScheduled
                  ? "Job scheduled successfully!"
                  : "Job posted successfully!"
              )
              router.push("/job-listings")
            },
            onError: (err: unknown) => {
              const msg =
                err && typeof err === "object" && "detail" in err
                  ? String((err as { detail: unknown }).detail)
                  : "Failed to create job. Please try again."
              setError(msg)
            },
          },
        )
      }

      return (
        <div className="cjf-root">
          {/* Ambient background */}
          <div className="cjf-bg">
            <div className="cjf-blob cjf-blob-1" />
            <div className="cjf-blob cjf-blob-2" />
          </div>

          <div className="cjf-center">
            {/* Header */}
            <div className="cjf-header">
              <div className="cjf-header-icon">
                <BriefcaseIcon size={22} />
              </div>
              <div>
                <h1 className="cjf-title">Post a New Job</h1>
                <p className="cjf-subtitle">
                  Fill in the details below to attract the right candidates
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="cjf-card">
              <StepIndicator current={step} />

              <div className="cjf-step-header">
                <h2 className="cjf-step-title">{STEPS[step].label}</h2>
                <span className="cjf-step-count">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>

                <form
                  onSubmit={handleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && step < STEPS.length - 1) {
                      const target = e.target as HTMLElement
                      if (
                        target.tagName !== "TEXTAREA" &&
                        !target.isContentEditable &&
                        target.id !== "cjf-skill-input"
                      ) {
                        e.preventDefault()
                        handleNext()
                      }
                    }
                  }}
                  noValidate
                >
                  {step === 0 && <Step1 data={data} onChange={onChange} />}
                  {step === 1 && <Step2 data={data} onChange={onChange} />}
                  {step === 2 && <Step3 data={data} onChange={onChange} />}

                  {error && (
                    <p className="field-server-error" role="alert" style={{ marginTop: "1rem" }}>
                      {error}
                    </p>
                  )}

                  <div className="cjf-actions">
                    {step > 0 ? (
                      <button
                        key="cjf-back-btn"
                        type="button"
                        className="cjf-btn cjf-btn--ghost"
                        onClick={handleBack}
                        disabled={isPending}
                      >
                        <ChevronLeftIcon size={16} />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < STEPS.length - 1 ? (
                      <button
                        key="cjf-continue-btn"
                        type="button"
                        className="cjf-btn cjf-btn--primary"
                        onClick={handleNext}
                      >
                        Continue
                        <ChevronRightIcon size={16} />
                      </button>
                    ) : (
                      <button
                        key="cjf-submit-btn"
                        type="submit"
                        className="cjf-btn cjf-btn--primary"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <span className="cjf-spinner" />
                            {data.status === "scheduled" ? "Scheduling…" : "Publishing…"}
                          </>
                        ) : (
                          <>
                            <CheckIcon size={16} />
                            {data.status === "scheduled" ? "Schedule Job" : "Publish Job"}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
            </div>
          </div>
        </div>
      )
    }
