package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.exception.SuggestionsUnavailableException;
import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.place.PlaceSnapshot;
import com.mdzvtt.shmap.place.photon.PhotonApi;
import com.mdzvtt.shmap.place.photon.PhotonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Component
@RequiredArgsConstructor
public class CandidateFinder {
    public static final int MAX_CANDIDATES = 40;
    private static final String LANGUAGE = "en";

    private final PhotonApi photon;

    public List<Candidate> find(SearchArea area, Set<PlaceCategory> categories, Set<String> osmIdsOnRoute) {
        if (categories.isEmpty()) {
            return List.of();
        }
        int perCategory = (int) Math.ceil((double) MAX_CANDIDATES / categories.size());
        List<Iterator<Found>> results = EnumSet.copyOf(categories).stream()
                .map(category -> search(area, category, perCategory).iterator())
                .toList();
        List<Found> picked = interleave(results, osmIdsOnRoute);
        List<Candidate> candidates = new ArrayList<>(picked.size());
        for (int i = 0; i < picked.size(); i++) {
            candidates.add(picked.get(i).toCandidate("c" + (i + 1), area));
        }
        return candidates;
    }

    private List<Found> search(SearchArea area, PlaceCategory category, int limit) {
        return area.bboxes().stream()
                .flatMap(bbox -> search(bbox, category, limit).stream())
                .toList();
    }

    private List<Found> search(String bbox, PlaceCategory category, int limit) {
        PhotonResponse response;
        try {
            response = photon.search(String.join(",", category.photonIncludes()), bbox, limit, LANGUAGE);
        } catch (RestClientException e) {
            log.warn("photon search for {} failed: {}", category, e.getMessage());
            throw new SuggestionsUnavailableException();
        }
        if (response == null || response.features() == null) {
            return List.of();
        }
        return response.features().stream()
                .map(CandidateFinder::toPlace)
                .filter(Objects::nonNull)
                .map(place -> new Found(place, category))
                .toList();
    }

    private static List<Found> interleave(List<Iterator<Found>> results, Set<String> osmIdsOnRoute) {
        Set<String> taken = new HashSet<>(osmIdsOnRoute);
        List<Found> picked = new ArrayList<>();
        boolean anyLeft = true;
        while (anyLeft && picked.size() < MAX_CANDIDATES) {
            anyLeft = false;
            for (Iterator<Found> result : results) {
                Found next = nextNew(result, taken);
                if (next != null && picked.size() < MAX_CANDIDATES) {
                    picked.add(next);
                    anyLeft = true;
                }
            }
        }
        return picked;
    }

    private static Found nextNew(Iterator<Found> result, Set<String> taken) {
        while (result.hasNext()) {
            Found found = result.next();
            String osmId = found.place().osmId();
            if (osmId == null || taken.add(osmId)) {
                return found;
            }
        }
        return null;
    }

    private static PlaceSnapshot toPlace(PhotonResponse.Feature feature) {
        PhotonResponse.Properties properties = feature.properties();
        if (properties == null || isBlank(properties.name()) || feature.geometry() == null
                || feature.geometry().coordinates() == null || feature.geometry().coordinates().size() < 2) {
            return null;
        }
        List<Double> coordinates = feature.geometry().coordinates();
        String osmId = properties.osmType() == null || properties.osmId() == null
                ? null
                : properties.osmType() + properties.osmId();
        return new PlaceSnapshot(
                limit(osmId, 32),
                limit(properties.name(), 200),
                limit(address(properties), 300),
                limit(properties.osmKey(), 50),
                limit(properties.osmValue(), 50),
                coordinates.get(1),
                coordinates.get(0));
    }

    private static String address(PhotonResponse.Properties properties) {
        String street = Stream.of(properties.street(), properties.housenumber())
                .filter(part -> !isBlank(part))
                .collect(Collectors.joining(" "));
        String address = Stream.of(street, properties.city())
                .filter(part -> !isBlank(part))
                .collect(Collectors.joining(", "));
        return address.isEmpty() ? null : address;
    }

    private static String limit(String value, int max) {
        if (isBlank(value)) {
            return null;
        }
        String stripped = value.strip();
        return stripped.length() > max ? stripped.substring(0, max) : stripped;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record Found(PlaceSnapshot place, PlaceCategory category) {
        Candidate toCandidate(String id, SearchArea area) {
            return new Candidate(id, place, category, area.distanceFromCentre(place.latitude(), place.longitude()));
        }
    }
}
