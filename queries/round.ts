import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api/client"
import { getAccessToken } from "@/lib/utils"
import type { CandidatesResponse } from "@/types/pipeline"

/**
 * Fetch candidates for a specific round.
 * GET /api/v1/round/{roundId}/applications
 */
export function useRoundCandidatesQuery(roundId: string | undefined) {
  return useQuery<CandidatesResponse>({
    queryKey: ["round-candidates", roundId],
    queryFn: () => {
      const token = getAccessToken()
      return apiGet<CandidatesResponse>(`/api/v1/round/${roundId}/applications`, token)
    },
    enabled: !!roundId,
  })
}
