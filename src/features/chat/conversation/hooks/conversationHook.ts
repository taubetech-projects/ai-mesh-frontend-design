import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKey } from "@/lib/react-query/keys";
import { CONVERSATION_TYPES, STALE_TIME } from "@/shared/constants/constants";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";
import { ConversationService } from "../api/conversationApi";

// Custom hooks for CRUD operations
export const useCreateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ConversationService.createConversation,
    onSuccess: () => {
      console.log("Conversation created successfully");
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }); // Refetch conversations after a new conversation is created
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() });
    },
    onError: (error: unknown) => {
      handleApiErrorToast(error);
    },
  });
};

export const useGetConversationsApi = () =>
  useQuery({
    queryKey: queryKey.conversations(),
    queryFn: ConversationService.getConversations,
    staleTime: STALE_TIME,
  });

export const useGetConversationById = (id: string) =>
  useQuery({
    queryKey: [...queryKey.conversations(), id],
    queryFn: () => ConversationService.getConversationById(id),
    enabled: !!id,   // ✅ don't run without id
    retry: false,                // ✅ stops 1+3 retries = 4 calls
    refetchOnWindowFocus: false,
  });

export const useGetConversationsForChat = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "chat"],
    queryFn: () => ConversationService.getConversationByConvoType(CONVERSATION_TYPES.CHAT),
    staleTime: STALE_TIME,
  });
};

export const useGetConversationsForImage = () => {
  return useQuery({
    queryKey: [...queryKey.conversations(), "image"],
    queryFn: () => ConversationService.getConversationByConvoType(CONVERSATION_TYPES.IMAGE),
    staleTime: STALE_TIME,
  });
};

export const useUpdateConversationApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, conversation }: { id: string; conversation: object }) =>
      ConversationService.updateConversation(id, conversation),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() }), // Refetch conversations after an update
    onError: (error: unknown) => {
      handleApiErrorToast(error);
    }
  });
};

export const useDeleteConversationApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ConversationService.deleteConversation(id),
    onSuccess: (_, id) => {
      // ✅ remove conversation query using exact key
      queryClient.removeQueries({ queryKey: [...queryKey.conversations(), id], exact: true });

      // ✅ remove messages query using standardized helper (converts to number)
      queryClient.removeQueries({ queryKey: queryKey.messages(Number(id)), exact: true });

      // refresh conversations list
      queryClient.invalidateQueries({ queryKey: queryKey.conversations() });
    },
    onError: (error: unknown) => handleApiErrorToast(error),
  });
};
