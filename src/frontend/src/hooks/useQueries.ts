import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetPersonalBest() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint | null>({
    queryKey: ["personalBest"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPersonalBest();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePersonalBest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attempts: number) => {
      if (!actor) return;
      await actor.updatePersonalBest(BigInt(attempts));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalBest"] });
    },
  });
}
