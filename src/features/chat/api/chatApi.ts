import { ChatStreamBody } from "@/features/chat/types/models";
import { API_BASE } from "@/lib/api/http";
import { authHeader } from "@/features/auth/utils/auth";
import {
  API_PATHS,
  APPLICATION_JSON,
  CACHE_NO_STORE,
  CONTENT_TYPE,
  EMPTY_STRING,
  EVENT_DATA_SLICE_START,
  EVENT_DATA_START_WITH,
  EVENT_NAME_SLICE_START,
  EVENT_NAME_START_WITH,
} from "@/shared/constants/constants";

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/v1/providers`, {
    headers: authHeader(),
    cache: CACHE_NO_STORE,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function fetchModels(providerId: string) {
  const res = await fetch(`${API_BASE}/v1/providers/${providerId}/models`, {
    headers: authHeader(),
    cache: CACHE_NO_STORE,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Basic SSE reader. Calls onEvent({event, data}) for each frame. */
export function streamChat(
  conversationId: number,
  // body: ChatStreamBody,
  body: any,

  onEvent: (evt: { event: string; data: any }) => void,
  signal?: AbortSignal
) {
  return fetch(API_BASE + API_PATHS.CONVERSATIONS.COMPLETIONS(conversationId), {
    method: "POST",
    headers: {
      ...authHeader(),
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify(body),
    signal,
  }).then(async (res) => {
    if (!res.ok || !res.body) throw new Error(await res.text());
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buf = EMPTY_STRING;
    const processBuffer = (isFinal: boolean = false) => {
      let idx: number;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        let event = "message";
        let data = EMPTY_STRING;
        for (const line of frame.split("\n")) {
          if (!line) continue;
          if (line.startsWith(EVENT_NAME_START_WITH))
            event = line.slice(EVENT_NAME_SLICE_START).trim();
          else if (line.startsWith(EVENT_DATA_START_WITH))
            data += line.slice(EVENT_DATA_SLICE_START).trim();
        }
        if (data) {
          try {
            onEvent({ event: event, data: JSON.parse(data) });
          } catch {}
        }
      }
      // Process final incomplete frame if stream is done
      if (isFinal && buf) {
        let event = "message";
        let data = EMPTY_STRING;
        for (const line of buf.split("\n")) {
          if (!line) continue;
          if (line.startsWith(EVENT_NAME_START_WITH))
            event = line.slice(EVENT_NAME_SLICE_START).trim();
          else if (line.startsWith(EVENT_DATA_START_WITH))
            data += line.slice(EVENT_DATA_SLICE_START).trim();
        }
        if (data) {
          try {
            onEvent({ event: event, data: JSON.parse(data) });
          } catch {}
        }
        buf = EMPTY_STRING; // Clear buffer
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        processBuffer(true); // Process any remaining buffer content
        break;
      }
      buf += decoder.decode(value, { stream: true });
      // console.log("Buffer", buf);
      processBuffer();
    }
  });
}
