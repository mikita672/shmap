package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.chat.ChatChanged;
import com.mdzvtt.shmap.chat.ChatAccess;
import com.mdzvtt.shmap.chat.ChatMemberRepository;
import com.mdzvtt.shmap.chat.ChatMessageRepository;
import com.mdzvtt.shmap.chat.ChatService;
import com.mdzvtt.shmap.chat.ChatType;
import com.mdzvtt.shmap.directions.RoutingRequest;
import com.mdzvtt.shmap.directions.RoutingResult;
import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.exception.NotChatMemberException;
import com.mdzvtt.shmap.exception.NotFriendsException;
import com.mdzvtt.shmap.exception.RouteNotFoundException;
import com.mdzvtt.shmap.place.PlaceSnapshot;
import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.route.dto.RouteCompletionResponse;
import com.mdzvtt.shmap.route.dto.RoutePathResponse;
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

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final ChatAccess chatAccess;
    private final ChatMemberRepository chatMemberRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;
    private final StorageService storageService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public RouteResponse create(Integer userId, Long chatId, String name, TravelMode travelMode, String message) {
        Chat chat = chatAccess.findForMember(userId, chatId);
        requireCanEdit(chat, userId);
        Route route = routeRepository.save(
                new Route(chat, name, userRepository.getReferenceById(userId), travelMode));
        announceChanged(route);
        chatService.sendRoute(userId, chatId, route, message);
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
        Optional<Route> asMember = routeRepository.findForMember(routeId, userId);
        if (asMember.isPresent()) {
            return toResponse(asMember.get(), userId);
        }
        Route route = routeRepository.findVisibleTo(routeId, userId).orElseThrow(RouteNotFoundException::new);
        return toResponse(route, null, false, false);
    }

    @Transactional
    public Optional<RoutingRequest> update(Integer userId, Long routeId, String name, TravelMode travelMode) {
        Route route = lockRoute(userId, routeId);
        if (name != null) {
            route.rename(name);
            chatMessageRepository.renameRoute(routeId, name);
        }
        if (travelMode != null) {
            route.changeTravelMode(travelMode);
        }
        announceChanged(route);
        return route.pathToBuild();
    }

    @Transactional
    public RouteResponse complete(Integer userId, Long routeId, LocalDate finishedOn, Set<Integer> participantIds,
            RouteVisibility visibility) {
        Route route = lockRoute(userId, routeId);
        Set<Integer> allowedIds = new HashSet<>(chatMemberRepository.findUserIdsByChatId(route.getChat().getId()));
        route.getParticipants().forEach(participant -> allowedIds.add(participant.getId()));
        if (!allowedIds.containsAll(participantIds)) {
            throw new NotChatMemberException();
        }
        route.complete(finishedOn, visibility, userRepository.findAllById(participantIds));
        announceChanged(route);
        return toResponse(route, userId);
    }

    @Transactional
    public RouteResponse reopen(Integer userId, Long routeId) {
        Route route = lockRoute(userId, routeId);
        if (route.reopen()) {
            announceChanged(route);
        }
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
    public Optional<RoutingRequest> addStop(Integer userId, Long routeId, PlaceSnapshot place) {
        Route route = lockRoute(userId, routeId);
        route.addStop(new RouteStop(place, userRepository.getReferenceById(userId)));
        announceChanged(route);
        return route.pathToBuild();
    }

    @Transactional
    public Optional<RoutingRequest> removeStop(Integer userId, Long routeId, Long stopId) {
        Route route = lockRoute(userId, routeId);
        route.removeStop(stopId);
        announceChanged(route);
        return route.pathToBuild();
    }

    @Transactional
    public Optional<RoutingRequest> reorderStops(Integer userId, Long routeId, List<Long> stopIds) {
        Route route = lockRoute(userId, routeId);
        route.reorderStops(stopIds);
        announceChanged(route);
        return route.pathToBuild();
    }

    @Transactional
    public Optional<RoutingRequest> pathToRetry(Integer userId, Long routeId) {
        routeRepository.findByIdForUpdate(routeId).orElseThrow(RouteNotFoundException::new);
        Route route = findRoute(userId, routeId);
        PathStatus statusBefore = route.getPathStatus();
        Optional<RoutingRequest> request = route.pathToRetry();
        if (route.getPathStatus() != statusBefore) {
            announceChanged(route);
        }
        return request;
    }

    @Transactional
    public void savePath(Long routeId, RoutingRequest builtFor, RoutingResult result) {
        routeRepository.findByIdForUpdate(routeId)
                .filter(route -> route.applyPath(builtFor, result))
                .ifPresent(this::announceChanged);
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
        return toResponse(route, chat.getId(), true, chatAccess.canSend(chat, userId));
    }

    private RouteResponse toResponse(Route route, Long chatId, boolean member, boolean canEdit) {
        return new RouteResponse(
                route.getId(),
                chatId,
                route.getName(),
                route.getTravelMode(),
                RoutePathResponse.from(route.getPathStatus(), route.getPath()),
                toSummary(route.getCreatedBy()),
                route.getCreatedAt(),
                route.getUpdatedAt(),
                member,
                canEdit,
                toCompletionResponse(route),
                route.getStops().stream()
                        .map(this::toStopResponse)
                        .toList());
    }

    private RouteCompletionResponse toCompletionResponse(Route route) {
        RouteCompletion completion = route.getCompletion();
        if (completion == null) {
            return null;
        }
        return new RouteCompletionResponse(
                completion.finishedOn(),
                completion.visibility(),
                route.effectiveVisibility(),
                route.getParticipants().stream()
                        .sorted(Comparator.comparing(User::getId))
                        .map(this::toSummary)
                        .toList());
    }

    private RouteSummaryResponse toSummaryResponse(RouteListRow row) {
        return new RouteSummaryResponse(
                row.id(),
                row.name(),
                row.travelMode(),
                row.stopCount(),
                row.distanceMeters(),
                row.durationSeconds(),
                row.finishedOn(),
                toSummary(row.createdBy()),
                row.createdAt(),
                row.updatedAt());
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
