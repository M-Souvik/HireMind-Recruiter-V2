import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api/client"
import { getAccessToken } from "@/lib/utils"
import type { QuestionListResponse } from "@/types/pipeline"

/**
 * Fetch question paper list.
 * GET /api/v1/assessments/qp
 */
export function useGetQuestionList() {
  return useQuery<QuestionListResponse>({
    queryKey: ["question-list"],
    queryFn: () => {
      const token = getAccessToken()
      return apiGet<QuestionListResponse>(`/api/v1/assessments/qp`, token)
    },
    // enabled: !!roundId,
  })
}
