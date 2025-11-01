import { authenticatedApi } from "./axiosApi";

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
  method: "get" | "post" | "put" | "delete",
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
export const createConversationApi = (conversation: any) =>
  apiCall<any>("post", "/v1/conversations", conversation);

export const getConversationsApi = () =>
  apiCall<any>("get", "/v1/conversations");

export const updateConversationApi = (id: string, conversation: any) =>
  apiCall<any>("put", `/v1/conversations/${id}`, conversation);

export const deleteConversationApi = (id: string) =>
  apiCall<any>("delete", `/v1/conversations/${id}`);
