import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/lib/messageApi";
import { queryKey } from "../query/keys";
import {
  SaveMessageRequest,
  MessageView,
  MessagePartRequest,
  MessagePage,
  ChatRequestBody,
} from "@/types/models";
import { streamChat } from "../chatApi";
import { useDispatch, useSelector } from "react-redux";
import {
  concatenateDelta,
  endStreaming,
  startStreaming,
} from "@/redux/chat-interface-slice";

/* ---------------------------
 * Cache helpers
 * -------------------------- */
const cacheKey = (conversationId: number) => queryKey.messages(conversationId);

function append(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: number,
  msg: MessageView
) {
  queryClient.setQueryData<MessageView[]>(
    cacheKey(conversationId),
    (old = []) => [...old, msg]
  );
}

function replace(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: number,
  predicate: (m: MessageView) => boolean,
  replacer: (m: MessageView) => MessageView
) {
  queryClient.setQueryData<MessageView[]>(
    cacheKey(conversationId),
    (old = []) => (old || []).map((m) => (predicate(m) ? replacer(m) : m))
  );
}

function remove(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: number,
  predicate: (m: MessageView) => boolean
) {
  queryClient.setQueryData<MessageView[]>(
    cacheKey(conversationId),
    (old = []) => (old || []).filter((m) => !predicate(m))
  );
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
    staleTime: 60_000,
    enabled: !!conversationId,
  });

/* ---------------------------
 * Mutations with light optimistic updates
 * -------------------------- */
