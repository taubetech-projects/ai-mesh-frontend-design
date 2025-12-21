import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/features/chat/text-chat/api/messageApi";
import { toast } from "sonner";
import { queryKey } from "@/lib/react-query/keys";
import { MessageView, MessagePage } from "@/features/chat/types/models";

import { STALE_TIME } from "@/shared/constants/constants";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

function remove(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: number,
  predicate: (m: MessageView) => boolean
) {
  queryClient.setQueryData<MessagePage>(cacheKey(conversationId), (oldPage) => {
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
export const useGetMessagesByConversationId = (conversationId: number) =>
  useQuery({
    queryKey: cacheKey(conversationId), // ✅ no double-wrapping
    // 👇 listByConversation must return { messages, nextCursor }
    queryFn: () =>
      messageApi.listByConversation(conversationId) as Promise<MessagePage>,
    staleTime: STALE_TIME,
    enabled: !!conversationId,
  });

export const useDeleteForAllModels = (conversationId: number) => {
  const queryClient = useQueryClient();
  console.log("Delete for all conversation", conversationId);

  return useMutation({
    mutationFn: (id: number) =>
      messageApi.removeForAllModel(id, conversationId),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      );

      remove(queryClient, conversationId, (m) => m.id === id);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      console.log("Delete all models error", _err, _id, ctx);
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully.");
    },
  });
};

export const useDeleteForSingleModel = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, model }: { messageId: number; model: string }) =>
      messageApi.removeForSingleModel(messageId, conversationId, model),

    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      );
      remove(queryClient, conversationId, (m) => m.id === messageId);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully for this model.");
    },
  });
};
