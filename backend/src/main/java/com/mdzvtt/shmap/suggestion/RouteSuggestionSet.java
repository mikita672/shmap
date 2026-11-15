package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.route.Route;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "route_suggestion_set")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RouteSuggestionSet {
    public static final int MAX_NOTE_LENGTH = 200;

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id", unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "suggested_by_id")
    private User suggestedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant suggestedAt;

    @Column(length = MAX_NOTE_LENGTH)
    private String note;

    @Column(nullable = false, length = 100)
    private String model;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "set_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OrderColumn(name = "position")
    private List<RouteSuggestion> suggestions = new ArrayList<>();

    public RouteSuggestionSet(Route route, User suggestedBy, String note, String model,
            List<RouteSuggestion> suggestions) {
        this.route = route;
        this.suggestedBy = suggestedBy;
        this.note = note;
        this.model = model.length() > 100 ? model.substring(0, 100) : model;
        this.suggestions.addAll(suggestions);
    }
}
