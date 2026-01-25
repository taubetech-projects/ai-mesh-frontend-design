import { chatProxyApi } from "@/lib/api/axiosApi";
import { CHAT_API_PATHS, HTTP_METHODS } from "@/shared/constants/constants";
import { CreateConversationDto } from "@/features/chat/conversation/types/conversationTypes";
import { ConversationResponse } from "../types/conversationTypes";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const handleApiError = (error: any): never => {
  if (error.message === "Network Error") {
    throw new ApiError("Network Error. Please try again later.");
  } else if (error.response?.data?.error) {
    throw new ApiError(error.response.data.error, error.response.status);
  } else if (error.response) {
    throw new ApiError("A server error occurred.", error.response.status);
  } else {
    throw new ApiError(error.message || "An unknown error occurred.");
  }
};

export const apiCall = async <T>(
  method:
    | HTTP_METHODS.GET
    | HTTP_METHODS.POST
    | HTTP_METHODS.PUT
    | HTTP_METHODS.DELETE,
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response =
      method === HTTP_METHODS.GET || method === HTTP_METHODS.DELETE
        ? await chatProxyApi.request<T>({ method, url })
        : await chatProxyApi.request<T>({ method, url, data });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createConversationApi = (conversation: CreateConversationDto) =>
  apiCall<any>(
    HTTP_METHODS.POST,
    CHAT_API_PATHS.CONVERSATIONS.BASE,
    new CreateConversationDto(conversation.title, conversation.convoType)
  );

export const getConversationsApi = () =>
  apiCall<any>(HTTP_METHODS.GET, CHAT_API_PATHS.CONVERSATIONS.BASE);

export const getConversationByIdApi = (
  id: string
): Promise<ConversationResponse> =>
  apiCall<ConversationResponse>(
    HTTP_METHODS.GET,
    CHAT_API_PATHS.CONVERSATIONS.BY_ID(id)
  );

export const getConversationByConvoTypeApi = (convoType: string) =>
  apiCall<any>(
    HTTP_METHODS.GET,
    CHAT_API_PATHS.CONVERSATIONS.BY_TYPE(convoType)
  );

export const updateConversationApi = (id: string, conversation: object) =>
  apiCall<any>(
    HTTP_METHODS.PUT,
    CHAT_API_PATHS.CONVERSATIONS.BY_ID(id),
    conversation
  );

export const deleteConversationApi = (id: string) =>
  apiCall<any>(HTTP_METHODS.DELETE, CHAT_API_PATHS.CONVERSATIONS.BY_ID(id));
