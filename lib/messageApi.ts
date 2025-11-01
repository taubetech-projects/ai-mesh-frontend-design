import { SaveMessageRequest, MessageView, MessagePage } from "@/types/models";
import { authenticatedApi } from "./axiosApi";
import type { AxiosError, AxiosRequestConfig } from "axios";

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
  method: "get" | "post" | "put" | "delete",
  url: string,
  // For GET/DELETE, pass config in `config`; for POST/PUT, pass body in `data`
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    if (method === "get" || method === "delete") {
      const res = await authenticatedApi[method](url, config);
      return res.data as T;
    }
    const res = await authenticatedApi[method](url, data, config);
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
      "post",
      `/v1/conversations/${conversationId}/messages`,
      body
    ),

  createBatch: (conversationId: number, body: SaveMessageRequest[]) =>
    apiCall<MessageView[]>(
      "post",
      `/v1/conversations/${conversationId}/messages`,
      body
    ),

  listByConversation: (conversationId: number) =>
    apiCall<MessagePage>("get", `/v1/conversations/${conversationId}/messages`),

  update: (id: number, conversationId: number, body: SaveMessageRequest) =>
    apiCall<MessageView>(
      "put",
      `/v1/conversations/${conversationId}/messages/${id}`,
      body
    ),

  updateBatch: (
    conversationId: number,
    messageId: number,
    bodies: SaveMessageRequest[]
  ) =>
    apiCall<MessageView[]>(
      "post",
      `/v1/conversations/${conversationId}/messages/${messageId}`,
      bodies
    ),

  remove: (id: number, conversationId: number) =>
    apiCall<void>(
      "delete",
      `/v1/conversations/${conversationId}/messages/${id}`
    ),
};
