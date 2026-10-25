import { createParser, type EventSourceMessage } from "eventsource-parser";
import { fetch } from "expo/fetch";
import { API_BASE_URL } from "@/lib/config";

export class EventStreamError extends Error {
  status: number;

  constructor(status: number) {
    super(`Event stream failed with status ${status}`);
    this.name = "EventStreamError";
    this.status = status;
  }
}

export interface ReadEventStreamOptions {
  token: string;
  signal?: AbortSignal;
  onEvent: (event: EventSourceMessage) => void;
  onComment?: (comment: string) => void;
}

export async function readEventStream({
  token,
  signal,
  onEvent,
  onComment,
}: ReadEventStreamOptions): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/events`, {
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new EventStreamError(response.status);
  }

  if (!response.body) {
    return;
  }

  const parser = createParser({
    onEvent,
    onComment,
  });

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      parser.feed(value);
    }
  } catch (error) {
    if (signal?.aborted) {
      return;
    }
    throw error;
  } finally {
    reader.releaseLock();
  }
}
