import { useMutation } from "@tanstack/react-query"
import { apiPost } from "@/lib/api/client"

export interface CreateJobPayload {
  title: string
  description: string
  location: string
  skills: string[]
  min_salary_range: number
  max_salary_range: number
  type: string | null
  req_experience: string | null
  loc_type: string | null
  start_time: string // ISO string
  end_time: string // ISO string
  status: "open" | "scheduled" | string
  validity: number
}

export interface CreateJobResponse {
  message: string
  data: {
    _id: string
    name: string
  }
}

/**
 * POST /api/v1/jobs/
 *
 * Usage:
 *   const { mutate, isPending, isError, error } = useCreateJobMutation()
 *   mutate(payload)
 */
export function useCreateJobMutation() {
  return useMutation<CreateJobResponse, unknown, CreateJobPayload>({
    mutationFn: (payload) => {
      const token = (() => {
        try {
          return JSON.parse(sessionStorage.getItem("token") ?? "{}") as string
        } catch {
          return undefined
        }
      })()
      return apiPost<CreateJobResponse, CreateJobPayload>(
        "/api/v1/jobs/",
        payload,
        token,
      )
    },
  })
}
