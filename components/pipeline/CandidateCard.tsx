"use client"

import { useEffect, useRef, useState } from "react"
import {
  CheckIcon,
  XIcon,
  MoreVerticalIcon,
  DownloadIcon,
} from "lucide-react"

import type { PipelineCandidate } from "@/types/pipeline"
import { scoreColor, VerdictBadge } from "./pipeline.utils"
import { AcceptModal } from "./AcceptModal"
import { RejectModal } from "./RejectModal"

interface CandidateCardProps {
  candidate: PipelineCandidate
  onClick: () => void
  onAccept?: (candidateId: string, reasoning: string) => void
  onReject?: (candidateId: string, reason: string) => void
}

export function CandidateCard({ candidate, onClick, onAccept, onReject }: CandidateCardProps) {
  const { candidate_id: cand, ai_score, ai_evaluation } = candidate

  const statusLower = candidate.status?.toLowerCase() || ""
  const isConcluded =
    statusLower === "passed" ||
    statusLower === "failed" ||
    statusLower === "shortlisted" ||
    statusLower === "rejected" ||
    statusLower === "selected" ||
    statusLower === "reject" ||
    statusLower === "select"

  // Accept modal state
  const [acceptOpen, setAcceptOpen] = useState(false)

  // Reject modal state
  const [rejectOpen, setRejectOpen] = useState(false)

  // 3-dot popover state
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close popover on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen])

  function handleAcceptConfirm(reasoning: string) {
    onAccept?.(candidate.id, reasoning)
  }

  function handleRejectConfirm(reason: string) {
    onReject?.(candidate.id, reason)
  }

  function handleDownloadResume(e: React.MouseEvent) {
    e.stopPropagation()
    setMenuOpen(false)
    const link = candidate.resume_link || cand.resume_link
    if (link) {
      window.open(link, "_blank", "noreferrer")
    }
  }

  return (
    <>
      <div
        className="pp-cand-card"
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Open ${cand.name}`}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        {/* Avatar + name + 3-dot menu */}
        <div className="pp-cand-top">
          <div className="pp-avatar">{cand.name.charAt(0).toUpperCase()}</div>
          <div className="pp-cand-info">
            <span className="pp-cand-name">{cand.name}</span>
            <span className="pp-cand-email">{cand.email}</span>
          </div>

          {/* 3-dot popover */}
          <div
            className="pp-card-menu-wrap"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`pp-card-menu-btn ${menuOpen ? "pp-card-menu-btn--open" : ""}`}
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen((p) => !p)
              }}
            >
              <MoreVerticalIcon size={14} />
            </button>

            {menuOpen && (
              <div className="pp-card-menu" role="menu">
                <button
                  className="pp-card-menu-item"
                  role="menuitem"
                  onClick={handleDownloadResume}
                  disabled={!candidate.resume_link && !cand.resume_link}
                >
                  <DownloadIcon size={13} />
                  Download Resume
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI score bar */}
        <div className="pp-score-row">
          <span className="pp-score-label">AI Score</span>
          <div className="pp-score-bar-wrap">
            <div
              className={`pp-score-bar-fill ${scoreColor(ai_score)}`}
              style={{ width: `${ai_score}%` }}
            />
          </div>
          <span className={`pp-score-num ${scoreColor(ai_score)}`}>{ai_score}</span>
        </div>

        {/* Verdict + status */}
        <div className="pp-cand-footer">
          <VerdictBadge verdict={ai_evaluation?.verdict || "Analysing"} />
          <span className="pp-cand-status">{candidate.status}</span>
        </div>

        {/* Accept / Reject actions */}
        {!isConcluded && (
          <div
            className="pp-cand-actions"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pp-action-btn pp-action-btn--reject"
              aria-label="Reject candidate"
              onClick={(e) => {
                e.stopPropagation()
                setRejectOpen(true)
              }}
            >
              <XIcon size={13} />
              Reject
            </button>
            <button
              className="pp-action-btn pp-action-btn--accept"
              aria-label="Accept candidate"
              onClick={(e) => {
                e.stopPropagation()
                setAcceptOpen(true)
              }}
            >
              <CheckIcon size={13} />
              Accept
            </button>
          </div>
        )}
      </div>

      {/* Accept reasoning modal */}
      <AcceptModal
        candidateName={cand.name}
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onConfirm={handleAcceptConfirm}
      />

      {/* Reject reason modal */}
      <RejectModal
        candidateName={cand.name}
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </>
  )
}