export const useCreateMessages = (conversationId: number) => {
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
            ({ type: "text", text: "" } as any);

          // Normalize the remaining parts to MessagePartRequest and ensure `type` is defined
          const restParts: MessagePartRequest[] = (m.parts?.slice(1) ?? []).map(
            (p) =>
            ({
              ...(p as any),
              type: (p as any)?.type ?? "text",
            } as MessagePartRequest)
          );

          const newParts: MessagePartRequest[] = [
            { ...firstPart, type: "text", text: nextText },
            ...restParts,
          ];
          return { ...m, parts: newParts } as MessageView;
        }),
      };
    });
  };

  return useMutation({
    // STREAM + SAVE
    mutationFn: async (chatRequestBody: ChatRequestBody) => {
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
        if (item.type === "input_text") {
          // userText = item.text;
          messageParts.push({ type: "text", text: item.text });
        } else if (item.type === "input_image") {
          messageParts.push({ type: "image", mimeType: "image/jpeg" });
          console.log("Image Type", item.type);
        } else if (item.type === "input_file") {
          messageParts.push({ type: "file", mimeType: "application/pdf" });
          console.log("File Type", item.type);
        } else {
          throw new Error("Invalid Input Type");
        }
      })

      // const userText = chatRequestBody.messages[0]?.content ?? "";
      const tempUserId = Number(`-1${Math.floor(Math.random() * 1e9)}`);
      const tempUser: MessageView = {
        id: tempUserId,
        conversationId,
        role: "user",
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
          role: "assistant",
          authorId: modelId,
          model: modelId,
          parts: [{ type: "text", text: "" }],
          createdAt: new Date(),
        } as any;
        pushMessage(tempAssistant);
        tempsByModel.set(modelId, { id: tid, modelId, text: "" });
      };

      if (isConsensus) {
        addAssistantPlaceholder("consensus");
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
        chatRequestBody,
        (event) => {
          const name = event.event;
          const data = event.data || {};

          if (name === "chat.response.created") {
            return;
          }

          if (name === "chat.response.delta") {
            const modelId: string = data.model || "unknown";
            const chunk: string = data.delta?.text || "";
            if (!chunk) return;

            // 1) UI live (Redux-driven columns)
            dispatch(concatenateDelta(modelId, chunk));

            // 2) Cache live (update placeholder text)
            const prev = finalByModel.get(modelId) ?? "";
            const next = prev + chunk;
            finalByModel.set(modelId, next);

            const temp = tempsByModel.get(modelId);
            if (temp) {
              updateMessageTextById(temp.id, next);
              temp.text = next; // keep in local map as well
            }
            return;
          }

          if (name === "chat.response.completed") {
            completedCount += 1;
            if (completedCount >= expectedStreams) {
              dispatch(endStreaming());
            }
            return;
          }

          if (name === "consensus") {
            const modelId = "consensus";
            const chunk: string = data?.delta?.text || "";
            if (chunk) {
              dispatch(concatenateDelta(modelId, chunk));

              const prev = finalByModel.get(modelId) ?? "";
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
        role: "user",
        authorId: "user-123",
        parts: messageParts,
      });

      // assistants (from finalByModel or temp cache if empty)
      if (finalByModel.size > 0) {
        for (const [modelId, text] of finalByModel.entries()) {
          bodies.push({
            role: "assistant",
            authorId: modelId,
            model: modelId,
            parts: [{ type: "text", text }],
          });
        }
      } else {
        // fall back to temps if no deltas came through
        for (const [, t] of tempsByModel) {
          bodies.push({
            role: "assistant",
            authorId: t.modelId,
            parts: [{ type: "text", text: t.text }],
          });
        }
      }
      console.log("Bodies:", bodies);
      const saved = await messageApi.createBatch(conversationId, bodies);

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

export const useUpdateMessages = (
  conversationId: number,
  messageId: number
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
            ({ type: "text", text: "" } as any);

          // Normalize the remaining parts to MessagePartRequest and ensure `type` is defined
          const restParts: MessagePartRequest[] = (m.parts?.slice(1) ?? []).map(
            (p) =>
            ({
              ...(p as any),
              type: (p as any)?.type ?? "text",
            } as MessagePartRequest)
          );

          const newParts: MessagePartRequest[] = [
            { ...firstPart, type: "text", text: nextText },
            ...restParts,
          ];
          return { ...m, parts: newParts } as MessageView;
        }),
      };
    });
  };

  return useMutation({
    // STREAM + SAVE
    mutationFn: async (chatRequestBody: ChatRequestBody) => {
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
        if (item.type === "input_text") {
          // userText = item.text;
          messageParts.push({ type: item.type, text: item.text });
        } else if (item.type === "input_image") {
          messageParts.push({ type: item.type, mimeType: "image/jpeg" });
          console.log("Image Type", item.type);
        } else if (item.type === "input_file") {
          messageParts.push({ type: item.type, mimeType: "application/pdf" });
          console.log("File Type", item.type);
        } else {
          throw new Error("Invalid Input Type");
        }
      })
      const tempUserId = Number(`-1${Math.floor(Math.random() * 1e9)}`);
      const tempUser: MessageView = {
        id: tempUserId,
        conversationId,
        role: "user",
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
          role: "assistant",
          authorId: modelId,
          model: modelId,
          parts: [{ type: "text", text: "" }],
          createdAt: new Date(),
        } as any;
        pushMessage(tempAssistant);
        tempsByModel.set(modelId, { id: tid, modelId, text: "" });
      };

      if (isConsensus) {
        addAssistantPlaceholder("consensus");
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
        chatRequestBody,
        (event) => {
          const name = event.event;
          const data = event.data || {};

          if (name === "chat.response.created") {
            return;
          }

          if (name === "chat.response.delta") {
            const modelId: string = data.model || "unknown";
            const chunk: string = data.delta?.text || "";
            if (!chunk) return;

            // 1) UI live (Redux-driven columns)
            dispatch(concatenateDelta(modelId, chunk));

            // 2) Cache live (update placeholder text)
            const prev = finalByModel.get(modelId) ?? "";
            const next = prev + chunk;
            finalByModel.set(modelId, next);

            const temp = tempsByModel.get(modelId);
            if (temp) {
              updateMessageTextById(temp.id, next);
              temp.text = next; // keep in local map as well
            }
            return;
          }

          if (name === "chat.response.completed") {
            completedCount += 1;
            if (completedCount >= expectedStreams) {
              dispatch(endStreaming());
            }
            return;
          }

          if (name === "consensus") {
            const modelId = "consensus";
            const chunk: string = data?.delta?.text || "";
            if (chunk) {
              dispatch(concatenateDelta(modelId, chunk));

              const prev = finalByModel.get(modelId) ?? "";
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
        role: "user",
        authorId: "user-123",
        parts: messageParts as MessagePartRequest[],
      });

      // assistants (from finalByModel or temp cache if empty)
      if (finalByModel.size > 0) {
        for (const [modelId, text] of finalByModel.entries()) {
          bodies.push({
            role: "assistant",
            authorId: modelId,
            model: modelId,
            parts: [{ type: "text", text }],
          });
        }
      } else {
        // fall back to temps if no deltas came through
        for (const [, t] of tempsByModel) {
          bodies.push({
            role: "assistant",
            authorId: t.modelId,
            parts: [{ type: "text", text: t.text }],
          });
        }
      }

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

export const useDeleteMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => messageApi.remove(id, conversationId),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      const prev =
        queryClient.getQueryData<MessageView[]>(cacheKey(conversationId)) || [];

      remove(queryClient, conversationId, (m) => m.id === id);

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },
  });
};
