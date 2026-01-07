import type { TempInfo } from "./optimisticMessages";
import {
  CHAT_MODES,
  CHAT_STREAM_EVENT_TYPES,
} from "@/shared/constants/constants"; // adjust

import {
  startStreaming,
  endStreaming,
  concatenateDelta,
  setSelectedModels,
} from "@/features/chat/store/chat-interface-slice"; // adjust

import { setSelectedConvId } from "@/features/chat/conversation/store/conversation-slice";

export const createStreamEventHandler = ({
  dispatch,
  expectedStreams,
  tempsByModel,
  updateMessageTextById,
  invalidateConversation,
  router,
}: {
  dispatch: any;
  expectedStreams: number;
  tempsByModel: Map<string, TempInfo>;
  updateMessageTextById: (id: number, text: string) => void;
  invalidateConversation: (conversationId: number | null) => void;
  router: any;
}) => {
  const finalByModel = new Map<string, string>();
  let completedCount = 0;

  const append = (modelId: string, chunk: string) => {
    if (!chunk) return;

    dispatch(concatenateDelta(modelId, chunk));

    const next = (finalByModel.get(modelId) ?? "") + chunk;
    finalByModel.set(modelId, next);

    const temp = tempsByModel.get(modelId);
    if (temp) {
      updateMessageTextById(temp?.id ?? 0, next);
      temp.text = next;
    }
  };

  dispatch(startStreaming());

  return (event: any) => {
    const name = event.event;
    const data = event.data || {};

    // ─────────────────────────────────────────────
    // Normal model delta
    if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_DELTA) {
      append(data.model, data.delta?.text ?? "");
      return;
    }

    // Normal model completion
    if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_COMPLETED) {
      completedCount += 1;
      if (completedCount >= expectedStreams) {
        dispatch(endStreaming());
      }
      return;
    }

    // ─────────────────────────────────────────────
    // ✅ CONSENSUS TAIL EVENT (backend emits ONLY this)
    if (name === "consensus") {
      const modelId = CHAT_MODES.CONSENSUS;

      // winner StreamEvent → extract text
      const text =
        data?.delta?.text ?? data?.payload?.delta?.text ?? data?.text ?? "";

      append(modelId, text);

      // ✅ mark consensus as completed
      completedCount += 1;
      if (completedCount >= expectedStreams) {
        dispatch(endStreaming());
      }
      return;
    }
    // if (name == CHAT_STREAM_EVENT_TYPES.CONVERSATION_CREATED_SUCCESS) {
    //   dispatch(setSelectedConvId(data.payload.conversationId));
    //   invalidateConversation(data.payload.conversationId);
    //   router.push(`/chat/${data.payload.conversationId}`);
    //   return;
    // }

    // ─────────────────────────────────────────────
    // Backend persistence confirmation
    if (
      name === CHAT_STREAM_EVENT_TYPES.CONVERSATION_SAVE_SUCCESS ||
      data?.type === CHAT_STREAM_EVENT_TYPES.CONVERSATION_SAVE_SUCCESS
    ) {
      dispatch(setSelectedConvId(data.payload.conversationId));
      invalidateConversation(data.payload.conversationId);
      router.push(`/chat/${data.payload.conversationId}`);
      // invalidateConversation(data.payload.conversationId);
      return;
    }
  };
};
