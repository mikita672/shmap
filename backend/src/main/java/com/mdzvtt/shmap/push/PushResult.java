package com.mdzvtt.shmap.push;

public sealed interface PushResult {
    String token();

    record Sent(String token) implements PushResult {
    }

    record DeviceNotRegistered(String token) implements PushResult {
    }

    record Failed(String token) implements PushResult {
    }
}
