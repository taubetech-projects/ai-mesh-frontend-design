import { authenticatedApi } from "@/lib/api/axiosApi";
import { CreateConversationDto } from "@/features/conversation/types/CreateConversationDto";
import { API_PATHS, HTTP_METHODS } from "@/shared/constants/constants";

// Error handler function to standardize error messages
export const handleApiError = (error: any): never => {
  if (error.message === "Network Error") {
    throw new Error("Network Error. Please try again later.");
  } else if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else if (error.response) {
    throw new Error("A server error occurred.");
  } else {
    throw new Error(error.message || "An unknown error occurred.");
  }
};

// General function to handle API requests
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
    const response = await authenticatedApi[method](url, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// CRUD functions for the post feed
export const createConversationApi = (conversation: CreateConversationDto) =>
  apiCall<any>(
    HTTP_METHODS.POST,
    API_PATHS.CONVERSATIONS.BASE,
    new CreateConversationDto(conversation.title, conversation.convoType)
  );

export const getConversationsApi = () =>
  apiCall<any>(HTTP_METHODS.GET, API_PATHS.CONVERSATIONS.BASE);

export const getConversationByConvoTypeApi = (convoType: string) =>
  apiCall<any>(HTTP_METHODS.GET, API_PATHS.CONVERSATIONS.BY_TYPE(convoType));

export const updateConversationApi = (id: string, conversation: object) =>
  apiCall<any>(
    HTTP_METHODS.PUT,
    API_PATHS.CONVERSATIONS.BY_ID(id),
    conversation
  );

export const deleteConversationApi = (id: string) =>
  apiCall<any>(HTTP_METHODS.DELETE, API_PATHS.CONVERSATIONS.BY_ID(id));
