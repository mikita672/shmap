import { apiClient } from "./client";
import type {
  ChatPlace,
  CreateRouteRequest,
  RouteResponse,
  RouteSummaryResponse,
  UpdateRouteRequest,
} from "@/lib/types/api";

export const getChatRoutes = (chatId: number) =>
  apiClient.get<RouteSummaryResponse[]>(`/api/v1/chats/${chatId}/routes`);

export const createRoute = (chatId: number, data: CreateRouteRequest) =>
  apiClient.post<RouteResponse>(`/api/v1/chats/${chatId}/routes`, data);

export const getRoute = (routeId: number) =>
  apiClient.get<RouteResponse>(`/api/v1/routes/${routeId}`);

export const updateRoute = (routeId: number, data: UpdateRouteRequest) =>
  apiClient.patch<RouteResponse>(`/api/v1/routes/${routeId}`, data);

export const deleteRoute = (routeId: number) =>
  apiClient.delete<void>(`/api/v1/routes/${routeId}`);

export const addRouteStop = (routeId: number, place: ChatPlace) =>
  apiClient.post<RouteResponse>(`/api/v1/routes/${routeId}/stops`, { place });

export const removeRouteStop = (routeId: number, stopId: number) =>
  apiClient.delete<RouteResponse>(`/api/v1/routes/${routeId}/stops/${stopId}`);

export const reorderRouteStops = (routeId: number, stopIds: number[]) =>
  apiClient.put<RouteResponse>(`/api/v1/routes/${routeId}/stops/order`, {
    stopIds,
  });

export const retryRoutePath = (routeId: number) =>
  apiClient.put<RouteResponse>(`/api/v1/routes/${routeId}/path`);
