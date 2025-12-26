import { queryKey } from "@/lib/react-query/keys";
import { useQuery } from "@tanstack/react-query";
import { messageApi } from "../api/messageApi";
import { STALE_TIME } from "@/shared/constants/constants";
import { MessagePage } from "../../types/models";

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
