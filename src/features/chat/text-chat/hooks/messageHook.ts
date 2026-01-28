import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/features/chat/text-chat/api/messageApi";
import { toast } from "sonner";
import { queryKey } from "@/lib/react-query/keys";
import { MessageView, MessagePage } from "@/features/chat/types/models";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

import { STALE_TIME } from "@/shared/constants/constants";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (userId: string | null, conversationId: number) => queryKey.messages(userId, conversationId);

function remove(
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string | null,
  conversationId: number,
  predicate: (m: MessageView) => boolean
) {
  queryClient.setQueryData<MessagePage>(cacheKey(userId, conversationId), (oldPage) => {
    if (!oldPage) return { messages: [], nextCursor: null };
    const newMessages = (oldPage.messages || []).filter((m) => !predicate(m));
    return {
      ...oldPage,
      messages: newMessages,
    };
  });
}

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

export const useDeleteForAllModels = (conversationId: number) => {
  const queryClient = useQueryClient();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;
  console.log("Delete for all conversation", conversationId);

  return useMutation({
    mutationFn: (id: number) =>
      messageApi.removeForAllModel(id, conversationId),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(userId, conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(userId, conversationId)
      );

      remove(queryClient, userId, conversationId, (m) => m.id === id);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      console.log("Delete all models error", _err, _id, ctx);
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(userId, conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(userId, conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully.");
    },
  });
};

export const useDeleteForSingleModel = (conversationId: number) => {
  const queryClient = useQueryClient();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  return useMutation({
    mutationFn: ({ messageId, model }: { messageId: number; model: string }) =>
      messageApi.removeForSingleModel(messageId, conversationId, model),

    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(userId, conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(userId, conversationId)
      );
      remove(queryClient, userId, conversationId, (m) => m.id === messageId);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(userId, conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(userId, conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully for this model.");
    },
  });
};
