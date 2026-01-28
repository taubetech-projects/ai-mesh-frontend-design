import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

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
import { handleApiError } from "../api/messageApi";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

const cacheKey = (userId: string | null, conversationId: number | null) =>
  queryKey.messages(userId, conversationId ?? 0);

export const useCreateMessages = (conversationId: number | null) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  const cacheOps = createMessageCacheOps(queryClient, userId, conversationId);

  return useMutation({
    mutationFn: async (chatRequestBody: ChatRequestBody) => {
      // ✅ Prevent in-flight overwrite of optimistic cache
      await queryClient.cancelQueries({
        queryKey: cacheKey(userId, conversationId),
      });

      const { includeConsensus } = validateChatRequest(
        conversationId,
        chatRequestBody,
      );

      cacheOps.pushMessage(
        createOptimisticUserMessage({ conversationId, chatRequestBody }),
      );

      const modelIds = getModelIds(includeConsensus, chatRequestBody);
      const tempsByModel = createAssistantPlaceholderTemps({
        conversationId,
        modelIds,
        pushMessage: cacheOps.pushMessage,
      });

      const expectedStreams = getExpectedStreams(
        includeConsensus,
        chatRequestBody,
      );

      const onEvent = createStreamEventHandler({
        dispatch,
        expectedStreams,
        tempsByModel,
        updateMessageTextById: cacheOps.updateMessageTextById,
        invalidateConversation: (cid) => {
          console.log("Invalidating conversation:", cid);
          if (cid !== null) cacheOps.invalidateConversation(cid);
        },
        router,
      });

      await cacheOps.streamChat(conversationId, null, chatRequestBody, onEvent);

      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(userId, conversationId) });
    },
    onSettled: () => {
      // ✅ Fallback: ensure UI always re-syncs with backend even if event is missed
      queryClient.invalidateQueries({ queryKey: cacheKey(userId, conversationId) });
      dispatch(endStreaming());
    },
    onError: (error: unknown) => {
      dispatch(endStreaming());
      handleApiError(error);
    },
  });
};
