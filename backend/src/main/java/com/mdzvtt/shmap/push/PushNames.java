package com.mdzvtt.shmap.push;

final class PushNames {
    private PushNames() {
    }

    static String fullName(String firstName, String lastName, String username) {
        String name = ((firstName == null ? "" : firstName) + " " + (lastName == null ? "" : lastName)).strip();
        return name.isEmpty() ? "@" + username : name;
    }

    static String firstName(String firstName, String username) {
        return firstName == null || firstName.isBlank() ? "@" + username : firstName;
    }
}
