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

export const useUpdateMessages = (conversationId: number) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const cacheOps = createMessageCacheOps(queryClient, conversationId);

  return useMutation({
    mutationFn: async ({
      messageId,
      chatRequestBody,
    }: {
      messageId: number | null;
      chatRequestBody: ChatRequestBody;
    }) => {
      const { isConsensus } = validateChatRequest(
        conversationId,
        chatRequestBody
      );

      // 1) Optimistic user message
      cacheOps.pushMessage(
        createOptimisticUserMessage({ conversationId, chatRequestBody })
      );

      // 2) Optimistic assistant placeholders (and map for streaming updates)
      const modelIds = getModelIds(isConsensus, chatRequestBody);
      const tempsByModel = createAssistantPlaceholderTemps({
        conversationId,
        modelIds,
        pushMessage: cacheOps.pushMessage,
      });

      // 3) Stream
      const expectedStreams = getExpectedStreams(isConsensus, chatRequestBody);
      const onEvent = createStreamEventHandler({
        dispatch,
        expectedStreams,
        tempsByModel,
        updateMessageTextById: cacheOps.updateMessageTextById,
        invalidateConversation: cacheOps.invalidateConversation,
      });

      await cacheOps.streamChat(
        conversationId,
        messageId,
        chatRequestBody, // This was the issue, it was expecting a different type
        onEvent
      );

      return null;
    },
  });
};
