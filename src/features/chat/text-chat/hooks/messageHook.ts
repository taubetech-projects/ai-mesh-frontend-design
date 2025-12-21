import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/features/chat/text-chat/api/messageApi";
import { toast } from "sonner";
import { queryKey } from "@/lib/react-query/keys";
import {
  SaveMessageRequest,
  MessageView,
  MessagePartRequest,
  MessagePage,
  ChatRequestBody,
} from "@/features/chat/types/models";
import { streamChat } from "@/features/chat/api/chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  concatenateDelta,
  endStreaming,
  startStreaming,
} from "@/features/chat/store/chat-interface-slice";
import {
  CHAT_MODES,
  CHAT_STREAM_EVENT_TYPES,
  CONTENT_INPUT_TYPES,
  EMPTY_STRING,
  MESSAGE_PART_TYPES,
  MIME_TYPES,
  ROLES,
  STALE_TIME,
} from "@/shared/constants/constants";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

function remove(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: number,
  predicate: (m: MessageView) => boolean
) {
  queryClient.setQueryData<MessagePage>(cacheKey(conversationId), (oldPage) => {
    if (!oldPage) return { messages: [], nextCursor: null };
    const newMessages = (oldPage.messages || []).filter((m) => !predicate(m));
    return {
      ...oldPage,
      messages: newMessages,
    };
  });
}

/* ---------------------------
 * Queries
 * -------------------------- */
export const useGetMessagesByConversationId = (conversationId: number) =>
  useQuery({
    queryKey: cacheKey(conversationId), // ✅ no double-wrapping
    // 👇 listByConversation must return { messages, nextCursor }
    queryFn: () =>
      messageApi.listByConversation(conversationId) as Promise<MessagePage>,
    staleTime: STALE_TIME,
    enabled: !!conversationId,
  });

