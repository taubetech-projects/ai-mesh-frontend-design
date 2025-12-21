import type { TempInfo } from "./optimisticMessages";
import {
  CHAT_MODES,
  CHAT_STREAM_EVENT_TYPES,
  EMPTY_STRING,
} from "@/shared/constants/constants"; // adjust

import {
  startStreaming,
  endStreaming,
  concatenateDelta,
} from "@/features/chat/store/chat-interface-slice"; // adjust

export const createStreamEventHandler = (args: {
  dispatch: any;
  expectedStreams: number;
  tempsByModel: Map<string, TempInfo>;
  updateMessageTextById: (id: number, nextText: string) => void;
  invalidateConversation: (conversationId: number) => void;
}) => {
  const {
    dispatch,
    expectedStreams,
    tempsByModel,
    updateMessageTextById,
    invalidateConversation,
  } = args;

  const finalByModel = new Map<string, string>();
  let completedCount = 0;

  const appendChunk = (modelId: string, chunk: string) => {
    if (!chunk) return;

    dispatch(concatenateDelta(modelId, chunk));

    const prev = finalByModel.get(modelId) ?? "";
    const next = prev + chunk;
    finalByModel.set(modelId, next);

    const temp = tempsByModel.get(modelId);
    if (temp) {
      updateMessageTextById(temp.id, next);
      temp.text = next;
    }
  };

  dispatch(startStreaming());

  return (event: any) => {
    const name = event.event;
    const data = event.data || {};

    if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_CREATED) return;

    if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_DELTA) {
      const modelId: string = data.model || "unknown";
      const chunk: string = data.delta?.text || "";
      appendChunk(modelId, chunk);
      return;
    }

    if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_COMPLETED) {
      completedCount += 1;
      if (completedCount >= expectedStreams) dispatch(endStreaming());
      return;
    }

    if (data.type === CHAT_STREAM_EVENT_TYPES.CONVERSATION_SAVE_SUCCESS) {
      invalidateConversation(data.payload.conversationId);
      return;
    }

    // Your original: consensus is last and ends immediately
    if (name === CHAT_STREAM_EVENT_TYPES.CONSENSUS) {
      const modelId = CHAT_MODES.CONSENSUS;
      const chunk: string = data?.delta?.text || EMPTY_STRING;
      appendChunk(modelId, chunk);
      dispatch(endStreaming());
      return;
    }
  };
};
