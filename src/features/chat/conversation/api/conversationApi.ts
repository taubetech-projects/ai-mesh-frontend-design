import { chatProxyApi } from "@/lib/api/axiosApi";
import { CHAT_API_PATHS } from "@/shared/constants/constants";
import { ConvCreateRequest, ConvUpdateRequest } from "@/features/chat/conversation/types/conversationTypes";
import { ConversationResponse } from "../types/conversationTypes";

export const ConversationService = {
  createConversation: (conversation: ConvCreateRequest) =>
    chatProxyApi.post<ConversationResponse>(CHAT_API_PATHS.CONVERSATIONS.BASE, conversation).then(r => r.data), 
  
  getConversations: () =>
    chatProxyApi.get<ConversationResponse[]>(CHAT_API_PATHS.CONVERSATIONS.BASE).then(r => r.data),
  
  getConversationById: (id: string) =>
    chatProxyApi.get<ConversationResponse>(CHAT_API_PATHS.CONVERSATIONS.BY_ID(id)).then(r => r.data),
  
  getConversationByConvoType: (convoType: string) =>
    chatProxyApi.get<ConversationResponse[]>(CHAT_API_PATHS.CONVERSATIONS.BY_TYPE(convoType)).then(r => r.data),
  
  updateConversation: (id: string, conversation: ConvUpdateRequest) =>
    chatProxyApi.put<ConversationResponse>(CHAT_API_PATHS.CONVERSATIONS.BY_ID(id), conversation).then(r => r.data),
  
  deleteConversation: (id: string) =>
    chatProxyApi.delete<ConversationResponse>(CHAT_API_PATHS.CONVERSATIONS.BY_ID(id)).then(r => r.data),
};