export const useUpdateMessages = (
  conversationId: number,
  editedMessageId: number
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // small helpers for cache (MessagePage wrapper)
  const getPage = () =>
    queryClient.getQueryData<MessagePage>(cacheKey(conversationId)) ?? {
      messages: [],
      nextCursor: null,
    };

  const pushMessage = (msg: MessageView) => {
    queryClient.setQueryData<MessagePage>(cacheKey(conversationId), (old) => {
      const base = (old as MessagePage) ?? {
        messages: [],
        nextCursor: null,
      };
      return { ...base, messages: [...(base.messages || []), msg] };
    });
  };

  const updateMessageTextById = (id: number, nextText: string) => {
    queryClient.setQueryData<MessagePage>(cacheKey(conversationId), (old) => {
      const base = (old as MessagePage) ?? {
        messages: [],
        nextCursor: null,
      };
      return {
        ...base,
        messages: (base.messages || []).map((m) => {
          if (m.id !== id) return m;
          const firstPart =
            (m.parts?.[0] as MessagePartRequest) ??
            ({ type: MESSAGE_PART_TYPES.TEXT, text: EMPTY_STRING } as any);

          // Normalize the remaining parts to MessagePartRequest and ensure `type` is defined
          const restParts: MessagePartRequest[] = (m.parts?.slice(1) ?? []).map(
            (p) =>
              ({
                ...(p as any),
                type: (p as any)?.type ?? MESSAGE_PART_TYPES.TEXT,
              } as MessagePartRequest)
          );

          const newParts: MessagePartRequest[] = [
            { ...firstPart, type: MESSAGE_PART_TYPES.TEXT, text: nextText },
            ...restParts,
          ];
          return { ...m, parts: newParts } as MessageView;
        }),
      };
    });
  };

  return useMutation({
    // STREAM + SAVE
    mutationFn: async ({
      messageId,
      chatRequestBody,
    }: {
      messageId: number;
      chatRequestBody: ChatRequestBody;
    }) => {
      if (!conversationId) throw new Error("Missing conversationId");
      if (!chatRequestBody) throw new Error("Missing chatRequestBody");
      if (!chatRequestBody.messages?.length)
        throw new Error("Missing chatRequestBody.messages.length");

      const isConsensus = chatRequestBody.mode === "consensus";
      if (!isConsensus) {
        if (!chatRequestBody.routes?.length) {
          throw new Error("Missing chatRequestBody.routes for multi-model run");
        }
      }

      // --- Optimistic: user message + assistant placeholders in cache ---
      // (We do it here so we can keep ids for streaming updates.)
      const pageBefore = getPage();

      // 1) Optimistically add user message
      let messageParts: MessagePartRequest[] = [];

      chatRequestBody.messages[0]?.content.map((item) => {
        if (item.type === CONTENT_INPUT_TYPES.INPUT_TEXT) {
          // userText = item.text;
          messageParts.push({ type: MESSAGE_PART_TYPES.TEXT, text: item.text });
        } else if (item.type === CONTENT_INPUT_TYPES.INPUT_IMAGE) {
          messageParts.push({ type: item.type, mimeType: MIME_TYPES.JPEG });
          console.log("Image Type", item.type);
        } else if (item.type === CONTENT_INPUT_TYPES.INPUT_FILE) {
          messageParts.push({ type: item.type, mimeType: MIME_TYPES.PDF });
          console.log("File Type", item.type);
        } else {
          throw new Error("Invalid Input Type");
        }
      });
      const tempUserId = Number(`-1${Math.floor(Math.random() * 1e9)}`);
      const tempUser: MessageView = {
        id: tempUserId,
        conversationId,
        role: ROLES.USER,
        authorId: "user-123",
        parts: messageParts,
      } as any;
      pushMessage(tempUser);

      // 2) Add assistant placeholders (one per model, or one consensus)
      type TempInfo = { id: number; modelId: string; text: string };
      const tempsByModel = new Map<string, TempInfo>();

      const addAssistantPlaceholder = (modelId: string) => {
        const tid = Number(`-2${Math.floor(Math.random() * 1e9)}`);
        const tempAssistant: MessageView = {
          id: tid,
          conversationId,
          role: ROLES.ASSISTANT,
          authorId: modelId,
          model: modelId,
          parts: [{ type: MESSAGE_PART_TYPES.TEXT, text: EMPTY_STRING }],
          createdAt: new Date(),
        } as any;
        pushMessage(tempAssistant);
        tempsByModel.set(modelId, { id: tid, modelId, text: EMPTY_STRING });
      };

      if (isConsensus) {
        addAssistantPlaceholder(CHAT_MODES.CONSENSUS);
      } else {
        for (const r of chatRequestBody.routes!) {
          addAssistantPlaceholder(r.model);
        }
      }

      // --- Stream handling ---
      const finalByModel = new Map<string, string>();
      let completedCount = 0;
      const expectedStreams = isConsensus ? 1 : chatRequestBody.routes!.length;

      dispatch(startStreaming());

      await streamChat(
        conversationId,
        chatRequestBody,
        (event) => {
          const name = event.event;
          const data = event.data || {};

          if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_CREATED) {
            return;
          }

          if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_DELTA) {
            const modelId: string = data.model || "unknown";
            const chunk: string = data.delta?.text || EMPTY_STRING;
            if (!chunk) return;

            // 1) UI live (Redux-driven columns)
            dispatch(concatenateDelta(modelId, chunk));

            // 2) Cache live (update placeholder text)
            const prev = finalByModel.get(modelId) ?? EMPTY_STRING;
            const next = prev + chunk;
            finalByModel.set(modelId, next);

            const temp = tempsByModel.get(modelId);
            if (temp) {
              updateMessageTextById(temp.id, next);
              temp.text = next; // keep in local map as well
            }
            return;
          }

          if (name === CHAT_STREAM_EVENT_TYPES.CHAT_RESPONSE_COMPLETED) {
            completedCount += 1;
            if (completedCount >= expectedStreams) {
              dispatch(endStreaming());
            }
            return;
          }

          if (name === CHAT_STREAM_EVENT_TYPES.CONSENSUS) {
            const modelId = CHAT_MODES.CONSENSUS;
            const chunk: string = data?.delta?.text || EMPTY_STRING;
            if (chunk) {
              dispatch(concatenateDelta(modelId, chunk));

              const prev = finalByModel.get(modelId) ?? EMPTY_STRING;
              const next = prev + chunk;
              finalByModel.set(modelId, next);

              const temp = tempsByModel.get(modelId);
              if (temp) {
                updateMessageTextById(temp.id, next);
                temp.text = next;
              }
            }
            // consensus is last -> stop stream
            dispatch(endStreaming());
            return;
          }
        },
        new AbortController().signal
      );

      // --- Persist final messages to DB ---
      const bodies: SaveMessageRequest[] = [];

      // user
      bodies.push({
        role: ROLES.USER,
        mode: chatRequestBody.mode,
        authorId: "user-123",
        parts: messageParts as MessagePartRequest[],
      });

      // assistants (from finalByModel or temp cache if empty)
      if (finalByModel.size > 0) {
        for (const [modelId, text] of finalByModel.entries()) {
          bodies.push({
            role: ROLES.ASSISTANT,
            authorId: modelId,
            model: modelId,
            mode: chatRequestBody.mode,
            parts: [{ type: MESSAGE_PART_TYPES.TEXT, text }],
          });
        }
      } else {
        // fall back to temps if no deltas came through
        for (const [, t] of tempsByModel) {
          bodies.push({
            role: ROLES.ASSISTANT,
            mode: chatRequestBody.mode,
            authorId: t.modelId,
            parts: [{ type: MESSAGE_PART_TYPES.TEXT, text: t.text }],
          });
        }
      }
      console.log("bodies from updateBatch", bodies);
      const saved = await messageApi.updateBatch(
        conversationId,
        messageId,
        bodies
      );

      // We could replace temp ids with saved ids; simplest is to revalidate:
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });

      return saved;
    },

    // Keep onMutate just for rollback safety
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKey.messages(conversationId),
      });
      const prev = queryClient.getQueryData<MessagePage>(
        queryKey.messages(conversationId)
      ) ?? {
        messages: [],
        nextCursor: null,
      };
      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(queryKey.messages(conversationId), ctx.prev);
      }
      // also ensure streaming flag off
      dispatch(endStreaming());
    },

    onSuccess: () => {
      // (already invalidated in mutationFn after save)
    },
  });
};

export const useDeleteForAllModels = (conversationId: number) => {
  const queryClient = useQueryClient();
  console.log("Delete for all conversation", conversationId);

  return useMutation({
    mutationFn: (id: number) =>
      messageApi.removeForAllModel(id, conversationId),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      );

      remove(queryClient, conversationId, (m) => m.id === id);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      console.log("Delete all models error", _err, _id, ctx);
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully.");
    },
  });
};

export const useDeleteForSingleModel = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, model }: { messageId: number; model: string }) =>
      messageApi.removeForSingleModel(messageId, conversationId, model),

    onMutate: async ({ messageId }) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      // Correctly get the previous state as a MessagePage object
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      );
      remove(queryClient, conversationId, (m) => m.id === messageId);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },

    onSuccess: () => {
      toast.success("Message deleted successfully for this model.");
    },
  });
};
