import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversationApi,
  getConversationsApi,
  updateConversationApi,
  deleteConversationApi,
} from "@/lib/conversationAxiosApi";

// Custom hooks for CRUD operations
export const useCreateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["conversations"] }), // Refetch conversations after a new conversation is created
  });
};

export const useGetConversationsApi = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsApi,
  });

export const useUpdateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateConversationApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["conversations"] }), // Refetch conversations after an update
  });
};

export const useDeleteConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversationApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["conversations"] }), // Refetch conversations after deletion
  });
};
