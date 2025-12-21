import { queryKey } from "@/lib/react-query/keys";
import { useQuery } from "@tanstack/react-query";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

/* ---------------------------
 * Queries
 * -------------------------- */
export const useGetMessagesByConversationId = (conversationId: number) =>
  useQuery({
    queryKey: cacheKey(conversationId), // ✅ no double-wrapping
    // 👇 listByConversation must return { messages, nextCursor }
    queryFn: () =>
      messageApi.listByConversation(conversationId) as Promise<MessagePage>,
    staleTime: STALE_TIME,
    enabled: !!conversationId,
  });
