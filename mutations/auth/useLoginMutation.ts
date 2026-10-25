import { useMutation } from "@tanstack/react-query"
import { apiPost } from "@/lib/api/client"
import type { LoginPayload, LoginResponse } from "@/types/auth"

/**
 * POST /api/v1/recruiter/login
 *
 * Usage:
 *   const { mutate, isPending, isError, error } = useLoginMutation()
 *   mutate({ email, password })
 */
export function useLoginMutation() {
  return useMutation<LoginResponse, unknown, LoginPayload>({
    mutationFn: (payload: LoginPayload) =>
      apiPost<LoginResponse, LoginPayload>("/api/v1/recruiter/login", payload),
  })
}
