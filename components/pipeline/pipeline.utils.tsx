import {
  BrainCircuitIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  FileTextIcon,
  GitForkIcon,
  MinusCircleIcon,
  SparklesIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react"
import type { Verdict } from "@/types/pipeline"

// ── Round label / icon maps ───────────────────────────────────────────────────

export const ROUND_LABELS: Record<string, string> = {
  ai_screen: "AI Screen",
  technical: "Technical",
  hr: "HR Round",
  assignment: "Assignment",
  culture_fit: "Culture Fit",
  final: "Final Round",
}

export const ROUND_ICONS: Record<string, React.ReactNode> = {
  ai_screen: <BrainCircuitIcon size={14} />,
  technical: <ClipboardListIcon size={14} />,
  hr: <UserIcon size={14} />,
  assignment: <FileTextIcon size={14} />,
  culture_fit: <SparklesIcon size={14} />,
  final: <GitForkIcon size={14} />,
}

export function roundLabel(type: string): string {
  return (
    ROUND_LABELS[type] ??
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

export function roundIcon(type: string): React.ReactNode {
  return ROUND_ICONS[type] ?? <ClipboardListIcon size={14} />
}

// ── Score helpers ─────────────────────────────────────────────────────────────

export function scoreColor(score: number): string {
  if (score >= 70) return "pp-score--green"
  if (score >= 45) return "pp-score--amber"
  return "pp-score--red"
}

// ── Verdict badge ─────────────────────────────────────────────────────────────

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  if (verdict === "Recommended")
    return (
      <span className="pp-verdict pp-verdict--yes">
        <CheckCircle2Icon size={11} />
        Recommended
      </span>
    )
  if (verdict === "Not Recommended")
    return (
      <span className="pp-verdict pp-verdict--no">
        <XCircleIcon size={11} />
        Not Recommended
      </span>
    )
  return (
    <span className="pp-verdict pp-verdict--hold">
      <MinusCircleIcon size={11} />
      {verdict}
    </span>
  )
}

// ── Round status badge ────────────────────────────────────────────────────────

export type NormalizedRoundStatus = "IN_PROGRESS" | "ENDED" | "SCHEDULED" | "OTHER"

export function normalizeRoundStatus(rawStatus?: string): NormalizedRoundStatus {
  if (!rawStatus) return "SCHEDULED"
  const s = rawStatus.trim().toUpperCase()
  if (s === "IN_PROGRESS" || s === "INPROGRESS" || s === "IN-PROGRESS" || s === "ACTIVE") {
    return "IN_PROGRESS"
  }
  if (s === "ENDED" || s === "COMPLETED" || s === "FINISHED" || s === "CLOSED") {
    return "ENDED"
  }
  if (s === "SCHEDULED" || s === "PENDING" || s === "UPCOMING") {
    return "SCHEDULED"
  }
  return "OTHER"
}

export function RoundStatusBadge({ status }: { status?: string }) {
  const normalized = normalizeRoundStatus(status)

  if (normalized === "IN_PROGRESS") {
    return (
      <span className="pp-col-status pp-col-status--in_progress">
        <span className="pp-status-dot pp-status-dot--pulse" />
        In Progress
      </span>
    )
  }

  if (normalized === "ENDED") {
    return (
      <span className="pp-col-status pp-col-status--ended">
        <CheckCircle2Icon size={11} />
        Ended
      </span>
    )
  }

  if (normalized === "SCHEDULED") {
    return (
      <span className="pp-col-status pp-col-status--scheduled">
        <CalendarClockIcon size={11} />
        Scheduled
      </span>
    )
  }

  return (
    <span className="pp-col-status pp-col-status--other">
      {status || "Unknown"}
    </span>
  )
}
