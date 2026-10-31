"use client"

import type { PipelineCandidate, Round } from "@/types/pipeline"
import { RoundMenu } from "./RoundMenu"
import { roundIcon, roundLabel, RoundStatusBadge, normalizeRoundStatus } from "./pipeline.utils"

interface RoundColumnProps {
  round: Round
  candidates: PipelineCandidate[]
  index: number
  total: number
  onSelectRound: (round: Round) => void
  onAddRound: () => void
  onEndRound: (roundId: string) => void
}

export function RoundColumn({
  round,
  candidates,
  index,
  total,
  onSelectRound,
  onAddRound,
  onEndRound,
}: RoundColumnProps) {
  const isEnded = normalizeRoundStatus(round.status) === "ENDED"

  return (
    <div className="pp-column">
      {/* Node row: connectors + pill + three-dot */}
      <div className="pp-col-node-wrap">
        {/* Left connector */}
        {index > 0 && <div className="pp-connector pp-connector--left" />}

        {/* Stage node pill */}
        <div
          className="pp-col-node"
          onClick={() => onSelectRound(round)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelectRound(round)
            }
          }}
        >
          <span className="pp-col-node-icon">{roundIcon(round.type)}</span>
          <div className="pp-col-node-text">
            <span className="pp-col-node-label">{roundLabel(round.type)}</span>
            <span className="pp-col-node-order">Stage {round.order}</span>
          </div>
          <RoundStatusBadge status={round.status} />
          {!isEnded && (
            <RoundMenu
              onAddRound={onAddRound}
              onEndRound={() => onEndRound(round._id)}
            />
          )}
        </div>

        {/* Right connector */}
        {index < total - 1 && <div className="pp-connector pp-connector--right" />}
      </div>

      {/* Candidate count */}
      {/* <div className="pp-col-count">
        {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
      </div> */}
    </div>
  )
}
