import { ChatStreamBody } from "@/types/models";
import { API_BASE } from "./http";
import { authHeader } from "./auth";

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/v1/providers`, {
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function fetchModels(providerId: string) {
  const res = await fetch(`${API_BASE}/v1/providers/${providerId}/models`, {
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Basic SSE reader. Calls onEvent({event, data}) for each frame. */
export function streamChat(
  // body: ChatStreamBody,
  body: any,

  onEvent: (evt: { event: string; data: any }) => void,
  signal?: AbortSignal
) {
  return fetch(`${API_BASE}/v1/chat/completions/streaming-and-non-streaming/1`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  }).then(async (res) => {
    if (!res.ok || !res.body) throw new Error(await res.text());
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buf = "";
    const processBuffer = (isFinal: boolean = false) => {
      let idx: number;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        let event = "message";
        let data = "";
        for (const line of frame.split("\n")) {
          if (!line) continue;
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) data += line.slice(5).trim();
        }
        if (data) {
          try {
            onEvent({ event: event, data: JSON.parse(data) });
          } catch { }
        }
      }
      // Process final incomplete frame if stream is done
      if (isFinal && buf) {
        let event = "message";
        let data = "";
        for (const line of buf.split("\n")) {
          if (!line) continue;
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) data += line.slice(5).trim();
        }
        if (data) {
          try {
            onEvent({ event: event, data: JSON.parse(data) });
          } catch { }
        }
        buf = ""; // Clear buffer
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
