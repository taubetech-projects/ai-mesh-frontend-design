import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversationApi,
  getConversationsApi,
  updateConversationApi,
  deleteConversationApi,
  getConversationByConvoTypeApi,
} from "@/features/conversation/api/conversationApi";
import { queryKey } from "../../../lib/react-query/keys";
import { CONVERSATION_TYPES } from "@/shared/constants/constants";

// Custom hooks for CRUD operations
export const useCreateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }), // Refetch conversations after a new conversation is created
  });
};

export const useGetConversationsApi = () =>
  useQuery({
    queryKey: queryKey.conversations(),
    queryFn: getConversationsApi,
    staleTime: 300_000, // 👈 1 minute
  });

export const useGetConversationsForChat = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "chat"],
    queryFn: () => getConversationByConvoTypeApi(CONVERSATION_TYPES.CHAT),
    staleTime: 300_000, // 👈 1 minute
  });
};

export const useGetConversationsForImage = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "image"],
    queryFn: () => getConversationByConvoTypeApi(CONVERSATION_TYPES.IMAGE),
    staleTime: 300_000, // 👈 1 minute
  });
};

export const useUpdateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, conversation }: { id: string; conversation: object }) =>
      updateConversationApi(id, conversation),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }), // Refetch conversations after an update
  });
};

export const useDeleteConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteConversationApi(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }), // Refetch conversations after deletion
  });
};
