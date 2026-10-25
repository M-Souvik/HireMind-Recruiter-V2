import { apiPost } from "@/lib/api/client";
import { getAccessToken } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEndRoundMutation() {
    const queryClient = useQueryClient();

    return useMutation<unknown, unknown, string>({
        mutationFn: (roundId) => {
            const token = getAccessToken();
            return apiPost<unknown, undefined>(
                `/api/v1/round/${roundId}/end`,
                undefined,
                token,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["round-candidates"] });
        },
    });
}

// Alias for plural naming variation
// export const useEndRoundMutations = useEndRoundMutation;
