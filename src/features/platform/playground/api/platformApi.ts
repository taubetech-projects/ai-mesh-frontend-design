import { CHAT_API_PATHS } from "@/shared/constants/constants";

export async function streamChat(
  body: any,
  onEvent: (evt: { event: string; data: any }) => void,
  signal?: AbortSignal,
) {
  const url = "/api/proxy/platform/v1/platform/messages";
  console.log("Stream chat called . url is : ", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  const processBuffer = (isFinal = false) => {
    let idx: number;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const frame = buf.slice(0, idx);
      buf = buf.slice(idx + 2);

      let event = "message";
      let data = "";

      for (const line of frame.split("\n")) {
        if (!line) continue;
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) data += line.slice(5).trim();
      }

      if (data) {
        try {
          onEvent({ event, data: JSON.parse(data) });
        } catch {}
      }
    }

    if (isFinal && buf) {
      buf = "";
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      processBuffer(true);
      break;
    }
    buf += decoder.decode(value, { stream: true });
    processBuffer(false);
  }
}
