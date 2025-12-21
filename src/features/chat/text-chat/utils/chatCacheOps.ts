import type { QueryClient } from "@tanstack/react-query";
import type { MessagePage, MessageView } from "@/features/chat/types/models"; // adjust
import { queryKey } from "@/lib/react-query/keys"; // adjust
import { normalizePartsWithText, ensurePage } from "./messageParts";
import { streamChat } from "@/features/chat/api/chatApi"; // adjust

const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

export const createMessageCacheOps = (
  queryClient: QueryClient,
  conversationId: number
) => {
  const key = queryKey.messages(conversationId);

  const getPage = (): MessagePage =>
    queryClient.getQueryData<MessagePage>(key) ?? {
      messages: [],
      nextCursor: null,
    };

  const pushMessage = (msg: MessageView) => {
    queryClient.setQueryData<MessagePage>(key, (old) => {
      const base = ensurePage(old);
      return { ...base, messages: [...(base.messages || []), msg] };
    });
  };

  const updateMessageTextById = (id: number, nextText: string) => {
    queryClient.setQueryData<MessagePage>(key, (old) => {
      const base = ensurePage(old);
      return {
        ...base,
        messages: (base.messages || []).map((m) =>
          m.id === id
            ? ({
                ...m,
                parts: normalizePartsWithText(m.parts as any[], nextText),
              } as any)
            : m
        ),
      };
    });
  };

  const invalidateConversation = (cid: number) => {
    queryClient.invalidateQueries({ queryKey: key });
  };

  // Keep streamChat “behind” cacheOps so the hook stays tiny
  const stream = async (
    conversationId: number,
    chatRequestBody: any,
    onEvent: (event: any) => void
  ) => {
    await streamChat(
      conversationId,
      chatRequestBody,
      onEvent,
      new AbortController().signal
    );
  };

  return {
    key,
    getPage,
    pushMessage,
    updateMessageTextById,
    invalidateConversation,
    streamChat: stream,
  };
};
