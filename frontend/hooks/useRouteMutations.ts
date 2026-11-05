import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { chatRoutesQueryOptions } from "@/hooks/useChatRoutes";
import { routeQueryOptions } from "@/hooks/useRoute";
import { createRoute } from "@/lib/api/routes";
import type { CreateRouteRequest } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

export function useCreateRoute(chatId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRouteRequest) => {
      const response = await createRoute(chatId, data);
      return response.data;
    },
    onSuccess: (route) => {
      queryClient.setQueryData(routeQueryOptions(route.id).queryKey, route);
      void queryClient.invalidateQueries({
        queryKey: chatRoutesQueryOptions(chatId).queryKey,
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't create the route"));
    },
  });
}
