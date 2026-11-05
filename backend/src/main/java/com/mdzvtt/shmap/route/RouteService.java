package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.chat.ChatAccess;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final ChatAccess chatAccess;
    private final StorageService storageService;

    @Transactional
    public RouteResponse create(Integer userId, Long chatId, String name) {
        Chat chat = chatAccess.findForMember(userId, chatId);
        requireCanEdit(chat, userId);
        Route route = routeRepository.save(new Route(chat, name, userRepository.getReferenceById(userId)));
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
    public RouteResponse addStop(Integer userId, Long routeId, PlaceSnapshot place) {
        Route route = lockRoute(userId, routeId);
        route.addStop(new RouteStop(place, userRepository.getReferenceById(userId)));
        routeRepository.flush();
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
