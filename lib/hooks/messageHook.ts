import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageApi } from "@/lib/messageApi";
import { queryKey } from "../query/keys";
import {
  SaveMessageRequest,
  MessageView,
  MessagePartRequest,
  MessagePage,
} from "@/types/models";

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
export const useCreateMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveMessageRequest) =>
      messageApi.create(conversationId, body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      const prev =
        queryClient.getQueryData<MessageView[]>(cacheKey(conversationId)) || [];

      const temp: MessageView = {
        // temp id for UI; your backend id will replace it
        id: Number(`-1${Date.now()}`),
        conversationId,
        role: body.role,
        authorId: body.authorId,
        // optional fields as needed:
        parts: body.parts as any,
        createdAt: new Date(),
      } as any;

      append(queryClient, conversationId, temp);

      return { prev, tempId: temp.id };
    },

    onError: (_err, _body, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSuccess: (saved, _body, ctx) => {
      if (!ctx) return;
      replace(
        queryClient,
        conversationId,
        (m) => m.id === ctx.tempId,
        () => saved
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },
  });
};

export const useCreateMessages = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bodies: SaveMessageRequest[]) => {
      if (!conversationId) throw new Error("Missing conversationId");
      return messageApi.createBatch(conversationId, bodies); // returns MessageView[]
    },

    onMutate: async (bodies) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      // ⬇️ Read the wrapper shape from cache
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      ) || {
        messages: [],
        nextCursor: null,
      };

      // Build temporary client-side messages
      const temps: MessageView[] = bodies.map((body) => ({
        id: Number(`-1${Math.floor(Math.random() * 1e9)}`),
        conversationId,
        role: body.role,
        authorId: body.authorId,
        parts: body.parts as MessagePartRequest[],
        createdAt: new Date(),
      })) as any;

      // ⬇️ Write back the wrapper with appended temps
      queryClient.setQueryData<MessagePage>(cacheKey(conversationId), {
        messages: [...(prev.messages || []), ...temps],
        nextCursor: prev.nextCursor ?? null, // keep whatever the server gave last
      });

      return { prev, tempIds: temps.map((t) => t.id) };
    },

    onError: (_err, _bodies, ctx) => {
      if (!ctx) return;
      // ⬇️ Restore the previous wrapper
      queryClient.setQueryData<MessagePage>(cacheKey(conversationId), ctx.prev);
    },

    onSuccess: (_saved) => {
      // simplest: refetch to reconcile server IDs/order/nextCursor
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },
  });
};

export const useUpdateMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: number; body: SaveMessageRequest }) =>
      messageApi.update(args.id, conversationId, args.body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });
      const prev =
        queryClient.getQueryData<MessageView[]>(cacheKey(conversationId)) || [];

      replace(
        queryClient,
        conversationId,
        (m) => m.id === id,
        (m) =>
          ({
            ...m,
            role: body.role ?? m.role,
            parts: (body.parts as any) ?? m.parts,
          } as MessageView)
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(cacheKey(conversationId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
    },
  });
};

export const useUpdateMessages = (
  conversationId: number,
  messageId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bodies: SaveMessageRequest[]) =>
      messageApi.updateBatch(conversationId, messageId, bodies), // returns MessageView[]

    onMutate: async (bodies) => {
      await queryClient.cancelQueries({ queryKey: cacheKey(conversationId) });

      // ⬇️ Read the wrapper shape from cache
      const prev = queryClient.getQueryData<MessagePage>(
        cacheKey(conversationId)
      ) || {
        messages: [],
        nextCursor: null,
      };

      // Build temporary client-side messages
      const temps: MessageView[] = bodies.map((b) => ({
        id: Number(`-1${Math.floor(Math.random() * 1e9)}`),
        conversationId,
        role: b.role,
        authorId: b.authorId,
        parts: b.parts as MessagePartRequest[],
        createdAt: new Date(),
      })) as any;

      // ⬇️ Write back the wrapper with appended temps
      queryClient.setQueryData<MessagePage>(cacheKey(conversationId), {
        messages: [...(prev.messages || []), ...temps],
        nextCursor: prev.nextCursor ?? null, // keep whatever the server gave last
      });

      return { prev, tempIds: temps.map((t) => t.id) };
    },

    onError: (_err, _bodies, ctx) => {
      if (!ctx) return;
      // ⬇️ Restore the previous wrapper
      queryClient.setQueryData<MessagePage>(cacheKey(conversationId), ctx.prev);
    },

    onSuccess: (_saved) => {
      // simplest: refetch to reconcile server IDs/order/nextCursor
      queryClient.invalidateQueries({ queryKey: cacheKey(conversationId) });
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
