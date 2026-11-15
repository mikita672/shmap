package com.mdzvtt.shmap.push.expo;

import java.util.List;

public record ExpoPushResponse(List<Ticket> data, List<Error> errors) {

    public record Ticket(String status, String id, String message, Details details) {
    }

    public record Details(String error) {
    }

    public record Error(String code, String message) {
    }
}
