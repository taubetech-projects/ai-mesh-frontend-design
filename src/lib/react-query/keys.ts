export const queryKey = {
  conversations: () => ["conversations"] as const,
  messages: (conversationId: number | null) =>
    ["conversations", conversationId, "messages"] as const,
};

export const qk = {
  me: () => ["auth", "me"] as const,
};
