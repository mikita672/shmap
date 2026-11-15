package com.mdzvtt.shmap.push;

import java.util.List;

public interface PushSender {
    List<PushResult> send(List<PushMessage> messages);
}
