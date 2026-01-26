import {
  SaveMessageRequest,
  MessageView,
  MessagePage,
} from "@/features/chat/types/models";
import { chatProxyApi } from "@/lib/api/axiosApi";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { CHAT_API_PATHS, HTTP_METHODS } from "@/shared/constants/constants";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";

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
      const res = await chatProxyApi[method](url, config);
      return res.data as T;
    }
    const res = await chatProxyApi[method](url, data, config);
    return res.data as T;
  } catch (error) {
    throw handleApiErrorToast(error);
  }
}

/* ---------------------------
 * Message API surface
 * -------------------------- */
export const messageApi = {
  create: (conversationId: number, body: SaveMessageRequest) =>
    chatProxyApi.post<MessageView>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId),
      body
    ).then(r => r.data),  

  createBatch: (conversationId: number, body: SaveMessageRequest[]) =>
    chatProxyApi.post<MessageView[]>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId),
      body
    ).then(r => r.data),

  listByConversation: (conversationId: number) =>
    chatProxyApi.get<MessagePage>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BASE(conversationId)
    ).then(r => r.data),

  update: (id: number, conversationId: number, body: SaveMessageRequest) =>
    chatProxyApi.put<MessageView>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id),
      body
    ).then(r => r.data),

  updateBatch: (
    conversationId: number,
    messageId: number,
    bodies: SaveMessageRequest[]
  ) =>
    chatProxyApi.post<MessageView[]>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, messageId),
      bodies
    ).then(r => r.data),

  removeForAllModel: (id: number, conversationId: number) =>
    chatProxyApi.delete<void>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id) + "/all"
    ).then(r => r.data),

  removeForSingleModel: (id: number, conversationId: number, model: string) =>
    chatProxyApi.delete<void>(
      CHAT_API_PATHS.CONVERSATIONS.MESSAGES.BY_ID(conversationId, id) +
        `?modelName=${model}`
    ).then(r => r.data),
};
