package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.chat.ChatChanged;
import com.mdzvtt.shmap.chat.ChatAccess;
import com.mdzvtt.shmap.chat.ChatMemberRepository;
import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.exception.NotFriendsException;
import com.mdzvtt.shmap.exception.RouteNotFoundException;
import com.mdzvtt.shmap.place.PlaceSnapshot;
import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.route.dto.RouteResponse;
import com.mdzvtt.shmap.route.dto.RouteStopResponse;
import com.mdzvtt.shmap.route.dto.RouteSummaryResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final ChatAccess chatAccess;
    private final ChatMemberRepository chatMemberRepository;
    private final StorageService storageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public RouteResponse create(Integer userId, Long chatId, String name, TravelMode travelMode) {
        Chat chat = chatAccess.findForMember(userId, chatId);
        requireCanEdit(chat, userId);
        Route route = routeRepository.save(
                new Route(chat, name, userRepository.getReferenceById(userId), travelMode));
        announceChanged(route);
        announceDirectChat(chat);
        return toResponse(route, userId);
    }

    @Transactional(readOnly = true)
    public List<RouteSummaryResponse> getRoutes(Integer userId, Long chatId) {
        chatAccess.findForMember(userId, chatId);
        return routeRepository.findSummaries(chatId).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RouteResponse getRoute(Integer userId, Long routeId) {
        return toResponse(findRoute(userId, routeId), userId);
    }

    @Transactional
    public RouteResponse rename(Integer userId, Long routeId, String name) {
        Route route = lockRoute(userId, routeId);
        route.rename(name);
        announceChanged(route);
        return toResponse(route, userId);
    }

    @Transactional
    public void delete(Integer userId, Long routeId) {
        Route route = lockRoute(userId, routeId);
        Chat chat = route.getChat();
        routeRepository.delete(route);
        eventPublisher.publishEvent(
                new RouteDeleted(chat.getId(), routeId, chatMemberRepository.findUserIdsByChatId(chat.getId())));
        announceDirectChat(chat);
    }

    @Transactional
    public RouteResponse addStop(Integer userId, Long routeId, PlaceSnapshot place) {
        Route route = lockRoute(userId, routeId);
        route.addStop(new RouteStop(place, userRepository.getReferenceById(userId)));
        routeRepository.flush();
        announceChanged(route);
        return toResponse(route, userId);
    }

    @Transactional
    public RouteResponse removeStop(Integer userId, Long routeId, Long stopId) {
        Route route = lockRoute(userId, routeId);
        route.removeStop(stopId);
        announceChanged(route);
        return toResponse(route, userId);
    }

    @Transactional
    public RouteResponse reorderStops(Integer userId, Long routeId, List<Long> stopIds) {
        Route route = lockRoute(userId, routeId);
        route.reorderStops(stopIds);
        announceChanged(route);
        return toResponse(route, userId);
    }

    private Route lockRoute(Integer userId, Long routeId) {
        routeRepository.findByIdForUpdate(routeId).orElseThrow(RouteNotFoundException::new);
        Route route = findRoute(userId, routeId);
        requireCanEdit(route.getChat(), userId);
        return route;
    }

    private Route findRoute(Integer userId, Long routeId) {
        return routeRepository.findForMember(routeId, userId).orElseThrow(RouteNotFoundException::new);
    }

    private void announceChanged(Route route) {
        Long chatId = route.getChat().getId();
        eventPublisher.publishEvent(
                new RouteChanged(chatId, route.getId(), chatMemberRepository.findUserIdsByChatId(chatId)));
    }

    private void announceDirectChat(Chat chat) {
        if (chat.getType() == ChatType.DIRECT) {
            Set<Integer> memberIds = chatMemberRepository.findUserIdsByChatId(chat.getId());
            eventPublisher.publishEvent(new ChatChanged(chat.getId(), memberIds));
        }
    }

    private void requireCanEdit(Chat chat, Integer userId) {
        if (!chatAccess.canSend(chat, userId)) {
            throw new NotFriendsException("You can only plan routes with friends");
        }
    }

    private RouteResponse toResponse(Route route, Integer userId) {
        Chat chat = route.getChat();
        return new RouteResponse(
                route.getId(),
                chat.getId(),
                route.getName(),
                route.getTravelMode(),
                toSummary(route.getCreatedBy()),
                route.getCreatedAt(),
                route.getUpdatedAt(),
                chatAccess.canSend(chat, userId),
                route.getStops().stream()
                        .map(this::toStopResponse)
                        .toList());
    }

    private RouteSummaryResponse toSummaryResponse(RouteListRow row) {
        Route route = row.route();
        return new RouteSummaryResponse(
                route.getId(),
                route.getName(),
                route.getTravelMode(),
                row.stopCount(),
                toSummary(row.createdBy()),
                route.getCreatedAt(),
                route.getUpdatedAt());
    }

    private RouteStopResponse toStopResponse(RouteStop stop) {
        return new RouteStopResponse(
                stop.getId(),
                PlaceResponse.from(stop.getPlace()),
                toSummary(stop.getAddedBy()),
                stop.getCreatedAt());
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
