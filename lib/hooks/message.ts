import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMessageApi,
  getMessagesByConversationIdApi,
  updateMessageApi,
  deleteMessageApi,
} from "@/lib/messageAxiosApi";
import { get } from "http";

// Custom hooks for CRUD operations
export const useCreateMessageApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessageApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }), // Refetch messages after a new message is created
  });
};

export const useGetMessagesByConversationIdApi = () =>
  useQuery({
    queryKey: ["messages"],
    queryFn: getMessagesByConversationIdApi,
  });

export const useUpdateMessageApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMessageApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }), // Refetch messages after an update
  });
};

export const useDeleteMessageApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMessageApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }), // Refetch messages after deletion
  });
};
