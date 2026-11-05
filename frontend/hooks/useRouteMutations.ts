import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { chatRoutesQueryOptions } from "@/hooks/useChatRoutes";
import { routeQueryOptions } from "@/hooks/useRoute";
import {
  addRouteStop,
  createRoute,
  deleteRoute,
  removeRouteStop,
  reorderRouteStops,
  retryRoutePath,
  updateRoute,
} from "@/lib/api/routes";
import type {
  ChatPlace,
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

const NO_PATH: RoutePathResponse = {
  status: "NONE",
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

export function useRemoveStop(routeId: number) {
  return useOptimisticRouteEdit(routeId, {
    request: async (stopId: number) => {
      const response = await removeRouteStop(routeId, stopId);
      return response.data;
    },
    optimistic: (route, stopId) => {
      const stops = route.stops.filter((stop) => stop.id !== stopId);
      return {
        ...route,
        stops,
        path: stops.length < 2 ? NO_PATH : PENDING_PATH,
      };
    },
    errorMessage: "Couldn't remove the place",
  });
}

export function useReorderStops(routeId: number) {
  return useOptimisticRouteEdit(routeId, {
    request: async (stopIds: number[]) => {
      const response = await reorderRouteStops(routeId, stopIds);
      return response.data;
    },
    optimistic: (route, stopIds) => {
      const byId = new Map(route.stops.map((stop) => [stop.id, stop]));
      const stops = stopIds.flatMap((id) => byId.get(id) ?? []);
      return { ...route, stops, path: PENDING_PATH };
    },
    errorMessage: "Couldn't reorder the stops",
  });
}

export function useRenameRoute(routeId: number) {
  const queryClient = useQueryClient();
  const { queryKey } = routeQueryOptions(routeId);

  return useMutation({
    mutationKey: routeEditMutationKey(routeId),
    scope: { id: `route-${routeId}` },
    mutationFn: async (name: string) => {
      const response = await updateRoute(routeId, { name });
      return response.data;
    },
    onSuccess: (route) => {
      queryClient.setQueryData(queryKey, route);
      void queryClient.invalidateQueries({
        queryKey: chatRoutesQueryOptions(route.chatId).queryKey,
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't rename the route"));
    },
  });
}

export function useDeleteRoute(routeId: number) {
  const queryClient = useQueryClient();
  const { queryKey } = routeQueryOptions(routeId);

  return useMutation({
    mutationKey: routeEditMutationKey(routeId),
    scope: { id: `route-${routeId}` },
    mutationFn: async (chatId: number) => {
      await deleteRoute(routeId);
      return chatId;
    },
    onSuccess: (chatId) => {
      void queryClient.invalidateQueries({ queryKey, refetchType: "none" });
      void queryClient.invalidateQueries({
        queryKey: chatRoutesQueryOptions(chatId).queryKey,
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't delete the route"));
    },
  });
}

export function useAddStop(routeId: number) {
  const queryClient = useQueryClient();
  const { queryKey } = routeQueryOptions(routeId);

  return useMutation({
    mutationKey: routeEditMutationKey(routeId),
    scope: { id: `route-${routeId}` },
    mutationFn: async (place: ChatPlace) => {
      const response = await addRouteStop(routeId, place);
      return response.data;
    },
    onSuccess: (route) => {
      queryClient.setQueryData(queryKey, route);
      void queryClient.invalidateQueries({
        queryKey: chatRoutesQueryOptions(route.chatId).queryKey,
        exact: true,
      });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey, exact: true });
      toast.error(getErrorMessage(error, "Couldn't add the place"));
    },
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
