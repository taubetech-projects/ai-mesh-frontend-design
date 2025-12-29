import type {
  ChatRequestBody,
  MessagePartRequest,
  MessageView,
} from "@/features/chat/types/models"; // adjust
import {
  CONTENT_INPUT_TYPES,
  MESSAGE_PART_TYPES,
  MIME_TYPES,
  ROLES,
  EMPTY_STRING,
} from "@/shared/constants/constants"; // adjust

export type TempInfo = {
  id: number | undefined;
  modelId: string;
  text: string;
};

const createTempId = (prefix: "-1" | "-2") =>
  Number(`${prefix}${Math.floor(Math.random() * 1e9)}`);

export const buildMessageParts = (content: any[]): MessagePartRequest[] => {
  const parts: MessagePartRequest[] = [];

  for (const item of content ?? []) {
    if (item.type === CONTENT_INPUT_TYPES.INPUT_TEXT) {
      parts.push({ type: MESSAGE_PART_TYPES.TEXT, text: item.text });
    } else if (item.type === CONTENT_INPUT_TYPES.INPUT_IMAGE) {
      parts.push({ type: MESSAGE_PART_TYPES.IMAGE, mimeType: MIME_TYPES.JPEG });
    } else if (item.type === CONTENT_INPUT_TYPES.INPUT_FILE) {
      parts.push({ type: MESSAGE_PART_TYPES.FILE, mimeType: MIME_TYPES.PDF });
    } else {
      throw new Error("Invalid Input Type");
    }
  }

  return parts;
};

export const createOptimisticUserMessage = (args: {
  conversationId: number | null;
  chatRequestBody: ChatRequestBody;
}): MessageView => {
  const { conversationId, chatRequestBody } = args;

  return {
    id: createTempId("-1"),
    conversationId,
    role: ROLES.USER,
    authorId: "user-123",
    parts: buildMessageParts(chatRequestBody.messages[0]?.content ?? []),
  } as any;
};

export const createAssistantPlaceholder = (args: {
  conversationId: number | null;
  modelId: string;
}): MessageView => {
  const { conversationId, modelId } = args;

  return {
    id: createTempId("-2"),
    conversationId,
    role: ROLES.ASSISTANT,
    authorId: modelId,
    model: modelId,
    parts: [{ type: MESSAGE_PART_TYPES.TEXT, text: EMPTY_STRING }],
    createdAt: new Date(),
  } as any;
};

export const createAssistantPlaceholderTemps = (args: {
  conversationId: number | null;
  modelIds: string[];
  pushMessage: (msg: MessageView) => void;
}): Map<string, TempInfo> => {
  const { conversationId, modelIds, pushMessage } = args;

  const tempsByModel = new Map<string, TempInfo>();

  for (const modelId of modelIds) {
    const placeholder = createAssistantPlaceholder({ conversationId, modelId });
    pushMessage(placeholder);
    tempsByModel.set(modelId, { id: placeholder.id, modelId, text: "" });
  }

  return tempsByModel;
};
