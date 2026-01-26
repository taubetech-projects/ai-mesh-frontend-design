import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKey } from "@/lib/react-query/keys";
import { CONVERSATION_TYPES, STALE_TIME } from "@/shared/constants/constants";
import { handleApiErrorToast } from "@/shared/utils/toast.helper";
import { ConversationService } from "../api/conversationApi";
import { ConvUpdateRequest } from "../types/conversationTypes";
import { useChatAuth } from "@/features/chat/auth/ChatAuthProvider";

// Custom hooks for CRUD operations
export const useCreateConversationApi = () => {
  const queryClient = useQueryClient();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  return useMutation({
    mutationFn: ConversationService.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.conversations(userId) }); // Refetch conversations after a new conversation is created
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.conversations(userId) });
    },
    onError: (error: unknown) => {
      handleApiErrorToast(error);
    },
  });
};

export const useGetConversationsApi = () => {
  const { me } = useChatAuth();
  return useQuery({
    queryKey: queryKey.conversations(me?.id ?? null),
    queryFn: ConversationService.getConversations,
    staleTime: STALE_TIME,
  });
};

export const useGetConversationById = (id: string) => {
  const { me } = useChatAuth();
  return useQuery({
    queryKey: [...queryKey.conversations(me?.id ?? null), id],
    queryFn: () => ConversationService.getConversationById(id),
    enabled: !!id,   // ✅ don't run without id
    retry: false,                // ✅ stops 1+3 retries = 4 calls
    refetchOnWindowFocus: false,
  });
};

export const useGetConversationsForChat = () => {
  const { me } = useChatAuth();
  return useQuery({
    queryKey: [...queryKey.conversations(me?.id ?? null), "chat"],
    queryFn: () => ConversationService.getConversationByConvoType(CONVERSATION_TYPES.CHAT),
    staleTime: STALE_TIME,
  });
};

export const useGetConversationsForImage = () => {
  const { me } = useChatAuth();
  return useQuery({
    queryKey: [...queryKey.conversations(me?.id ?? null), "image"],
    queryFn: () => ConversationService.getConversationByConvoType(CONVERSATION_TYPES.IMAGE),
    staleTime: STALE_TIME,
  });
};

export const useUpdateConversationApi = () => {
  const queryClient = useQueryClient();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  return useMutation({
    mutationFn: ({ id, conversation }: { id: string; conversation: ConvUpdateRequest }) => {
      return ConversationService.updateConversation(id, conversation);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKey.conversations(userId) }), // Refetch conversations after an update
    onError: (error: unknown) => {
      handleApiErrorToast(error);
    }
  });
};

export const useDeleteConversationApi = () => {
  const queryClient = useQueryClient();
  const { me } = useChatAuth();
  const userId = me?.id ?? null;

  return useMutation({
    mutationFn: (id: string) => ConversationService.deleteConversation(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [...queryKey.conversations(userId), id] });
      await queryClient.cancelQueries({ queryKey: queryKey.messages(userId, Number(id)) });

      // Remove from cache immediately
      queryClient.removeQueries({ queryKey: [...queryKey.conversations(userId), id], exact: true });
      queryClient.removeQueries({ queryKey: queryKey.messages(userId, Number(id)), exact: true });
    },
    onSuccess: (_, id) => {
      // refresh conversations list
      queryClient.invalidateQueries({ queryKey: queryKey.conversations(userId) });
    },
    onError: (error: unknown) => handleApiErrorToast(error),
  });
};
