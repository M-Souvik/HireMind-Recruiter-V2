"use client"

import { useEffect, useRef, useState } from "react"
import {
  ExternalLinkIcon,
  FileTextIcon,
  PhoneIcon,
  XCircleIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import type { PipelineCandidate } from "@/types/pipeline"
import { scoreColor, VerdictBadge } from "./pipeline.utils"
import { AcceptModal } from "./AcceptModal"
import { RejectModal } from "./RejectModal"

interface CandidateDrawerProps {
  candidate: PipelineCandidate | null
  onClose: () => void
  onAccept?: (candidateId: string, reasoning: string) => void
  onReject?: (candidateId: string, reason: string) => void
}

export function CandidateDrawer({
  candidate,
  onClose,
  onAccept,
  onReject,
}: CandidateDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Modals state
  const [acceptOpen, setAcceptOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  useEffect(() => {
    if (!candidate) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [candidate, onClose])

  if (!candidate) return null

  const { candidate_id: cand, ai_evaluation: ev } = candidate

  const scoreItems = [
    { label: "Resume",   score: ev.resume_match.score,   remark: ev.resume_match.remarks },
    { label: "LinkedIn", score: ev.linkedin_match.score, remark: ev.linkedin_match.remarks },
    { label: "GitHub",   score: ev.github_match.score,   remark: ev.github_match.remarks },
    { label: "Projects", score: ev.projects_match.score, remark: ev.projects_match.remarks },
    { label: "Skills",   score: ev.skills_match.score,   remark: ev.skills_match.remarks },
  ]

  const statusLower = candidate.status?.toLowerCase() || ""
  const isConcluded =
    statusLower === "passed" ||
    statusLower === "failed" ||
    statusLower === "shortlisted" ||
    statusLower === "rejected" ||
    statusLower === "selected" ||
    statusLower === "reject" ||
    statusLower === "select"

  return (
    <>
      {/* Backdrop */}
      <div className="pp-drawer-backdrop" onClick={onClose} aria-hidden />

      {/* Drawer panel */}
      <aside
        className="pp-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Candidate details"
      >
        <div className="pp-drawer-inner">
          {/* Header */}
          <div className="pp-drawer-head">
            <div className="pp-drawer-avatar">{cand.name.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className="pp-drawer-name">{cand.name}</h2>
              <p className="pp-drawer-email">{cand.email}</p>
            </div>
            <button className="pp-drawer-close" onClick={onClose} aria-label="Close">
              <XCircleIcon size={20} />
            </button>
          </div>

          {/* Quick links */}
          <div className="pp-drawer-links">
            {cand.phone && (
              <a href={`tel:${cand.phone}`} className="pp-link-chip">
                <PhoneIcon size={12} /> {cand.phone}
              </a>
            )}
            {candidate.resume_link && (
              <a href={candidate.resume_link} target="_blank" rel="noreferrer" className="pp-link-chip">
                <FileTextIcon size={12} /> Resume <ExternalLinkIcon size={10} />
              </a>
            )}
          </div>

          {/* Overall score + verdict */}
          <div className="pp-drawer-score-hero">
            <div className="pp-drawer-score-ring">
              <svg viewBox="0 0 56 56" fill="none" className="pp-ring-svg">
                <circle cx="28" cy="28" r="24" strokeWidth="4" className="pp-ring-track" />
                <circle
                  cx="28" cy="28" r="24" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - ev.overall_score / 100)}`}
                  className={`pp-ring-fill ${scoreColor(ev.overall_score)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
                <text x="28" y="32" textAnchor="middle" className="pp-ring-text">
                  {ev.overall_score}
                </text>
              </svg>
            </div>
            <div className="pp-drawer-score-info">
              <span className="pp-drawer-score-label">Overall AI Score</span>
              <VerdictBadge verdict={ev.verdict} />
            </div>
          </div>

          {/* Score breakdown */}
          <div className="pp-drawer-section">
            <h3 className="pp-drawer-section-title">Score Breakdown</h3>
            <div className="pp-breakdown-list">
              {scoreItems.map(({ label, score, remark }) => (
                <div key={label} className="pp-breakdown-item">
                  <div className="pp-breakdown-row">
                    <span className="pp-breakdown-label">{label}</span>
                    <span className={`pp-breakdown-score ${scoreColor(score)}`}>{score}</span>
                  </div>
                  <div className="pp-breakdown-bar-wrap">
                    <div
                      className={`pp-breakdown-bar-fill ${scoreColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="pp-breakdown-remark">{remark}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills?.filter((s) => s !== "string").length > 0 && (
            <div className="pp-drawer-section">
              <h3 className="pp-drawer-section-title">Skills</h3>
              <div className="pp-drawer-pills">
                {candidate.skills.filter((s) => s !== "string").map((s) => (
                  <span key={s} className="pp-drawer-pill">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {ev.strengths?.length > 0 && (
            <div className="pp-drawer-section">
              <h3 className="pp-drawer-section-title">Strengths</h3>
              <ul className="pp-list pp-list--green">
                {ev.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {ev.weaknesses?.length > 0 && (
            <div className="pp-drawer-section">
              <h3 className="pp-drawer-section-title">Weaknesses</h3>
              <ul className="pp-list pp-list--red">
                {ev.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          {!isConcluded && (
            <div className="flex items-center justify-end gap-3 px-6 pt-5 mt-6 border-t border-border">
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                onClick={() => setRejectOpen(true)}
              >
                <XIcon size={14} /> Reject
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                onClick={() => setAcceptOpen(true)}
              >
                <CheckIcon size={14} /> Accept
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Accept reasoning modal */}
      <AcceptModal
        candidateName={cand.name}
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onConfirm={(reasoning) => onAccept?.(candidate.id, reasoning)}
      />

      {/* Reject reason modal */}
      <RejectModal
        candidateName={cand.name}
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={(reason) => onReject?.(candidate.id, reason)}
      />
    </>
  )
}
