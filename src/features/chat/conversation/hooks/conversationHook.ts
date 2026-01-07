import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversationApi,
  getConversationsApi,
  updateConversationApi,
  deleteConversationApi,
  getConversationByConvoTypeApi,
  getConversationByIdApi,
} from "@/features/chat/conversation/api/conversationApi";
import { queryKey } from "@/lib/react-query/keys";
import { CONVERSATION_TYPES, STALE_TIME } from "@/shared/constants/constants";

// Custom hooks for CRUD operations
export const useCreateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: () => {
      console.log("Conversation created successfully");
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }); // Refetch conversations after a new conversation is created
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() });
    },
    onError: (error: unknown) => {
      console.error("Error creating conversation:", error);
    },
  });
};

export const useGetConversationsApi = () =>
  useQuery({
    queryKey: queryKey.conversations(),
    queryFn: getConversationsApi,
    staleTime: STALE_TIME,
  });

export const useGetConversationById = (id: string) =>
  useQuery({
    queryKey: [...queryKey.conversations(), id],
    queryFn: () => getConversationByIdApi(id),
  });

export const useGetConversationsForChat = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "chat"],
    queryFn: () => getConversationByConvoTypeApi(CONVERSATION_TYPES.CHAT),
    staleTime: STALE_TIME,
  });
};

export const useGetConversationsForImage = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "image"],
    queryFn: () => getConversationByConvoTypeApi(CONVERSATION_TYPES.IMAGE),
    staleTime: STALE_TIME,
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
