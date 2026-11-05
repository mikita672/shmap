import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { chatRoutesQueryOptions } from "@/hooks/useChatRoutes";
import { routeQueryOptions } from "@/hooks/useRoute";
import { createRoute, retryRoutePath, updateRoute } from "@/lib/api/routes";
import type {
  CreateRouteRequest,
  RoutePathResponse,
  RouteResponse,
  TravelMode,
} from "@/lib/types/api";
import { getErrorMessage } from "@/lib/utils/error";

const PENDING_PATH: RoutePathResponse = {
  status: "PENDING",
  distanceMeters: null,
  durationSeconds: null,
  polyline: null,
};

export const routeEditMutationKey = (routeId: number) => [
  "routes",
  routeId,
  "edit",
];

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

export function useSetTravelMode(routeId: number) {
  return useOptimisticRouteEdit(routeId, {
    request: async (travelMode: TravelMode) => {
      const response = await updateRoute(routeId, { travelMode });
      return response.data;
    },
    optimistic: (route, travelMode) => ({
      ...route,
      travelMode,
      path: PENDING_PATH,
    }),
    errorMessage: "Couldn't change the travel mode",
  });
}

export function useRetryPath(routeId: number) {
  return useOptimisticRouteEdit<void>(routeId, {
    request: async () => {
      const response = await retryRoutePath(routeId);
      return response.data;
    },
    optimistic: (route) => ({ ...route, path: PENDING_PATH }),
    errorMessage: "Couldn't load the path",
  });
}

interface OptimisticRouteEdit<TVariables> {
  request: (variables: TVariables) => Promise<RouteResponse>;
  optimistic: (route: RouteResponse, variables: TVariables) => RouteResponse;
  errorMessage: string;
}

function useOptimisticRouteEdit<TVariables>(
  routeId: number,
  { request, optimistic, errorMessage }: OptimisticRouteEdit<TVariables>,
) {
  const queryClient = useQueryClient();
  const { queryKey } = routeQueryOptions(routeId);
  const mutationKey = routeEditMutationKey(routeId);

  return useMutation({
    mutationKey,
    scope: { id: `route-${routeId}` },
    mutationFn: request,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey, exact: true });
      const previous = queryClient.getQueryData(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, optimistic(previous, variables));
      }
      return { previous };
    },
    onSuccess: (route) => {
      if (isLastEdit(queryClient, mutationKey)) {
        queryClient.setQueryData(queryKey, route);
      }
    },
    onError: (error, _variables, result) => {
      if (result?.previous && isLastEdit(queryClient, mutationKey)) {
        queryClient.setQueryData(queryKey, result.previous);
      }
      toast.error(getErrorMessage(error, errorMessage));
    },
    onSettled: (route) => {
      if (isLastEdit(queryClient, mutationKey)) {
        void queryClient.invalidateQueries({ queryKey, exact: true });
      }
      if (route) {
        void queryClient.invalidateQueries({
          queryKey: chatRoutesQueryOptions(route.chatId).queryKey,
          exact: true,
        });
      }
    },
  });
}

function isLastEdit(queryClient: QueryClient, mutationKey: unknown[]) {
  return queryClient.isMutating({ mutationKey }) <= 1;
}
