import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { createMessageCacheOps } from "@/features/chat/text-chat/utils/chatCacheOps";
import {
  validateChatRequest,
  getExpectedStreams,
  getModelIds,
} from "@/features/chat/text-chat/utils/validation";
import {
  createOptimisticUserMessage,
  createAssistantPlaceholderTemps,
} from "@/features/chat/text-chat/utils/optimisticMessages";
import { createStreamEventHandler } from "@/features/chat/text-chat/utils/streamHandlers";

import type { ChatRequestBody } from "@/features/chat/types/models"; // adjust
import { queryKey } from "@/lib/react-query/keys";
import { useRouter } from "next/navigation";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

const cacheKey = (userId: string | null, conversationId: number) => queryKey.messages(userId, conversationId);

export const useUpdateMessages = (conversationId: number) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  const cacheOps = createMessageCacheOps(queryClient, userId, conversationId);

  return useMutation({
    mutationFn: async ({
      messageId,
      chatRequestBody,
    }: {
      messageId: number | null;
      chatRequestBody: ChatRequestBody;
    }) => {
      // ✅ Prevent in-flight fetch from overwriting optimistic cache
      await queryClient.cancelQueries({
        queryKey: cacheKey(userId, conversationId),
      });

      const { includeConsensus } = validateChatRequest(
        conversationId,
        chatRequestBody
      );

      // 1) Optimistic user message
      cacheOps.pushMessage(
        createOptimisticUserMessage({ conversationId, chatRequestBody })
      );

      // 2) Optimistic assistant placeholders
      const modelIds = getModelIds(includeConsensus, chatRequestBody);
      const tempsByModel = createAssistantPlaceholderTemps({
        conversationId,
        modelIds,
        pushMessage: cacheOps.pushMessage,
      });

      // 3) Stream
      const expectedStreams = getExpectedStreams(
        includeConsensus,
        chatRequestBody
      );

      const onEvent = createStreamEventHandler({
        dispatch,
        expectedStreams,
        tempsByModel,
        updateMessageTextById: cacheOps.updateMessageTextById,
        invalidateConversation: () =>
          cacheOps.invalidateConversation(conversationId),
        router,
      });

      await cacheOps.streamChat(
        conversationId,
        messageId,
        chatRequestBody,
        onEvent
      );

      return null;
    },

    onSettled: () => {
      // ✅ Fallback: re-sync with backend if invalidate event is missed
      queryClient.invalidateQueries({
        queryKey: cacheKey(userId, conversationId),
      });
      // ❌ DO NOT endStreaming here
    },
  });
};
