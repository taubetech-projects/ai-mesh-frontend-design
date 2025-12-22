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
import { endStreaming } from "@/features/chat/store/chat-interface-slice";

const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

export const useCreateMessages = (conversationId: number) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const cacheOps = createMessageCacheOps(queryClient, conversationId);

  return useMutation({
    mutationFn: async (chatRequestBody: ChatRequestBody) => {
      // ✅ Prevent in-flight overwrite of optimistic cache
      await queryClient.cancelQueries({
        queryKey: cacheKey(conversationId),
      });

      const { includeConsensus } = validateChatRequest(
        conversationId,
        chatRequestBody
      );

      cacheOps.pushMessage(
        createOptimisticUserMessage({ conversationId, chatRequestBody })
      );

      const modelIds = getModelIds(includeConsensus, chatRequestBody);
      const tempsByModel = createAssistantPlaceholderTemps({
        conversationId,
        modelIds,
        pushMessage: cacheOps.pushMessage,
      });

      const expectedStreams = getExpectedStreams(
        includeConsensus,
        chatRequestBody
      );

      const onEvent = createStreamEventHandler({
        dispatch,
        expectedStreams,
        tempsByModel,
        updateMessageTextById: cacheOps.updateMessageTextById,
        invalidateConversation: cacheOps.invalidateConversation,
      });

      await cacheOps.streamChat(conversationId, null, chatRequestBody, onEvent);

      return null;
    },

    onSettled: () => {
      // ✅ Fallback: ensure UI always re-syncs with backend even if event is missed
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
      dispatch(endStreaming());
    },
  });
};
