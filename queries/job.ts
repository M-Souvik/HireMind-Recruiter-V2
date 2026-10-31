import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api/client"
import { getAccessToken } from "@/lib/utils"
import { Job } from "@/types/jobs"
// import type { CandidatesResponse } from "@/types/pipeline"


/**
 * Fetch job details by id.
 * GET /api/v1/jobs/{jobId}
 */
export function useGetJobDetailQuery(jobId: string | undefined) {
    return useQuery<Job>({
        queryKey: ["job-details", jobId],
        queryFn: () => {
            const token = getAccessToken()
            return apiGet<Job>(`/api/v1/jobs/${jobId}`, token)
        },
        enabled: !!jobId,
    })
}
