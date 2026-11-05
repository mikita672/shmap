package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.chat.ChatAccess;
import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.route.dto.RouteResponse;
import com.mdzvtt.shmap.route.dto.RouteStopResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Route route = routeRepository.save(new Route(chat, name, userRepository.getReferenceById(userId)));
        return toResponse(route, userId);
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
