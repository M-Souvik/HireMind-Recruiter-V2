"use client"

import { useEffect, useRef } from "react"
import {
  CircleAlertIcon,
  Loader2Icon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react"
import type { CandidatesResponse, PipelineCandidate, Round } from "@/types/pipeline"
import { roundIcon, roundLabel } from "./pipeline.utils"
import { CandidateCard } from "./CandidateCard"
import { useRoundCandidatesQuery } from "@/queries/round"

interface RoundCandidatesDrawerProps {
  round: Round | null
  onClose: () => void
  onSelectCandidate: (candidate: PipelineCandidate) => void
  refreshKey?: number,
  onAccept?: (candidateId: string, reasoning: string) => void
  onReject?: (candidateId: string, reason: string) => void
}

export function RoundCandidatesDrawer({
  round,
  onClose,
  onSelectCandidate,
  refreshKey,
  onAccept,
  onReject,
}: RoundCandidatesDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading: loading, error } = useRoundCandidatesQuery(round?._id ?? undefined)
  const candidates = data?.candidates ?? []

  useEffect(() => {
    if (!round) return

    // Close drawer on Escape press
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", keyHandler)

    return () => {
      document.removeEventListener("keydown", keyHandler)
    }
  }, [round, onClose])

  if (!round) return null

  return (
    <>
      {/* Backdrop */}
      <div className="pp-drawer-backdrop" onClick={onClose} aria-hidden />

      {/* Drawer Panel */}
      <aside
        className="pp-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${roundLabel(round.type)} stage details`}
      >
        <div className="pp-drawer-inner">
          {/* Header */}
          <div className="pp-drawer-head">
            <div className="pp-drawer-avatar" style={{ background: "linear-gradient(135deg, oklch(0.491 0.27 292.581), oklch(0.55 0.24 320))" }}>
              {roundIcon(round.type)}
            </div>
            <div>
              <h2 className="pp-drawer-name">{roundLabel(round.type)} Candidates</h2>
              <p className="pp-drawer-email">
                Stage {round.order} · {round.status}
              </p>
            </div>
            <button className="pp-drawer-close" onClick={onClose} aria-label="Close">
              <XCircleIcon size={20} />
            </button>
          </div>

          {/* Body Content */}
          {loading && (
            <div className="pp-drawer-loading">
              <Loader2Icon size={28} className="pp-drawer-loading-spin" />
              <span>Fetching candidates...</span>
            </div>
          )}

          {error && !loading && (
            <div className="pp-drawer-error" role="alert">
              <CircleAlertIcon size={28} />
              <p>{error instanceof Error ? error.message : "Failed to load candidates for this stage. Please try again."}</p>
              <button
                className="pp-drawer-error-btn"
                onClick={onClose}
              >
                Dismiss
              </button>
            </div>
          )}

          {!loading && !error && candidates.length === 0 && (
            <div className="pp-drawer-empty">
              <UsersIcon size={48} className="pp-drawer-empty-icon" />
              <p className="pp-drawer-empty-text">No candidates are currently in this stage.</p>
            </div>
          )}

          {!loading && !error && candidates.length > 0 && (
            <div className="pp-drawer-cand-list">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={() => onSelectCandidate(candidate)}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
