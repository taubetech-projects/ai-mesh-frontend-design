import type { ChatRequestBody } from "@/features/chat/types/models"; // adjust
import { CHAT_MODES } from "@/shared/constants/constants"; // adjust

export const validateChatRequest = (
  conversationId: number,
  body: ChatRequestBody
) => {
  if (!conversationId) throw new Error("Missing conversationId");
  if (!body) throw new Error("Missing chatRequestBody");
  if (!body.messages?.length)
    throw new Error("Missing chatRequestBody.messages.length");

  const isConsensus = body.mode === CHAT_MODES.CONSENSUS;

  if (!isConsensus && !body.routes?.length) {
    throw new Error("Missing chatRequestBody.routes for multi-model run");
  }

  return { isConsensus };
};

export const getExpectedStreams = (
  isConsensus: boolean,
  body: ChatRequestBody
) => (isConsensus ? 1 : body.routes!.length);

export const getModelIds = (isConsensus: boolean, body: ChatRequestBody) =>
  isConsensus ? [CHAT_MODES.CONSENSUS] : body.routes!.map((r) => r.model);
