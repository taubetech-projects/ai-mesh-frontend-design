import { queryKey } from "@/lib/react-query/keys";
import { useQuery } from "@tanstack/react-query";
import { messageApi } from "../api/messageApi";
import { STALE_TIME } from "@/shared/constants/constants";
import { MessagePage } from "../../types/models";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (userId: string | null, conversationId: number) => queryKey.messages(userId, conversationId);

/* ---------------------------
 * Queries
 * -------------------------- */
export const useGetMessagesByConversationId = (conversationId: number) => {
  const { me } = useChatAuth();
  return useQuery({
    queryKey: cacheKey(me?.id ?? null, conversationId), // ✅ no double-wrapping
    // 👇 listByConversation must return { messages, nextCursor }
    queryFn: () =>
      messageApi.listByConversation(conversationId) as Promise<MessagePage>,
    staleTime: STALE_TIME,
    enabled: !!conversationId,
  });
};
