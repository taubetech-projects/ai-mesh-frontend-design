import {
  SaveMessageRequest,
  MessageView,
  MessagePage,
} from "@/features/chat/types/models";
import { proxyApi } from "@/lib/api/axiosApi";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { CHAT_API_PATHS, HTTP_METHODS } from "@/shared/constants/constants";

/* ---------------------------
 * Error handling
 * -------------------------- */
const isAxiosError = (err: unknown): err is AxiosError =>
  typeof err === "object" && err !== null && "isAxiosError" in err;

export function handleApiError(error: unknown): never {
  if (isAxiosError(error)) {
    if (error.message === "Network Error") {
      throw new Error("Network Error. Please try again later.");
    }
    const serverMsg =
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message;
    if (serverMsg) throw new Error(String(serverMsg));
    if (error.response) throw new Error("A server error occurred.");
  }
  throw new Error((error as any)?.message || "An unknown error occurred.");
}

/* ---------------------------
 * Generic API call
 * - Supports config for GET/DELETE
 * -------------------------- */
export async function apiCall<T>(
  method:
    | HTTP_METHODS.GET
    | HTTP_METHODS.POST
    | HTTP_METHODS.PUT
    | HTTP_METHODS.DELETE,
  url: string,
  // For GET/DELETE, pass config in `config`; for POST/PUT, pass body in `data`
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    if (method === HTTP_METHODS.GET || method === HTTP_METHODS.DELETE) {
      const res = await proxyApi[method](url, config);
      return res.data as T;
    }
    const res = await proxyApi[method](url, data, config);
    return res.data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

/* ---------------------------
 * Message API surface
 * -------------------------- */
export const messageApi = {
  create: (conversationId: number, body: SaveMessageRequest) =>
    apiCall<MessageView>(
      HTTP_METHODS.POST,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId),
      body
    ),

  createBatch: (conversationId: number, body: SaveMessageRequest[]) =>
    apiCall<MessageView[]>(
      HTTP_METHODS.POST,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId),
      body
    ),

  listByConversation: (conversationId: number) =>
    apiCall<MessagePage>(
      HTTP_METHODS.GET,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId)
    ),

  update: (id: number, conversationId: number, body: SaveMessageRequest) =>
    apiCall<MessageView>(
      HTTP_METHODS.PUT,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id),
      body
    ),

  updateBatch: (
    conversationId: number,
    messageId: number,
    bodies: SaveMessageRequest[]
  ) =>
    apiCall<MessageView[]>(
      HTTP_METHODS.POST,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, messageId),
      bodies
    ),

  removeForAllModel: (id: number, conversationId: number) =>
    apiCall<void>(
      HTTP_METHODS.DELETE,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id) + "/all"
    ),

  removeForSingleModel: (id: number, conversationId: number, model: string) =>
    apiCall<void>(
      HTTP_METHODS.DELETE,
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id) +
        `?modelName=${model}`
    ),
};
