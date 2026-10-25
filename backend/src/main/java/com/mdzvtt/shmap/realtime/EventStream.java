package com.mdzvtt.shmap.realtime;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

record EventStream(SseEmitter emitter, String token) {
}
