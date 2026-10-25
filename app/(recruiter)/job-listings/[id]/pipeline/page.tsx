"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, CircleAlertIcon, GitForkIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { apiGet, apiPost } from "@/lib/api/client"
import type { PipelineCandidate, Round, RoundsResponse, CandidatesResponse } from "@/types/pipeline"
import type { CreateRoundPayload } from "@/components/pipeline/AddRoundModal"

import { useQueryClient } from "@tanstack/react-query"
import { RoundColumn } from "@/components/pipeline/RoundColumn"
import { CandidateDrawer } from "@/components/pipeline/CandidateDrawer"
import { AddRoundModal } from "@/components/pipeline/AddRoundModal"
import { RoundCandidatesDrawer } from "@/components/pipeline/RoundCandidatesDrawer"
import { getAccessToken } from "@/lib/utils"
import { useApplicationResultMutation } from "@/mutations/application"
import { useEndRoundMutation } from "@/mutations/round"
import { HeroModal } from "@/components/ui/HeroModal"
import { roundLabel } from "@/components/pipeline/pipeline.utils"


export default function PipelinePage() {
  const params = useParams<{ id: string }>()
  const jobId = params.id
  const token = getAccessToken();
  const queryClient = useQueryClient();


  const { mutate: mutateApplicationResult, isPending: isApplicationResultPending, isError: isApplicationResultError, error: applicationResultError } = useApplicationResultMutation();

  const { mutate: mutateEndRound, isPending: isEndRoundPending, isError: isEndRoundError, error: endRoundError } = useEndRoundMutation();

  const [rounds, setRounds] = useState<Round[]>([])
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Candidate drawer
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineCandidate | null>(null)

  // Round candidates drawer
  const [selectedRoundForDrawer, setSelectedRoundForDrawer] = useState<Round | null>(null)

  // Add round modal
  const [addRoundOpen, setAddRoundOpen] = useState(false)

  // End round confirmation modal state
  const [roundIdToEnd, setRoundIdToEnd] = useState<string | null>(null)


  // Refresh trigger for candidate lists
  const [refreshKey, setRefreshKey] = useState(0)

  // ── Data fetching ───────────────────────────────────────────────────────────

  useEffect(() => {

    const fetchAll = async () => {
      try {
        const roundsRes = await apiGet<RoundsResponse>(`/api/v1/round/${jobId}`, token)
        const sorted = [...roundsRes.data].sort((a, b) => a.order - b.order)
        setRounds(sorted)

        // Fetch candidates for each round using its round_id
        // const candResults = await Promise.all(
        //   sorted.map((round) =>
        //     apiGet<CandidatesResponse>(`/api/v1/round/${round._id}/applications`, token)
        //       .then((res) => res.candidates ?? [])
        //       .catch(() => [] as PipelineCandidate[])
        //   )
        // )
        // setCandidates(candResults.flat())
      } catch {
        setError("Failed to load pipeline data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [jobId])

  // ── Handlers ────────────────────────────────────────────────────────────────

  function candidatesForRound(roundId: string) {
    return candidates.filter((c) => c.current_round_id === roundId)
  }

  function handleEndRound(roundId: string) {
    setRoundIdToEnd(roundId)
  }

  async function handleConfirmEndRound() {
    if (!roundIdToEnd) return
    mutateEndRound(roundIdToEnd, {
      onSuccess: async () => {
        toast.success("Round has been ended successfully!")
        setRoundIdToEnd(null)
        // Refresh rounds
        try {
          const roundsRes = await apiGet<RoundsResponse>(`/api/v1/round/${jobId}`, token)
          setRounds([...roundsRes.data].sort((a, b) => a.order - b.order))
        } catch (err) {
          console.error("Failed to refresh rounds:", err)
        }
      },
      onError: () => {
        toast.error("Failed to end round. Please try again.")
      }
    })
  }


  async function handleAddRound(payload: CreateRoundPayload) {
    try {
      await apiPost("/api/v1/round", payload, token)
      // Refresh rounds after creation
      const roundsRes = await apiGet<RoundsResponse>(`/api/v1/round/${jobId}`, token)
      setRounds([...roundsRes.data].sort((a, b) => a.order - b.order))
    } catch (err) {
      console.error("Failed to create round:", err)
    }
  }

  async function handleApplicationResult(candidateId: string, status: "selected" | "rejected", reason: string) {

    mutateApplicationResult(
      { application_id: candidateId, status, reason },
      {
        onSuccess: () => {
          toast.success(`Candidate has been ${status === "selected" ? "accepted" : "rejected"} successfully!`)
          setSelectedCandidate(null)
          queryClient.invalidateQueries({ queryKey: ["round-candidates"] })
        },
        onError: () => {
          toast.error("Failed to update candidate status. Please try again.")
        }
      }
    )
  }

  const handleAcceptCandidate = (candidateId: string, reasoning: string) =>
    handleApplicationResult(candidateId, "selected", reasoning)

  const handleRejectCandidate = (candidateId: string, reason: string) =>
    handleApplicationResult(candidateId, "rejected", reason)

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="pp-page">
      {/* Page header */}
      <header className="pp-page-header">
        <Link href="/job-listings" className="pp-back-btn">
          <ArrowLeftIcon size={15} />
          Job Listings
        </Link>
        <div className="pp-page-title-wrap">
          <div className="pp-page-icon-wrap">
            <GitForkIcon className="pp-page-icon" />
          </div>
          <div>
            <h1 className="pp-page-title">Hiring Pipeline</h1>
            <p className="pp-page-sub">
              {loading
                ? "Loading..."
                : `${rounds.length} stage${rounds.length !== 1 ? "s" : ""} · ${candidates.length} candidate${candidates.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="jl-error" role="alert">
          <CircleAlertIcon size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="pp-loading">
          <Loader2Icon className="pp-loading-spin" />
          <span>Loading pipeline…</span>
        </div>
      )}

      {/* Pipeline board */}
      {!loading && !error && (
        <div className="pp-board-scroll">
          <div className="pp-board" style={{ "--col-count": rounds.length } as React.CSSProperties}>
            {rounds.map((round, i) => (
              <RoundColumn
                key={round._id}
                round={round}
                candidates={candidatesForRound(round._id)}
                index={i}
                total={rounds.length}
                onSelectRound={setSelectedRoundForDrawer}
                onAddRound={() => setAddRoundOpen(true)}
                onEndRound={handleEndRound}
              />
            ))}

            {rounds.length === 0 && (
              <div className="pp-empty">
                <GitForkIcon size={36} className="pp-empty-icon" />
                <p>No pipeline stages configured yet.</p>
                <button
                  className="pp-btn-add-first"
                  onClick={() => setAddRoundOpen(true)}
                >
                  Add first round
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Round candidates list drawer */}
      <RoundCandidatesDrawer
        round={selectedRoundForDrawer}
        onClose={() => setSelectedRoundForDrawer(null)}
        onSelectCandidate={(cand) => setSelectedCandidate(cand)}
        refreshKey={refreshKey}
        onAccept={handleAcceptCandidate}
        onReject={handleRejectCandidate}
      />

      {/* Candidate detail drawer */}
      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAccept={handleAcceptCandidate}
        onReject={handleRejectCandidate}
      />

      {/* Add Round modal */}
      <AddRoundModal
        open={addRoundOpen}
        onClose={() => setAddRoundOpen(false)}
        jobId={jobId}
        currentRoundCount={rounds.length}
        onConfirm={handleAddRound}
      />

      {/* End Round Confirmation modal */}
      <HeroModal
        open={!!roundIdToEnd}
        onClose={() => setRoundIdToEnd(null)}
        variant="warning"
        title="End Hiring Round"
        description="Are you sure you want to end this hiring round?"
        primaryAction={{
          label: "Confirm & End",
          isLoading: isEndRoundPending,
          variant: "destructive",
          onClick: handleConfirmEndRound,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setRoundIdToEnd(null),
        }}
      >
        <div className="space-y-2 py-2">
          {roundIdToEnd && rounds.find((r) => r._id === roundIdToEnd) && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-amber-600 dark:text-amber-400">
              <span className="font-semibold">
                Round: {roundLabel(rounds.find((r) => r._id === roundIdToEnd)!.type)} (Stage {rounds.find((r) => r._id === roundIdToEnd)!.order})
              </span>
            </div>
          )}
          <p className="text-muted-foreground text-xs leading-normal">
            Ending this round will mark it as complete. Candidates in this stage who have not yet been selected or rejected will need to be processed, and no further candidate assessments can be started for this specific round.
          </p>
        </div>
      </HeroModal>
    </div>
  )
}

