import { API_BASE } from "./http";

export type ChatMsg = {
  role: any; //"user" | "assistant" | "system";
  content: string;
};
export type RouteSel = { provider: string; model: string };

export type ChatStreamBody = {
  // NEW request contract
  mode?: any;
  messages: ChatMsg[];
  routes: RouteSel[] | null; // multi/consensus: array, single: null
  stream?: boolean; // new
  provider_response?: boolean; // new
};

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/v1/providers`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchModels(providerId: string) {
  const res = await fetch(`${API_BASE}/v1/providers/${providerId}/models`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Basic SSE reader. Calls onEvent({event, data}) for each frame. */
export function streamChat(
  body: ChatStreamBody,
  onEvent: (evt: { event: string; data: any }) => void,
  signal?: AbortSignal
) {
  return fetch(`${API_BASE}/v1/chat/completions/streaming-and-non-streaming`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer amk_live_dev_1f3b2c9a.$2a$12$d6rQGxp8lQo1TyhdR4Qq7uPb4knRJhLKF47pea4j0ilI/TS1HarHS",
    },
    body: JSON.stringify(body),
    signal,
  }).then(async (res) => {
    if (!res.ok || !res.body) throw new Error(await res.text());
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      const data = decoder.decode(value);
      if (data.trim() === "") continue;

      let eventName = "message";
      eventName = data.split("\n").at(0) ?? "";
      if (eventName.startsWith("event:")) eventName = eventName.slice(6).trim();
      // Get data line (second line)
      let dataLine = data.split("\n").at(1) ?? "";
      if (dataLine.startsWith("data:")) dataLine = dataLine.slice(5).trim();
      // console.log("SSE frame", { eventName, dataLine });

      onEvent({ event: eventName, data: JSON.parse(dataLine) });
    }
    /* let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
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
          } catch {}
        }
      }
    } */
  });
}
