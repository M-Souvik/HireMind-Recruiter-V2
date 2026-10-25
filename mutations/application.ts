import { apiPost } from "@/lib/api/client"
import { getAccessToken } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface UpdateApplicationResultPayload {
    application_id: string
    status: "selected" | "rejected"
    reason: string
}

export function useApplicationResultMutation() {
    // const queryClient = useQueryClient()

    return useMutation<unknown, unknown, UpdateApplicationResultPayload>({
        mutationFn: (payload) => {
            const token = getAccessToken();
            return apiPost<unknown, UpdateApplicationResultPayload>(
                "/api/v1/round/applications/results",
                payload,
                token,
            )
        }
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ["round-candidates"] })
        // },
    })
}