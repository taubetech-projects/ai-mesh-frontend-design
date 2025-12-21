import type { ChatRequestBody } from "@/features/chat/types/models"; // adjust
import { CHAT_MODES } from "@/shared/constants/constants"; // adjust

export const validateChatRequest = (
  conversationId: number,
  body: ChatRequestBody
) => {
  if (!conversationId) throw new Error("Missing conversationId");
  if (!body?.messages?.length)
    throw new Error("Missing chatRequestBody.messages");

  const includeConsensus = body.mode === CHAT_MODES.CONSENSUS;

  if (!body.routes?.length) {
    throw new Error("Missing routes");
  }

  return { includeConsensus };
};

export const getModelIds = (
  includeConsensus: boolean,
  body: ChatRequestBody
) => {
  const models = body.routes!.map((r) => r.model);
  return includeConsensus ? [...models, CHAT_MODES.CONSENSUS] : models;
};

export const getExpectedStreams = (
  includeConsensus: boolean,
  body: ChatRequestBody
) => (body.routes?.length ?? 0) + (includeConsensus ? 1 : 0);
