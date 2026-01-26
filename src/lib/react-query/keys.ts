export const queryKey = {
  conversations: (userId: string | null) => ["conversations", userId] as const,
  messages: (userId: string | null, conversationId: number | null) =>
    ["conversations", userId, conversationId, "messages"] as const,
};

export const qk = {
  me: () => ["auth", "me"] as const,
};
