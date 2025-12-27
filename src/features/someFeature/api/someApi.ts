import { proxyApi } from "@/lib/api/axiosApi";

export async function getConversations() {
  // NOTE: no leading slash
  const res = await proxyApi.get("v1/api/chat/conversations");
  return res.data;
}
